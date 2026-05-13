import { useState } from "react";
import axios from "axios";

const AddStudentManually = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    department: "",
    year: "",
    mobile: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/add-student", form);
      alert("Student added successfully!");
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        department: "",
        year: "",
        mobile: "",
        gender: "",
      });
    } catch (error) {
      alert("Error adding student");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manually Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstname" value={form.firstname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="First Name" required />
        <input name="lastname" value={form.lastname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Last Name" required />
        <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Password" type="password" required />
        <input name="department" value={form.department} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Department" required />
        <input name="year" value={form.year} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Year" required />
        <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Mobile" required />
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudentManually;
