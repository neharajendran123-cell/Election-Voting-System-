import { useState,useEffect } from "react";
import axios from "axios";

const SelfNomination = () => {
  const [user, setUser] = useState(null);
 // const [name, setName] = useState("");
 // const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [year, setYear] = useState("");
  const [document, setDocument] = useState(null);
  const [conductCertificate, setConductCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); //  State to store errors
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages
    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User Data:", response.data); //  Debugging
        setUser(response.data); // Store user details
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);


  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    const token = localStorage.getItem("token"); //  Get token

    if (!token) {
      alert("❌ No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("firstname",user.firstname);
    formData.append("lastname",user.lastname);
    formData.append("year",user.year);
    formData.append("department",user.department);
    formData.append("position", position);
    formData.append("cgpa", cgpa);
    formData.append("document", document);
    formData.append("conductCertificate", conductCertificate);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/self-nomination",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }, //  Add Authorization header
        }
      );
  
      console.log("✅ Nomination submitted successfully!", response.data);
      alert("✅ Nomination submitted successfully!");
    } catch (error) {
      console.error("❌ Error submitting nomination:", error);
      alert(`❌ Error: ${error.response?.data?.message || "Something went wrong."}`);
    }
  };
  
  

  return (
    <div  className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: "url('https://www.cmhoa.com/wp-content/uploads/2013/10/HOA-Candidate-Nomination-Whats-The-Process.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.9,
    }}
  >
    <div
      className="p-6 max-w-lg mx-auto shadow-xl rounded-lg"
      style={{
        background: "#f9f6f1", // Light cream color
        border: "1px solid #ddd", // Soft border
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)", // Soft box shadow
        marginTop:"4%",
        marginBottom:"4%",
    

      }}
    >



      <h2 className="text-2xl font-bold mb-4">Self-Nomination Form</h2>

      {/* Display success or error messages */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block font-semibold">FirstName</label>
        <input
          type="text"
          value={user?.firstname || ""}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
         <label className="block font-semibold">LastName</label>
        <input
          type="text"
          value={user?.lastname || ""}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
        {/*<input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-2 border rounded" required >*/}
        <label className="block font-semibold">Year</label>
        <input
          type="text"
          value={user?.year || ""}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
         <label className="block font-semibold">Department</label>
        <input
          type="text"
          value={user?.department || ""}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
        <label className="block font-semibold">Select Position</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>-- Select Position --</option>
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
          <option value="Secretary">Secretary</option>
          <option value="Treasurer">Treasurer</option>
        </select>
        <input type="text" placeholder="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="w-full p-2 border rounded" required />

        {/* Upload ID proof */}
        <label className="block font-semibold">Upload ID Proof</label>
        <input type="file" onChange={(e) => handleFileChange(e, setDocument)} className="w-full p-2 border rounded" required />

        {/* Upload Conduct Certificate */}
        <label className="block font-semibold">Upload Conduct Certificate</label>
        <input type="file" onChange={(e) => handleFileChange(e, setConductCertificate)} className="w-full p-2 border rounded" required />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit Nomination</button>
      </form>
    </div>
    </div>
  );
};

export default SelfNomination;
