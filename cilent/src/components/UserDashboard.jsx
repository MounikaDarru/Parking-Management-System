// {import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [username, setUsername] = useState("");
//   const [admins, setAdmins] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [filteredAdmins, setFilteredAdmins] = useState([]);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [parkingSlots, setParkingSlots] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user details
//     const fetchUser = () => {
//       const storedUsername = localStorage.getItem("username");
//       if (storedUsername) {
//         setUsername(storedUsername);
//       }
//     };

//     // Fetch all admins
//     const fetchAdmins = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/admins");
//         setAdmins(response.data);
//       } catch (error) {
//         console.error("Error fetching admins", error);
//       }
//     };

//     fetchUser();
//     fetchAdmins();
//   }, []);

//   // Filter admins based on selected location
//   useEffect(() => {
//     if (selectedLocation) {
//       setFilteredAdmins(admins.filter((admin) => admin.location === selectedLocation));
//     } else {
//       setFilteredAdmins([]);
//     }
//   }, [selectedLocation, admins]);

//   // Fetch parking slots when an admin is selected
//   const handleAdminSelect = async (id) => {
//     const admin = admins.find((admin) => admin.id === id);
//     if (!admin) return;
//     setSelectedAdmin(admin); // Correctly setting selectedAdmin

//     try {
//       const response = await axios.get(`http://localhost:8080/api/admins/${id}/parking-slots`);
//       setParkingSlots(response.data);
//     } catch (error) {
//       console.error("Error fetching parking slots", error);
//     }
//   };

//   // Handle parking slot reservation
//   const handleReserve = async (slotId) => {
//     if (!selectedAdmin) return;
//     try {
//       const response = await axios.post(`http://localhost:8080/api/admins/${selectedAdmin.id}/reserve/${slotId}`, {
//         username,
//       });
//       alert(response.data);
//       handleAdminSelect(selectedAdmin.id); // Refresh slots after booking
//     } catch (error) {
//       alert(`Error booking slot: ${JSON.stringify(error)}`);
//     }
//   };

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("username");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Welcome {username}!</h2>

//       {/* Location Selection */}
//       <h3>Select Location</h3>
//       <select onChange={(e) => setSelectedLocation(e.target.value)}>
//         <option value="">-- Select Location --</option>
//         {Array.from(new Set(admins.map((admin) => admin.location))).map((loc, index) => (
//           <option key={index} value={loc}>
//             {loc}
//           </option>
//         ))}
//       </select>

//       {/* Admins in Selected Location */}
//       {selectedLocation && (
//         <div>
//           <h3>Admins in {selectedLocation}</h3>
//           <ul>
//             {filteredAdmins.length > 0 ? (
//               filteredAdmins.map((admin) => (
//                 <li key={admin.id || admin.email}> {/* Ensure ID is not null */}
//                   {admin.username} - {admin.email}{" "}
//                   <button onClick={() => handleAdminSelect(admin.id)}>View Parking Slots</button>
//                 </li>
//               ))
//             ) : (
//               <p>No admins available in this location.</p>
//             )}
//           </ul>
//         </div>
//       )}

//       {/* Parking Slots Display */}
//       {selectedAdmin && (
//         <div>
//           <h3>Parking Slots</h3>
//           <ul>
//           {parkingSlots.length > 0 ? (
//             parkingSlots.map((slot, index) => (
//               <li key={slot.slotId || index}> {/* Use index as fallback key */}
//                 Slot {slot.slotId || "Unknown"} - {slot.booked ? `Booked by ${slot.bookedBy}` : "Available"}{" "}
//                 {!slot.isBooked && <button onClick={() => handleReserve(slot.slotId || index)}>Reserve</button>}
//               </li>
//             ))
//           ) : (
//             <p>No parking slots available.</p>
//           )}

//           </ul>
//         </div>
      
//       )}

//       {/* Logout Button */}
//       <button onClick={handleLogout} style={{ marginTop: "20px" }}>
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Dashboard;}


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      handleAdminSelect(selectedAdmin.id);
    } catch (error) {
      alert(`Error booking slot: ${JSON.stringify(error)}`);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedAdmin || !reservedSlot) {
      alert("No slot reserved for check-in.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${selectedAdmin.id}/checkin/${reservedSlot}`, { username });
      alert(response.data);
      handleAdminSelect(selectedAdmin.id);
    } catch (error) {
      alert(`Error checking in: ${error.response?.data || error.message}`);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedAdmin || !reservedSlot) {
      alert("No slot reserved for check-out.");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8080/api/users/${selectedAdmin.id}/checkout/${reservedSlot}`, { username });
      alert(response.data);
      setReservedSlot(null);
      handleAdminSelect(selectedAdmin.id);
    } catch (error) {
      alert(`Error checking out: ${error.response?.data || error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2>Welcome {username}!</h2>

      {/* Select Location */}
      <h3>Select Location</h3>
      <select onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="">-- Select Location --</option>
        {Array.from(new Set(admins.map((admin) => admin.location))).map((loc, index) => (
          <option key={index} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Admins in Selected Location */}
      {selectedLocation && (
        <div>
          <h3>Admins in {selectedLocation}</h3>
          <ul>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <li key={admin.id || admin.email}>
                  {admin.username} - {admin.email} 
                  <button onClick={() => handleAdminSelect(admin.id)}>View Parking Slots</button>
                </li>
              ))
            ) : (
              <p>No admins available in this location.</p>
            )}
          </ul>
        </div>
      )}

      {/* Parking Slots Display */}
      {selectedAdmin && (
        <div>
          <h3>Parking Slots</h3>
          <ul>
            {parkingSlots.length > 0 ? (
              parkingSlots.map((slot, index) => (
                <li key={slot.slotId || index}>
                  Slot {slot.slotId || "Unknown"} - {slot.booked ? `Booked by ${slot.bookedBy}` : "Available"}{" "}
                  {!slot.booked && (
                    <button onClick={() => handleReserve(slot.slotId || index)}>Reserve</button>
                  )}
                </li>
              ))
            ) : (
              <p>No parking slots available.</p>
            )}
          </ul>
        </div>
      )}

      {/* Check-In Button */}
      {reservedSlot && (
        <div>
          <button onClick={handleCheckIn} style={{ marginTop: "10px", marginRight: "10px" }}>
            Check In
          </button>
          <button onClick={handleCheckOut} style={{ marginTop: "10px" }}>
            Check Out
          </button>
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
    </div>
  );
};

export default Dashboard;
