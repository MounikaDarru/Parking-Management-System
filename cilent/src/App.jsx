import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import JoinUs from "./components/JoinUs";
import CheckIN from "./components/CheckIN";
import CheckOUT from "./components/CheckOUT";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/:selectedAdmin/checkin/:reservedSlot" element={<CheckIN />} />
        <Route path="/:selectedAdmin/checkout/:reservedSlot" element={<CheckOUT />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
