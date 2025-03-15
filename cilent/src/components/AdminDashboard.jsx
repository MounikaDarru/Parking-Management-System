import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = ({id}) => {
  const [checkedInUsers, setCheckedInUsers] = useState([]);
  const [username, setUsername] = useState("");
  // const storedId = localStorage.getItem("id");
  // <AdminDashboard id={storedId} />

  useEffect(() => {
    const fetchUser = () => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
    };

    const fetchCheckedInUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admins/${id}/checkedin-users`);
        setCheckedInUsers(response.data);
      } catch (error) {
        console.error("Error fetching checked-in users:", error);
      }
    };

    fetchUser();
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
                <th>Check-out-Time</th>
            </tr>
            </thead>
            <tbody>
            {checkedInUsers.length > 0 ? (
                checkedInUsers.map((user, index) => (
                <tr key={index}>
                    <td>{user.slotId}</td>
                    <td>{user.username}</td>
                    <td>{new Date(user.checkInTime).toLocaleString()}</td>
                    {user.checkOutTime ? 
                    (<td>{new Date(user.checkOutTime).toLocaleString()}</td>) : (<td>No checkout yet</td>)}
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4">No users checked in yet.</td>
                </tr>
            )}
            </tbody>
        </table>
        <button onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }}>
        Logout
        </button>
    </div>
  );
};

export default AdminDashboard;