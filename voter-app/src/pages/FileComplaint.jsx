
import { useState, useEffect } from "react";
import axios from "axios";

const FileComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);

  const studentId = localStorage.getItem("userId"); // Get student ID from localStorage

  // Fetch submitted complaints when component loads
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/complaints/student/${studentId}`);
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    if (studentId) {
      fetchComplaints();
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/complaints/file", {
        studentId,
        title,
        description,
      });
      alert("Complaint submitted successfully.");
      setTitle("");
      setDescription("");

      // Refresh complaint list
      const response = await axios.get(`http://localhost:5000/api/complaints/student/${studentId}`);
      setComplaints(response.data);
    } catch (error) {
      alert("Error submitting complaint.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">File a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Complaint Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe your complaint..."
          className="w-full p-2 border rounded"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Your Submitted Complaints</h3>
      {complaints.length === 0 ? (
        <p className="text-gray-600">You have not submitted any complaints yet.</p>
      ) : (
        <ul className="space-y-4">
          {complaints.map((comp) => (
            <li key={comp._id} className="p-4 border rounded shadow">
              <p><strong>Title:</strong> {comp.title}</p>
              <p><strong>Description:</strong> {comp.description}</p>
              <p><strong>Status:</strong> <span className="text-blue-700 font-medium">{comp.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileComplaint;
