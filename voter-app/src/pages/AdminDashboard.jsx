import { useState, useEffect,useCallback  } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

const AdminDashboard = () => {
 
const [unapprovedStudents, setUnapprovedStudents] = useState([]);
const [registeredStudents, setRegisteredStudents] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [electionStatus, setElectionStatus] = useState(); 
  const [startDate, setStartDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [deadline, setDeadline] = useState("");
  const [currentDeadline, setCurrentDeadline] = useState("");



const [file, setFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState("");
const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    await axios.post("http://localhost:5000/api/admin/upload-election-detail", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUploadStatus("Upload successful!");
  } catch (error) {
    console.error("Error uploading file:", error);
    setUploadStatus("Upload failed. Try again.");
  }
};
const fetchUnapprovedStudents = useCallback(async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/unapproved-students");
    const data = await response.json();
    setUnapprovedStudents(data);
  } catch (error) {
    console.error("Error fetching unapproved students:", error);
  }
}, []);

// Fetch approved students
const fetchApprovedStudents = useCallback(async () => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/approved-students");
    const data = await response.json();
    setRegisteredStudents(data);
  } catch (error) {
    console.error("Error fetching approved students:", error);
  }
}, []);

// Fetch both when component mounts
useEffect(() => {
  fetchUnapprovedStudents();
  fetchApprovedStudents();
}, [fetchUnapprovedStudents, fetchApprovedStudents]);

