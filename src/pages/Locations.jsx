import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import MapViewer from '../Components/MapViewer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function Locations() {
  const { user } = useAuth();
  const { dark } = useTheme();
  
  const [facilities, setFacilities] = useState([]);
  const [origin, setOrigin] = useState(null); // [lat, lng]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bg = dark ? "#0d0f1a" : "#f1f0e6ff";
  const card = dark ? "#12152a" : "#ffffff";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const border = dark ? "#1e2235" : "#e5e7eb";

  // Use Browser Geolocation
  const requestLocation = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setOrigin(coords);
        fetchNearbyFacilities(coords[0], coords[1]);
      },
      (err) => {
        console.warn("Geolocation blocked/failed:", err);
        setError("Unable to retrieve your location automatically. Using default center.");
        // Fallback to New Delhi default
        setOrigin([28.6139, 77.2090]);
        fetchNearbyFacilities(28.6139, 77.2090);
      }
    );
  };

  const fetchNearbyFacilities = async (lat, lng) => {
    try {
      // 50km radius for rural/urban span
      const res = await api.get(`/facilities/nearby?lat=${lat}&lng=${lng}&maxDistance=50000`);
      // Filter out the current user so they don't see themselves as a "destination" optionally
      setFacilities(res.data.data.filter(f => f._id !== user?.id));
    } catch(err) {
      console.error(err);
      setError("Failed to locate facilities from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text }}>
      <Navbar role={user?.role === 'doctor' ? 'urban' : 'phc'} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: "24px", fontWeight: 800 }}>
            <Compass size={28} color="var(--color-secondary)" /> 
            Facility & Emergency Routing
          </h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "8px" }}>
            Track patient origins and map the nearest Specialist Urban Hospitals in real-time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
          
          {/* Map Area */}
          <div className="premium-card" style={{ padding: '8px', background: card, border: `1px solid ${border}` }}>
            {origin ? (
              <MapViewer 
                center={origin} 
                zoom={10} 
                facilities={facilities} 
                patientOrigin={user?.role === 'healthcare_worker' ? origin : null} 
              />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="premium-card" style={{ padding: '20px', background: card, border: `1px solid ${border}` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: '16px' }}>
                <Navigation size={18} color="var(--color-accent)" /> 
                Action Panel
              </h3>

              <button 
                onClick={requestLocation} 
                className="btn btn-primary" 
                style={{ width: '100%', marginBottom: '12px' }}
                disabled={loading}
              >
                {loading ? 'Locating...' : 'Recalculate Proximity'}
              </button>
              
              {error && <p style={{ fontSize: '13px', color: 'var(--color-warning)' }}>{error}</p>}

              <hr style={{ border: 'none', borderTop: `1px solid ${border}`, margin: '20px 0' }} />

              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-text-muted)' }}>Nearest Facilities ({facilities.length})</h4>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {facilities.length === 0 && !loading && <span style={{fontSize:'13px', color:'gray'}}>No facilities found within 50km.</span>}
                {facilities.map(fac => (
                  <div key={fac._id} style={{ padding: '10px', background: dark ? '#1a1d2e' : '#f8fafc', borderRadius: '8px', border: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={16} color={fac.role === 'doctor' ? '#EF4444' : '#10B981'} style={{ marginTop: '3px' }} />
                      <div>
                        <strong style={{ fontSize: '14px', display:'block' }}>{fac.facilityName}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {fac.role === 'doctor' ? 'Urban Specialist' : 'PHC'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="premium-card" style={{ padding: '16px', background: card, border: `1px solid ${border}` }}>
               <h4 style={{ fontSize: '13px', marginBottom: '8px' }}>Map Key</h4>
               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', marginBottom:'4px'}}>
                 <span style={{width:'12px', height:'12px', background:'#EF4444', borderRadius:'50%'}}></span> Urban Specialist Hospital
               </div>
               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', marginBottom:'4px'}}>
                 <span style={{width:'12px', height:'12px', background:'#10B981', borderRadius:'50%'}}></span> Primary Health Centre
               </div>
               <div style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px'}}>
                 <span style={{width:'12px', height:'12px', background:'#3B82F6', borderRadius:'50%'}}></span> Emergency Origin (You)
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
