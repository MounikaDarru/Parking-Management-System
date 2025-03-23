import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CheckOUT = () => {
    const { reservedSlot, selectedAdmin } = useParams();
    const [slotDetails, setSlotDetails] = useState(null);
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlotDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${selectedAdmin}/parking-slots`);
                const slots = response.data;  // Response might be an array

                // Find the correct slot
                const selectedSlot = slots.find(slot => slot.slotId === reservedSlot);

                if (selectedSlot) {
                    setSlotDetails(selectedSlot);
                } else {
                    console.error("⚠️ Reserved slot not found in response!");
                }
            } catch (error) {
                console.error("❌ Error fetching slot details", error);
            }
        };

        fetchSlotDetails();
    }, [selectedAdmin, reservedSlot]);

    const handleCheckOut = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/users/${selectedAdmin}/checkout/${reservedSlot}`, 
                { username }
            );
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
                    <p><strong>Slot ID:</strong> {slotDetails.slotId}</p>
                    <p>
                        <strong>Check-in Time:</strong> 
                        {slotDetails.checkInTime 
                            ? new Date(slotDetails.checkInTime).toLocaleString() 
                            : "Not checked in yet"}
                    </p>
                    <button onClick={handleCheckOut}>Check-out</button>
                </div>
            ) : (
                <p>Loading slot details...</p>
            )}
        </div>
    );
};

export default CheckOUT;
