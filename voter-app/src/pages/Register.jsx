import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        year: "",
        department: "",
        mobile: "",
        gender: "Male", 
        email: "",
        password: "",
        role: "student" 
    });
    const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Biotechnology",
    
  ];

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", formData);
            setMessage("Registration successful! Waiting for admin approval.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Student Registration</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="firstname" placeholder="First Name" className="w-full p-2 border mb-2"
                    value={formData.firstname} onChange={handleChange} required />

                <input type="text" name="lastname" placeholder="Last Name" className="w-full p-2 border mb-2"
                    value={formData.lastname} onChange={handleChange} required />

<label className="block mb-2">Year</label>
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="">-- Select Year --</option>
        {years.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>

      <label className="block mb-2">Department</label>
      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="">-- Select Department --</option>
        {departments.map((dept, index) => (
          <option key={index} value={dept}>{dept}</option>
        ))}
      </select>

                <input type="text" name="mobile" placeholder="Mobile Number" className="w-full p-2 border mb-2"
                    value={formData.mobile} onChange={handleChange} required />

                <select name="gender" className="w-full p-2 border mb-2" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input type="email" name="email" placeholder="Email" className="w-full p-2 border mb-2"
                    value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password" className="w-full p-2 border mb-2"
                    value={formData.password} onChange={handleChange} required />

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>

            {message && <p className="mt-2 text-center text-red-500">{message}</p>}
        </div>
    );
};

export default Register;
