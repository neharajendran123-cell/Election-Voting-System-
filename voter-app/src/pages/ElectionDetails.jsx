import { useEffect, useState } from "react";
import axios from "axios";

const ElectionDetails = () => {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    // Hardcoded for now – or you can fetch filename from DB
    const url = "http://localhost:5000/uploads/electionDetails/election-details.jpg"; // or .pdf
    setFileUrl(url);
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📄 Election Details</h1>
      {fileUrl.endsWith(".pdf") ? (
        <iframe
          src={fileUrl}
          width="100%"
          height="600px"
          title="Election Details PDF"
          className="rounded"
        />
      ) : (
        <img
          src={fileUrl}
          alt="Election Details"
          className="w-full max-w-3xl rounded shadow"
        />
      )}
    </div>
  );
};

export default ElectionDetails;
