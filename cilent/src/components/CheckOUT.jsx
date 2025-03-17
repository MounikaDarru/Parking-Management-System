import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CheckOUT = () => {
    const { reservedSlot } = useParams();
    const {selectedAdmin} = useParams();
  const [slotDetails, setSlotDetails] = useState(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${selectedAdmin}/parking-slots`);
        setSlotDetails(response.data);
      } catch (error) {
        console.error("Error fetching slot details", error);
      }
    };
    fetchSlotDetails();
  }, [selectedAdmin]);

  const handleCheckOut = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${selectedAdmin}/checkout/${reservedSlot}`, { username });
      alert(response.data);
      navigate(`/user-dashboard`);
    } catch (error) {
      alert(`Error checking out: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div>
      <h2>Slot Details</h2>
      {slotDetails ? (
        <div>
          <p>Slot ID: {slotDetails.slotId}</p>
          <p>Check-in Time: {new Date(slotDetails.checkInTime).toLocaleString()}</p>
          <button onClick={handleCheckOut}>Check-out</button>
        </div>
      ) : (
        <p>Loading slot details...</p>
      )}
    </div>
  );
};

export default CheckOUT;
