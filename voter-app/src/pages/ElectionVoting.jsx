import { useState, useEffect } from "react";
import axios from "axios";

const ElectionVoting = () => {
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/election/election-status")
      .then((res) => setElectionStatus(res.data.status))
      .catch((err) => console.error("Error fetching election status:", err));
  }, []);
  
  useEffect(() => {
    if (electionStatus === "ongoing") {
      axios.get("http://localhost:5000/api/candidates")
        .then((res) => setCandidates(res.data))
        .catch((err) => console.error("Error fetching candidates:", err));
    }
  }, [electionStatus]); // Run this effect when electionStatus updates Run when election status changes
   
  const handleSelection = (position, candidateId) => {
    setSelectedCandidate((prev) => ({
      ...prev,
      [position]: candidateId, //  Store candidate selection by position
    }));
  };

  const handleVote = async () => {
    if (!selectedCandidate || Object.keys(selectedCandidate).length === 0) {
      alert("Please select at least one candidate.");
      return;
    }
  
    const token = localStorage.getItem("token");
    console.log("📌 Token being sent:", token); //  Check if token exists
    if (!token) {
      alert("You must be logged in to vote.");
      return;
    }
    console.log("inside voting route")
    console.log("hii")
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vote",
        { votes: selectedCandidate },                     //candidate id and position is stored in votes 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert(response.data.message);
      //setSelectedCandidate({}); 
    } catch (error) {
      console.error("Voting error:", error.response?.data || error);
      alert(error.response?.data?.message || "Error submitting vote.");
    }
  };
  
  
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    acc[candidate.position] = acc[candidate.position] || [];
    acc[candidate.position].push(candidate);
    return acc;
  }, {});


return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Election Voting</h1>

    {electionStatus !== "ongoing" ? (
      <p className="text-red-500 text-lg font-semibold">
        ❌ Voting is not available right now. The election has not been declared.
      </p>
    ) : (
      <div>
        <h2 className="text-xl font-semibold mb-4">Vote for Your Candidate</h2>
        {Object.keys(groupedCandidates).map((position) => (
          <div key={position} className="mb-6">
            <h3 className="text-lg font-bold mb-2">{position}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedCandidates[position].map((candidate) => (
                <li key={candidate._id} className="border p-4 rounded-lg shadow-lg flex items-center">
                  <img src={`http://localhost:5000/${candidate.document}`} alt={candidate.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <p className="text-lg font-semibold">{candidate.firstname}{candidate.lastname} </p>
                    <p className="text-sm text-gray-600">{candidate.department} | Year: {candidate.year}</p>
                    <input
                      type="radio"
                      name={position}
                      value={candidate._id} 
                      checked={selectedCandidate[position] === candidate._id} 
                      onChange={() => handleSelection(position, candidate._id)}
                      className="mt-2"
                    /> Select
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button
          onClick={handleVote}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit Vote
        </button>
      </div>
    )}
  </div>
);
};
export default ElectionVoting;
