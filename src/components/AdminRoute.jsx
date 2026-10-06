import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from './Navbar';

const AdminRoute = () => {
  const { token } = useAuth();
  const [access, setAccess] = useState('checking');

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.get('/auth/me')
      .then((response) => {
        if (!active) return;
        setAccess(response.data.user.role === 'admin' ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (active) setAccess('denied');
      });
    return () => { active = false; };
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (access === 'checking') return <div className="container py-5"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Checking access</span></div></div>;
  if (access !== 'allowed') return <Navigate to="/dashboard" replace />;
  return <><Navbar /><Outlet /></>;
};

export default AdminRoute;
