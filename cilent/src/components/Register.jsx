import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Form.css";

const Register = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "", phonenumber: "", vehiclenumber: ""});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", user);
      navigate("/login");
    } catch (error) {
      setError("Error: " + (error.response?.data?.message || JSON.stringify(error.response?.data) || "Registration failed"));
    }
  };

  return (
    <div className="form-container">
      <div className="form-card" style={{ width: "500px" }}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>} {/* Global error message styling */}
        <form onSubmit={handleSubmit}>
        <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="number"
              name="phonenumber" 
              placeholder="Phone Number" 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="input-group">
            <label>Vehicle Number</label>
            <input
              type="text"
              name="vehiclenumber"
              placeholder="Vehicle Number"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className = "form-btn">Register</button>
        </form>
        <br/>
        <p>Already have an account? <a href="/login" className="navigate-link">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
