import { useEffect, useState } from "react";
import axios from "axios";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/all");
      setComplaints(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/status/${id}`, {
        status: newStatus,
      });
      fetchComplaints(); // Refresh after status update
    } catch (error) {
      alert("Error updating status");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Complaints</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints filed.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="border p-4 rounded shadow">
              <p><strong>Title:</strong> {complaint.title}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Filed by:</strong> {complaint.studentId?.name} ({complaint.studentId?.username})</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateStatus(complaint._id, "In Progress")}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(complaint._id, "Resolved")}
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewComplaints;
