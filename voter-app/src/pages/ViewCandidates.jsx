import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewCandidates = () => {
  const [candidates, setCandidates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/approved");
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <p className="text-center">Loading candidates...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Approved Candidates</h2>
      <Link to="/dashboard" className="text-blue-500">⬅ Back to Dashboard</Link>
      <div className="mt-4">
        {Object.keys(candidates).length === 0 ? (
          <p className="text-center text-gray-600">No candidates available.</p>
        ) : (
          Object.keys(candidates).map((position) => (
            <div key={position} className="mb-6">
              <h3 className="text-xl font-semibold bg-gray-100 p-2 rounded-md">{position}</h3>
              <ul className="border rounded-lg p-4 bg-white shadow-md">
                {candidates[position].map((candidate) => (
                  <li key={candidate._id} className="border-b p-2 last:border-none">
                    <span className="font-medium">{candidate.firstname} {candidate.lastname}</span> - {candidate.department} ({candidate.year})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewCandidates;
