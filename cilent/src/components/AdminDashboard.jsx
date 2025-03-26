import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [checkedInUsers, setCheckedInUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    // Fetch logged-in admin details
    const storedUsername = localStorage.getItem("username");
    const storedAdminId = localStorage.getItem("id");

    if (storedUsername) setUsername(storedUsername);
    if (storedAdminId) setAdminId(storedAdminId);

    // Fetch checked-in users for this admin
    const fetchCheckedInUsers = async () => {
      if (!storedAdminId) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/admins/${storedAdminId}/checkedin-users`);
        setCheckedInUsers(response.data);
      } catch (error) {
        console.error("Error fetching checked-in users:", error);
      }
    };

    fetchCheckedInUsers();
  }, []);

  return (
    <div>
      <h2>Welcome {username}!</h2>
      <h2>Checked-in Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Slot ID</th>
            <th>Username</th>
            <th>Check-in Time</th>
            <th>Check-out Time</th>
            <th>Payment Mode</th>
          </tr>
        </thead>
        <tbody>
          {checkedInUsers.length > 0 ? (
            checkedInUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.slotId}</td>
                <td>{user.username}</td>
                <td>{new Date(user.checkInTime).toLocaleString()}</td>
                <td>{user.checkOutTime ? new Date(user.checkOutTime).toLocaleString() : "No checkout yet"}</td>
                <td>{user.paymentMode || "No Payment Yet"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users checked in yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        window.location.href = "/login";
      }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
