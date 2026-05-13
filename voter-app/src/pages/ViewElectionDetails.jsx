const ViewElectionDetails = () => {
    const fileUrl = "http://localhost:5000/uploads/electionDetails/election-details.pdf"; // or .docx etc.
  
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Election Details</h2>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Click here to view election details
        </a>
      </div>
    );
  };
  
  export default ViewElectionDetails;
  