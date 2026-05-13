import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //  Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      
      const { message, token, role , userId} = response.data; 
      console.log("Role received:", role); 
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      alert(message);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials!");
    }
  };

//   return (
//     <div className="h-screen bg-blue-100 flex flex-col">
//       <div className="w-full text-center py-8 bg-blue-600 text-white shadow-md">
//         <h1 className="text-4xl font-bold">GOVERNMENT COLLEGE OF ENGINEERING KANNUR</h1>
//       </div>

//       <div className="flex flex-grow items-center justify-center">
//       <div className="bg-grey-600 p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 mb-3 border rounded"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 mb-3 border rounded"
//             required
//           />
//           <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-center">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-500">Register here</a>
//         </p>
//       </div>
//       </div>
//     </div>
//   );
// };
return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "url('https://image.free-apply.com/gallery/l/uni/gallery/lg/1035603435/8324779ba4477fc3069c8e3d693e318aa064c762.jpg?s=640') no-repeat center center",
      backgroundSize: "120%",
      backgroundAttachment: "fixed",
      position: "relative",
    }}
  >
    {/* Faded Overlay */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.4)",
        zIndex: 0,
      }}
    ></div>

    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: "2rem 0",
        backgroundColor: "#2563eb",
        color: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        GOVERNMENT COLLEGE OF ENGINEERING KANNUR
      </h1>
    </div>

    <div
      style={{
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
         {/*  New Heading Inside the Container */}
         <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "1rem",
            color: "#36454F",
          }}
        >
          College Union Election
        </h1>

        <h2
          style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "1rem" }}
        >
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: "#2563eb", textDecoration: "none" }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  </div>
);
};

//  Export at the top level
export default Login;
