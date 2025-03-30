import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../stylesheets/Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [reservedSlot, setReservedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const storedUsername = localStorage.getItem("username");
      const storedId = localStorage.getItem("id");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users");
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins", error);
      }
    };

    fetchUser();
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setFilteredAdmins(admins.filter((admin) => admin.location === selectedLocation));
    } else {
      setFilteredAdmins([]);
    }
  }, [selectedLocation, admins]);

  const handleAdminSelect = async (id) => {
    const admin = admins.find((admin) => admin.id === id);
    if (!admin) return;
    setSelectedAdmin(admin);

    try {
      const response = await axios.get(`http://localhost:8080/api/users/${id}/parking-slots`);
      setParkingSlots(response.data);
    } catch (error) {
      console.error("Error fetching parking slots", error);
    }
  };

  const handleReserve = async (slotId) => {
    if (!selectedAdmin) return;
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${selectedAdmin.id}/reserve/${slotId}`, { username });
      alert(response.data);
      setReservedSlot(slotId); // Store the reserved slot for check-in
      navigate(`/${selectedAdmin.id}/checkin/${slotId}`);
      handleAdminSelect(selectedAdmin.id);
    } catch (error) {
      alert(`Error booking slot: ${JSON.stringify(error)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Welcome, {username}!</h2>
        <center>
        <div className="location-selector" style={{width: "350px"}}>
          <label>Select Location:</label>
          <select onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">-- Select Location --</option>
            {Array.from(new Set(admins.map((admin) => admin.location))).map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        </center>

        {selectedLocation && (
          <div className="admin-list">
            <h3>Admins in {selectedLocation}</h3>
            <ul>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <li key={admin.id || admin.email}>
                    {admin.username} - {admin.email}
                    <button className="btn" onClick={() => handleAdminSelect(admin.id)}>
                      View Parking Slots
                    </button>
                  </li>
                ))
              ) : (
                <p>No admins available in this location.</p>
              )}
            </ul>
          </div>
        )}

        {selectedAdmin && (
          <div className="parking-slots">
            <h3>Parking Slots</h3>
            <ul>
              {parkingSlots.length > 0 ? (
                parkingSlots.map((slot, index) => (
                  <li key={slot.slotId || index}>
                    Slot {slot.slotId || "Unknown"} - {slot.booked ? `Booked by ${slot.bookedBy}` : "Available"} {" "}
                    {!slot.booked && (
                      <button className="btn reserve-btn" onClick={() => handleReserve(slot.slotId || index)}>
                        Reserve
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p>No parking slots available.</p>
              )}
            </ul>
          </div>
        )}

        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );

};

export default Dashboard;


