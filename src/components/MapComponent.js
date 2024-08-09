import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet to create a custom icon
import 'leaflet/dist/leaflet.css';

// Custom vehicle icon
const vehicleIcon = new L.Icon({
  iconUrl: 'https://i.pinimg.com/564x/85/f9/3b/85f93bad9f0c4f9c05f1e4976f464a9b.jpg', // Path to your vehicle icon in the public directory
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 20], // Anchor point of the icon, so it centers correctly
});

const MapComponent = () => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/vehicle-location');
      const data = await response.json();
      setPositions(data);
      setCurrentPosition(data[0]);
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentPosition(prev => {
        const currentIndex = positions.indexOf(prev);
        return positions[(currentIndex + 1) % positions.length];
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, [positions]);

  return (
    <MapContainer center={[17.385044, 78.486671]} zoom={15} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition && (
        <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={vehicleIcon}>
          <Popup>
            <div>
              <h3>Vehicle Details</h3>
              <p><strong>Latitude:</strong> {currentPosition.latitude}</p>
              <p><strong>Longitude:</strong> {currentPosition.longitude}</p>
              <p><strong>Speed:</strong> {/* Calculate and display speed here */}</p>
              <p><strong>Timestamp:</strong> {new Date(currentPosition.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      )}
      <Polyline positions={positions.map(pos => [pos.latitude, pos.longitude])} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;
