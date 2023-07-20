import React, { useState } from "react";

// TODO: Allow user to choose between development and production environment.
const BASE_URL = "https://api-dev.microbiomedata.org";
const ENDPOINT_PATH = "/metadata/changesheets:validate";
const url = `${BASE_URL}${ENDPOINT_PATH}`;

function App() {
  // Initialize the component state.
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseText, setResponseText] = useState<string>("");
  const [responseStatusCode, setResponseStatusCode] = useState<number>(-1);

  // Define callback function for when the file input selected changes.
  const onFileInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the response information in the component state.
    setResponseStatusCode(-1);
    setResponseText("");

    const files = evt.target.files as FileList;
    setSelectedFile(files[0]);
  };

  // Define callback functionf for when validation button gets clicked.
  const onSubmit = async () => {
    setIsLoading(true);

    // If a file is selected, send it to the API for validation; otherwise, alert the user.
    if (selectedFile instanceof File) {
      const formData = new FormData();
      formData.append(
        "uploaded_file",
        new Blob([selectedFile], { type: selectedFile.type }),
      );

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      setResponseStatusCode(res.status);

      const response = await res.text();
      setResponseText(response);
    } else {
      alert("Please choose a file first.");
      return;
    }

    setIsLoading(false);
  };

  // Set some flags based upon the value of the status code from the API response.
  const isStatusCodeSuccessful =
    200 <= responseStatusCode && responseStatusCode <= 299;
  const isStatusCodeUnsuccessful =
    400 <= responseStatusCode && responseStatusCode <= 499;

  return (
    <div style={{ padding: "2rem" }}>
      {/* Form inputs. */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input type={"file"} onChange={onFileInputChange} />
          <button
            onClick={onSubmit}
            disabled={selectedFile instanceof File === false || isLoading}
          >
            Validate
          </button>
        </div>
      </div>

      {/* Validation result. */}
      <div
        style={{
          width: "100%",
          borderWidth: "0.25rem 0rem 0rem 0rem",
          borderStyle: "solid",
          borderColor: isStatusCodeSuccessful
            ? "#00FF00"
            : isStatusCodeUnsuccessful
            ? "#FF0000"
            : "#C9C9C9",
        }}
      >
        <textarea
          readOnly
          style={{ width: "100%", boxSizing: "border-box" }}
          rows={30}
          value={responseText}
          placeholder="Validation result will appear here..."
        />
      </div>
    </div>
  );
}

export default App;
