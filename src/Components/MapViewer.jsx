import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  phc: createCustomIcon('green'),
  urban: createCustomIcon('red'),
  patient: createCustomIcon('blue')
};

// Map Recenter Component
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapViewer({ 
  center = [28.6139, 77.2090], // Default: New Delhi
  zoom = 12,
  facilities = [],
  patientOrigin = null
}) {
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        {/* OpenStreetMap works great for low-network because tiles are small. 
            Can be swapped with a minimalist dark theme tile layer if desired */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={center} zoom={zoom} />
        
        {/* Render Patient Location */}
        {patientOrigin && (
          <Marker position={patientOrigin} icon={icons.patient}>
            <Popup>
              <strong>Patient Location</strong><br/>
              Emergency Origin
            </Popup>
          </Marker>
        )}

        {/* Render Nearby Facilities */}
        {facilities.map((fac) => {
          // MongoDB GeoJSON is [longitude, latitude], Leaflet needs [latitude, longitude]
          const position = fac.location && fac.location.coordinates 
            ? [fac.location.coordinates[1], fac.location.coordinates[0]] 
            : null;
            
          if (!position) return null;

          return (
            <Marker key={fac._id} position={position} icon={fac.role === 'doctor' ? icons.urban : icons.phc}>
              <Popup>
                <strong style={{ color: fac.role === 'doctor' ? '#EF4444' : '#10B981' }}>
                  {fac.facilityName}
                </strong>
                <br/>
                {fac.role === 'doctor' ? 'Urban Specialist Hospital' : 'Primary Health Centre'}
                <br/>
                <small>{fac.name}</small>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
