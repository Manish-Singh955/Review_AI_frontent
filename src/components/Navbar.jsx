import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const links = isAdmin
    ? [
        { label: 'Dashboard', to: '/admin' },
        { label: 'Statistics', to: '/admin#statistics' },
        { label: 'Users', to: '/admin#users' },
        { label: 'Businesses', to: '/admin#businesses' },
        { label: 'Locations', to: '/admin#locations' },
        { label: 'Feedback', to: '/admin#feedback' },
      ]
    : [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Business Profile', to: '/business' },
        { label: 'Locations / QR', to: '/locations' },
        { label: 'Reviews', to: '/dashboard#recent-reviews' },
        { label: 'Feedback', to: '/feedback' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand fw-bold" to={isAdmin ? '/admin' : '/dashboard'}>Scanrly</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navigation" aria-controls="main-navigation" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="main-navigation">
          <div className="navbar-nav me-auto">
            {links.map((link) => (
              <NavLink key={link.label} className="nav-link" to={link.to}>{link.label}</NavLink>
            ))}
          </div>
          <div className="d-flex align-items-center gap-3 py-2 py-lg-0">
            <span className="small text-secondary">{user?.name || 'Account'}</span>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
