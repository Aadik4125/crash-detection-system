import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'
import { LogOut, Car } from 'lucide-react'

function App() {
  const [page, setPage] = useState('login'); // 'login' | 'signup' | 'dashboard'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bb_token');
    const savedUser = localStorage.getItem('bb_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setPage('dashboard');
      } catch {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_user');
      }
    }
  }, []);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    setPage('dashboard');
    localStorage.setItem('bb_token', token);
    localStorage.setItem('bb_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setPage('login');
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
  };

  // Auth pages (no header)
  if (page === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={() => setPage('signup')} />;
  }
  if (page === 'signup') {
    return <Signup onSwitchToLogin={() => setPage('login')} />;
  }

  // Dashboard (authenticated)
  return (
    <div className="app-container">
      <header className="header">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}>
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <h1>Black Box Recorder.</h1>

        <div className="header-right">
          {user && (
            <div className="vehicle-badge">
              <Car size={16} />
              <span>{user.vehicleNumber}</span>
            </div>
          )}
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
          </div>
          <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      
      <main>
        <Dashboard user={user} />
      </main>
    </div>
  )
}

export default App
