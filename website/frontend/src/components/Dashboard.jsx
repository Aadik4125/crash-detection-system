import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, ShieldCheck, Database, Wind } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalRecords: 0, totalCrashes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://${window.location.hostname}:5000/api/records?limit=5000`);
      setData(response.data.data);
      setStats(response.data.stats);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not connect to the Black Box backend. Ensure the server is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    // Poll every 3 seconds for live updates
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <Activity size={48} className="animate-spin" style={{margin: '0 auto', color: 'var(--primary)'}} />
        <p style={{marginTop: '1rem'}}>Initializing Secure Connection...</p>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="glass-card" style={{borderColor: 'rgba(239, 68, 68, 0.3)', textAlign: 'center'}}>
        <AlertTriangle size={48} style={{margin: '0 auto', color: 'var(--danger)', marginBottom: '1rem'}} />
        <h2 style={{color: 'var(--danger)', marginBottom: '0.5rem'}}>Connection Interrupted</h2>
        <p style={{color: 'var(--text-muted)'}}>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-grid">
        <div className="glass-card">
          <div className="stat-header">
            <Database size={20} color="var(--primary)" />
            Total Telemetry Logs
          </div>
          <div className="stat-value">{stats.totalRecords.toLocaleString()}</div>
        </div>
        
        <div className="glass-card" style={{ borderColor: stats.totalCrashes > 0 ? 'var(--danger)' : 'var(--border-color)' }}>
          <div className="stat-header">
            {stats.totalCrashes > 0 ? (
               <AlertTriangle size={20} color="var(--danger)" />
            ) : (
               <ShieldCheck size={20} color="var(--success)" />
            )}
            Crash Events Detected
          </div>
          <div className={`stat-value ${stats.totalCrashes > 0 ? 'danger' : ''}`}>
            {stats.totalCrashes}
          </div>
        </div>

        <div className="glass-card">
          <div className="stat-header">
            <Wind size={20} color="var(--secondary)" />
            System Status
          </div>
          <div className="stat-value" style={{fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--success)'}}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)', marginRight: '8px', boxShadow: '0 0 10px var(--success)'}}></span>
            Monitoring SD Card
          </div>
        </div>
      </div>

      <div className="glass-card table-container">
        <h3 style={{marginBottom: '1.5rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <Activity size={18} />
          Recent Telemetry Stream
        </h3>
        
        {data.length === 0 ? (
           <div className="empty-state">
             <Database size={48} />
             <p>No telemetry data found. Check your SD card.</p>
           </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Speed (km/h)</th>
                <th>Tilt Angle (°)</th>
                <th>Vibration</th>
                <th>Accel (X/Y/Z)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row._id} className={row.isCrash ? 'crash-row' : ''}>
                  <td>{new Date(row.timestamp).toLocaleString()}</td>
                  <td style={{fontFamily: 'monospace'}}>{row.speed?.toFixed(1) || '0.0'}</td>
                  <td style={{fontFamily: 'monospace', color: row.tiltAngle > 45 ? 'var(--danger)' : 'inherit'}}>
                    {row.tiltAngle?.toFixed(1) || '0.0'}
                  </td>
                  <td style={{fontFamily: 'monospace', color: row.vibration > 25 ? 'var(--danger)' : 'inherit'}}>
                    {row.vibration?.toFixed(1) || '0.0'}
                  </td>
                  <td style={{fontFamily: 'monospace', fontSize: '0.85em', color: 'var(--text-muted)'}}>
                    {row.accelerationX?.toFixed(2)} / {row.accelerationY?.toFixed(2)} / {row.accelerationZ?.toFixed(2)}
                  </td>
                  <td>
                    {row.isCrash ? (
                      <span className="badge badge-crash">Crash Detected</span>
                    ) : (
                      <span className="badge badge-normal">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Dashboard;
