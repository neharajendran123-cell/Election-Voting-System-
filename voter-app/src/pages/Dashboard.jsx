
import { Link, Outlet,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // ✅ Missing React hooks
import axios from "axios"; 

const Dashboard = () => {
  const [electionStatus, setElectionStatus] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/election/election-status") // ✅ Correct API route
      .then((res) => setElectionStatus(res.data.status))
      .catch((err) => console.error("Error fetching election status:", err));
  }, []);

  // Fetch candidates only if election is ongoing
  useEffect(() => {
    if (electionStatus === "ongoing") {
      axios
        .get("http://localhost:5000/api/candidates") // ✅ Correct API route
        .then((res) => setCandidates(res.data))
        .catch((err) => console.error("Error fetching candidates:", err));
    }
  }, [electionStatus]);
   
  

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };
  return (
    <div  className="flex h-screen"
    style={{
      backgroundImage: "url('https://t4.ftcdn.net/jpg/07/13/47/45/360_F_713474531_09NY1xIIvYJoGsbbPH3bJWrfznRu6mYX.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      opacity: 0.9, // Faded effect
    }}
  >
     

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard/self-nomination" className="block p-2 hover:bg-gray-700">
              📝 Self-Nomination
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/election-voting" className="block p-2 hover:bg-gray-700">
              🗳️ Election Voting
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/dashboard/results" className="block p-2 hover:bg-gray-700">
              📊 Results
            </Link>
          </li>
           <li   className="mb-4">
          <Link to="/dashboard/view-candidates" className="block p-2 hover:bg-gray-700">
          👀 View All Candidates
        </Link>
          </li>
          <li className="mb-4">
       <Link to="/dashboard/voters-list" className="block p-2 hover:bg-gray-700">
       📋 Voters List
       </Link>
       </li> 
       <li className="mb-4">
       <Link to="/dashboard/file-complaint" className="block p-2 hover:bg-gray-700">
       !! Register Complaint
       </Link>
       </li>     
        </ul>
        <li className="mb-4">
  <Link to="/dashboard/election-details" className="block p-2 hover:bg-gray-700">
    📄 View Election Details
  </Link>
</li>
<li className="mb-4">
    <Link to="/dashboard/view-all-votes" className="block p-2 hover:bg-gray-700">
      ✅ View All Votes
    </Link>
  </li>

      </div>
      
      {/* Main Content */}
      
      <div className="flex-1 p-6 overflow-y-auto"> 
        <Outlet /> {/* This will render the selected page */}
      </div>
       <div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-4 rounded">
        Logout
      </button>
      </div>
    </div>
  );
};

export default Dashboard;
