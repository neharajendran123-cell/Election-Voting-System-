// src/pages/VotersList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VotersList = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/approved-students'); // Adjust the port as needed
        setVoters(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch voters', err);
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voters List</h1>
      {loading ? (
        <p>Loading voters...</p>
      ) : voters.length === 0 ? (
        <p>No registered voters found.</p>
      ) : (
        <ul className="bg-white shadow rounded-lg p-4">
          {voters.map((voter, index) => (
            <li key={voter._id} className="border-b py-2">
              <div className="font-semibold">{index + 1}. {voter.firstname} {voter.lastname}</div>
              <div className="text-sm text-gray-600">Year: {voter.year}</div>
              <div className="text-sm text-gray-600">Department: {voter.department}</div>
              <div className="text-sm text-gray-600">Gender: {voter.gender}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
}
export default VotersList;
