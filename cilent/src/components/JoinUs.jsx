import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinUs = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/joinus", user);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.response); // Log full response
      alert("Error: " + (error.response?.data?.message || JSON.stringify(error.response?.data) || "Registration failed"));
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Join Us</button>
      </form>
    </div>
  );
};

export default JoinUs;
