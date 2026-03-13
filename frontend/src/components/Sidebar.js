import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const patientLinks = [
  { to: '/patient', icon: '🏠', label: 'Tableau de bord', exact: true },
  { to: '/patient/appointments', icon: '📅', label: 'Mes rendez-vous' },
  { to: '/patient/messages', icon: '💬', label: 'Messagerie' },
  { to: '/patient/dossier', icon: '📁', label: 'Mon dossier médical' },
  { to: '/patient/profile', icon: '👤', label: 'Mon profil' },
];

const doctorLinks = [
  { to: '/doctor', icon: '🏠', label: 'Tableau de bord', exact: true },
  { to: '/doctor/appointments', icon: '📅', label: 'Rendez-vous' },
  { to: '/doctor/messages', icon: '💬', label: 'Messagerie' },
  { to: '/doctor/patients', icon: '👥', label: 'Mes patients' },
  { to: '/doctor/availability', icon: '🕐', label: 'Disponibilités' },
  { to: '/doctor/profile', icon: '👨‍⚕️', label: 'Mon profil' },
];

const adminLinks = [
  { to: '/admin', icon: '📊', label: 'Tableau de bord', exact: true },
  { to: '/admin/doctors', icon: '👨‍⚕️', label: 'Médecins' },
  { to: '/admin/clinics', icon: '🏥', label: 'Cliniques' },
];

export default function Sidebar({ unreadMessages = 0 }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const links = user?.role === 'doctor' ? doctorLinks : user?.role === 'admin' ? adminLinks : patientLinks;

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Frey<span>a</span></div>

      <div style={{ padding: '12px 16px', marginBottom: '8px' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar avatar-sm" style={{ fontSize: '0.85rem' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">Navigation</div>

      <nav style={{ flex: 1 }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
            {link.label === 'Messagerie' && unreadMessages > 0 && (
              <span className="sidebar-badge">{unreadMessages}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/" className="sidebar-link" style={{ marginBottom: '4px' }}>
          <span className="icon">🌐</span> Site public
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
          <span className="icon">🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  );
}