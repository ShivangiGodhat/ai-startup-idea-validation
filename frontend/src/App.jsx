import React, { createContext, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewValidation from './pages/NewValidation';
import ReportDetails from './pages/ReportDetails';
import BusinessPlanPage from './pages/BusinessPlanPage';
import PitchDeckPage from './pages/PitchDeckPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Axios Base Setup
axios.defaults.baseURL = 'http://localhost:5000';

// Contexts
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token/Fetch user details
      axios.get('/api/auth/profile')
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Auth session expired", err);
          logout();
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Sync dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
          <span className="absolute text-sm font-semibold text-slate-600 dark:text-slate-300">AI</span>
        </div>
      </div>
    );
  }

  // Route wrappers
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  const AdminRoute = ({ children }) => {
    return token && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, darkMode, toggleDarkMode }}>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/new-validation" element={<ProtectedRoute><NewValidation /></ProtectedRoute>} />
              <Route path="/report/:reportId" element={<ProtectedRoute><ReportDetails /></ProtectedRoute>} />
              <Route path="/report/:reportId/business-plan" element={<ProtectedRoute><BusinessPlanPage /></ProtectedRoute>} />
              <Route path="/report/:reportId/pitch-deck" element={<ProtectedRoute><PitchDeckPage /></ProtectedRoute>} />
              
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPanel /></AdminRoute></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
