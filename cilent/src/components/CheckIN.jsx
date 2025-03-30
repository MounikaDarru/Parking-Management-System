import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../stylesheets/CheckIN.css";

const CheckIN = () => {
  const { reservedSlot } = useParams();
  const {selectedAdmin} = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60); // 5-minute countdown
  const username = localStorage.getItem("username");

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      alert("Time expired! Booking canceled.");
      navigate(`/user-dashboard`);
    }

    return () => clearInterval(timer);
  }, [seconds, navigate]);


const handleCheckIn = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${selectedAdmin}/checkin/${reservedSlot}`, { username });
      alert(response.data);
      navigate(`/${selectedAdmin}/checkout/${reservedSlot}`);
    } catch (error) {
      alert(`Error checking in: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="checkin-container">
      <div className="checkin-card">
        <h2 className="checkin-title">Check-in Timer</h2>
        <h3 className="timer">Time Remaining: {seconds} seconds</h3>
        <button className="checkin-btn" onClick={handleCheckIn}>Check-in</button>
      </div>
    </div>
  );
};

export default CheckIN;
