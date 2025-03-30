import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../stylesheets/CheckOUT.css";

const CheckOUT = () => {
    const { reservedSlot, selectedAdmin } = useParams();
    const [slotDetails, setSlotDetails] = useState(null);
    const [billDetails, setBillDetails] = useState(null);
    const [paymentMode, setPaymentMode] = useState(""); // "cash" or "online"
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlotDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${selectedAdmin}/parking-slots`);
                const slots = response.data;

                // Find the reserved slot
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
                { username, paymentMode }
            );
            setBillDetails(response.data); // Save bill details
        } catch (error) {
            alert(`Error checking out: ${error.response?.data || error.message}`);
        }
    };

    const handlePayment = async () => {
        if (!paymentMode) {
            alert("Please select a payment method.");
            return;
        }
    
        try {
            // ✅ Update Payment Mode in Backend
            const response = await axios.post(
                `http://localhost:8080/api/users/${selectedAdmin}/update-payment/${reservedSlot}`, 
                { username, paymentMode }
            );
    
            alert(response.data);

    
            if (paymentMode === "online") {
                navigate("/payment-gateway", { state: { billDetails } });
            } else {
                alert("Payment completed. Returning to dashboard.");
                navigate("/user-dashboard");
            }
        } catch (error) {
            alert(`Error updating payment mode: ${error.response?.data || error.message}`);
        }
    };
    

    // return (
    //     <div>
    //         <h2>Slot Details</h2>
    //         {slotDetails ? (
    //             <div>
    //                 <p><strong>Slot ID:</strong> {slotDetails.slotId}</p>
    //                 <p>
    //                     <strong>Check-in Time:</strong> 
    //                     {slotDetails.checkInTime 
    //                         ? new Date(slotDetails.checkInTime).toLocaleString() 
    //                         : "Not checked in yet"}
    //                 </p>
    //                 <button onClick={handleCheckOut}>Check-out</button>
    //             </div>
    //         ) : (
    //             <p>Loading slot details...</p>
    //         )}

    //         {billDetails && (
    //             <div>
    //                 <h2>Billing Details</h2>
    //                 <p><strong>Duration:</strong> {billDetails.duration} minutes</p>
    //                 <p><strong>Amount Due:</strong> ${billDetails.amount}</p>

    //                 <h3>Select Payment Method</h3>
    //                 <label>
    //                     <input 
    //                         type="radio" 
    //                         value="cash" 
    //                         checked={paymentMode === "cash"} 
    //                         onChange={(e) => setPaymentMode(e.target.value)}
    //                     />
    //                     Cash
    //                 </label>
    //                 <label>
    //                     <input 
    //                         type="radio" 
    //                         value="online" 
    //                         checked={paymentMode === "online"} 
    //                         onChange={(e) => setPaymentMode(e.target.value)}
    //                     />
    //                     Online Payment
    //                 </label>

    //                 <button onClick={handlePayment} disabled={!paymentMode}>
    //                     {paymentMode === "online" ? "Proceed to Payment" : "Complete Payment"}
    //                 </button>
    //             </div>
    //         )}
    //     </div>
    // );

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Slot Details</h2>
            
            {slotDetails ? (
                <div className="slot-details">
                    <p><strong>Slot ID:</strong> {slotDetails.slotId}</p>
                    <p>
                        <strong>Check-in Time:</strong> 
                        {slotDetails.checkInTime 
                            ? new Date(slotDetails.checkInTime).toLocaleString() 
                            : "Not checked in yet"}
                    </p>
                    <button className="checkout-btn" onClick={handleCheckOut}>Check-out</button>
                </div>
            ) : (
                <p className="loading-text">Loading slot details...</p>
            )}

            {billDetails && (
                <div className="billing-details">
                    <h2>Billing Details</h2>
                    <p><strong>Duration:</strong> {billDetails.duration} minutes</p>
                    <p><strong>Amount Due:</strong> ${billDetails.amount}</p>

                    <h3>Select Payment Method</h3>
                    <div className="payment-methods">
                        <label>
                            <input 
                                type="radio" 
                                value="cash" 
                                checked={paymentMode === "cash"} 
                                onChange={(e) => setPaymentMode(e.target.value)}
                            />
                            Cash
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                value="online" 
                                checked={paymentMode === "online"} 
                                onChange={(e) => setPaymentMode(e.target.value)}
                            />
                            Online&nbsp;Payment
                        </label>
                    </div>

                    <button className="payment-btn" onClick={handlePayment} disabled={!paymentMode}>
                        {paymentMode === "online" ? "Proceed to Payment" : "Complete Payment"}
                    </button>
                </div>
            )}
        </div>
    );

};

export default CheckOUT;