// Approve a student
const approveStudent = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/approve/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    alert(data.message);

    // Refresh both lists
    fetchUnapprovedStudents();
    fetchApprovedStudents();
  } catch (error) {
    console.error("Error approving student:", error);
  }
};

  const handleNominationAction = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/nominations/${id}`, { status });
      setNominations((prevNominations) =>
        prevNominations.map((nomination) =>
          nomination._id === id ? { ...nomination, status } : nomination
        )
      );
      alert(`Nomination ${status} successfully!`);
    } catch (error) {
      console.error(`❌ Error updating nomination:`, error);
      alert("Error updating nomination. Please try again.");
    }
  };
  

useEffect(() => {
  fetchPositions();
}, []);

const fetchPositions = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/election/positions");
    setPositions(res.data.positions);
  } catch (error) {
    console.error("Error fetching positions", error);
  }
};

const addPosition = async () => {
  if (!newPosition.trim()) return alert("Position cannot be empty");

  try {
    const response = await axios.post("http://localhost:5000/api/election/add-position", {
      position: newPosition,
    });
    alert(response.data.message);
    setNewPosition("");
    fetchPositions(); // refresh list
  } catch (error) {
    alert("Error adding position");
  }
};


  // Fetch students
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));

    axios.get("http://localhost:5000/api/admin/nominations")
      .then((res) => setNominations(res.data))
      .catch((err) => console.error("Error fetching nominations:", err));

      axios.get("http://localhost:5000/api/election/election-status")
  .then((res) => {
    setElectionStatus(res.data.status); 
    setStartDate(res.data.startDate);
    setEndTime(res.data.endTime); 
  })
  .catch((err) => console.error("Error fetching election status:", err));
  }, []);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/election");
        if (response.data && response.data.nominationDeadline) {
          setCurrentDeadline(new Date(response.data.nominationDeadline).toLocaleString());
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
      }
    };

    fetchElection();
  }, []);

  const updateDeadline = async () => {
    try {
      if (!deadline) {
        alert("Please select a deadline date.");
        return;
      }

      await axios.put("http://localhost:5000/api/admin/set-nomination-deadline", {
        deadline,
      });

      alert("Nomination deadline updated successfully!");
      console.log("Updating Deadline to: ", new Date(deadline).toLocaleString());
      setCurrentDeadline(new Date(deadline).toLocaleString());
    } catch (error) {
      console.error("Error updating nomination deadline:", error);
      console.log("❌ Error Response:", error.response?.data); // <-- Add this line
      alert("Failed to update nomination deadline.");
    }
  };

  const declareElection = async () => {
    try {
      if (!currentDeadline) {
        alert("Please set the nomination deadline before declaring the election.");
        return;
      }
      const response = await axios.post("http://localhost:5000/api/election/declare-election", {
        status: "ongoing",
      });
      alert(response.data.message);
      setElectionStatus("ongoing");
    } catch (error) {
      alert("Error declaring election");
    }
  };
  const closeElection = async () => {
    try {
      const response = await axios.put("http://localhost:5000/api/election/close");
      alert(response.data.message);
      setElectionStatus("Closed");
    } catch (error) {
      alert("Error closing election");
    }
  };

  const ResetElectionButton = () => {
    const [loading, setLoading] = useState(false);
  
    const handleResetElection = async () => {
      if (!window.confirm("Are you sure you want to reset the election? This action cannot be undone.")) {
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/election/reset");
        alert(response.data.message);
      } catch (error) {
        alert("Error resetting election. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    
  return (
    <button
      onClick={handleResetElection}
      className="bg-red-600 text-white px-4 py-2 rounded mt-4"
      disabled={loading}
    >
      {loading ? "Resetting..." : "Reset Election"}
    </button>
  );
}

const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/"); // Redirect to login page
    };

  return (
       
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
     
      <button onClick={handleLogout} className=" bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    
            {/* Unapproved Students */}
      <h2 className="text-xl font-semibold mb-2">Pending Student Approvals</h2>
      {unapprovedStudents.length === 0 ? (
        <p className="text-gray-500 mb-6">No students pending approval.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Year</th>
              <th className="p-3 border">Department</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {unapprovedStudents.map((student) => (
              <tr key={student._id} className="border">
                <td className="p-3 border">
                  {student.firstname} {student.lastname}
                </td>
                <td className="p-3 border">{student.email}</td>
                <td className="p-3 border">{student.year}</td>
                <td className="p-3 border">{student.department}</td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => approveStudent(student._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

        {/* Declare Election Component */}
    <div className="mb-6 p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-semibold">Election Status: {electionStatus}</h2>
        <p>Start Date: {startDate ? new Date(startDate).toLocaleString() : "Not Set"}</p>
  <p>End Time: {endTime ? new Date(endTime).toLocaleString() : "Not Set"}</p>
      <button
        onClick={declareElection}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Declare Election
      </button>
      <button
          onClick={closeElection}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
          disabled={electionStatus === "Closed"}
        >
          Close Election
        </button>
        <div className="mt-6">
  <h2 className="text-xl font-semibold mb-2">Election Controls</h2>
  <ResetElectionButton />
</div> 
    </div>
      Registered Students Section
      <div className="mb-6">
         {/* Registered Students */}
      <h2 className="text-xl font-semibold mb-2">Registered Students</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
          </tr>
        </thead>
        <tbody>
          {registeredStudents.map((student) => (
            <tr key={student._id} className="text-center">
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">
                {student.firstname} {student.lastname}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Nomination Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Nomination Requests</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">ConductCertificate</th>
              <th className="border p-2">Photo</th>
              <th className="border p-2">CGPA</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {nominations.map((nomination, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{nomination.firstname} {nomination.lastname}</td>
                <td className="border p-2">{nomination.position}</td>
                <td className="border p-2">{nomination.department}</td>
                <td className="border p-2">
                  <a
                    href={`http://localhost:5000/${nomination.conductCertificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                     >
                    View
                  </a></td>
                <td className="border p-2">
                <a
    href={`http://localhost:5000/${nomination.document}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 underline"
  >
    View ID Proof 
  </a>
  </td> 
                <td className="border p-2">{nomination.cgpa}</td>
                <td className="border p-2">{nomination.status}</td>
                <td className="border p-2">
  {nomination.status}

  <div className="flex justify-center space-x-2 mt-2">
    <button
      className="bg-green-500 text-white px-3 py-1 rounded"
      onClick={() => handleNominationAction(nomination._id, "approved")}
      disabled={nomination.status === "approved"}
    >
      Approve
    </button>

    <button
      className="bg-red-500 text-white px-3 py-1 rounded"
      onClick={() => handleNominationAction(nomination._id, "rejected")}
      disabled={nomination.status === "rejected"}
    >
      Reject
    </button>

  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <div>
        <div  mb-6 p-4 border rounded bg-gray-100>
   <h2 className="text-xl font-semibold mb-2">Add New Position</h2>
    <input
      type="text"
      value={newPosition}
      onChange={(e) => setNewPosition(e.target.value)}
      className="border p-2"
      placeholder="Enter new position"
    />
    <button onClick={addPosition} className="bg-green-500 text-white px-3 py-1 rounded ml-2">
      Add Position
    </button>
    </div>
  </div>
  <Link to="/admin/vote-results" className="bg-green-500 text-white p-2 rounded">
  View Election Results
</Link>


      <p>Current Nomination Deadline: {currentDeadline || "Not set"}</p>
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button onClick={updateDeadline}>Set Deadline</button>
      <Link
  to="/admin/view-complaints"
  className="block text-blue-600 font-medium hover:underline mt-2"
>
  View Complaints
</Link>
<Link
  to="/admin/add-student"
  className="bg-green-600 text-white px-4 py-2 rounded inline-block mt-4"
>
  Add Student Manually
</Link>
<div className="bg-white p-4 rounded shadow mb-6">
  <h3 className="text-lg font-semibold mb-2">📄 Upload Election Detail (Image)</h3>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="mb-2"
  />
  <button
    onClick={handleUpload}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Upload
  </button>
  {uploadStatus && <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>}
</div>

    </div>
     
  );
}



export default AdminDashboard;
