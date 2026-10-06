import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import AddLocation from './pages/AddLocation';
import BusinessProfile from './pages/BusinessProfile';
import CustomerReview from './pages/CustomerReview';
import Dashboard from './pages/Dashboard';
import EditLocation from './pages/EditLocation';
import Feedback from './pages/Feedback';
import Locations from './pages/Locations';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/review/:qrCode" element={<CustomerReview />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/business" element={<BusinessProfile />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/add" element={<AddLocation />} />
            <Route path="/locations/edit/:id" element={<EditLocation />} />
            <Route path="/qr" element={<Navigate to="/locations" replace />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
