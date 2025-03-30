import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Form.css";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", user);
      localStorage.setItem("id", response.data.id);
      const { username } = response.data; // Get username from backend
      localStorage.setItem("username", username);
      const { role } = response.data; // Get role from backend

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      }
    } 
    catch (error) {
      if (error.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      }
      else{
        setError(error.response?.data?.message || JSON.stringify(error.response?.data) || "Login failed");
      }
    }
  };

  return (
            <div className="form-container">
                <div className="form-card">
                    <h2>Parking Management Login</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Username</label>
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
                        <button type="submit" className="form-btn">Login</button>
                    </form>
                    <br/>
                    <p>Don't have an account? <a href="/register" className="navigate-link">Register</a></p>
                </div>
            </div>
        );

};

export default Login;
