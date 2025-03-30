import { useLocation, useNavigate } from "react-router-dom";

const PaymentGateway = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const billDetails = location.state?.billDetails;

    const handlePaymentSuccess = () => {
        alert("Payment successful!");
        navigate("/user-dashboard");
    };

    return (
        <div>
            <h2>Payment Gateway</h2>
            <p><strong>Amount:</strong> ${billDetails?.amount}</p>
            <button onClick={handlePaymentSuccess}>Pay Now</button>
        </div>
    );
};

export default PaymentGateway;
