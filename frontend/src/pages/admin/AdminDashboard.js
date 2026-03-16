import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const firstName = user?.first_name || 'Admin';
  const initials = `${user?.first_name?.[0] || 'A'}${user?.last_name?.[0] || ''}`.toUpperCase();

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const navLinks = [
    { id: 'dashboard', label: 'Tableau de bord', path: '/admin' },
    { id: 'doctors', label: 'Médecins', path: '/admin/doctors' },
    { id: 'patients', label: 'Patients', path: '/admin/patients' },
    { id: 'clinics', label: 'Cliniques', path: '/admin/clinics' },
    { id: 'appointments', label: 'Rendez-vous', path: '/admin/appointments' },
  ];

  const s = {
    root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: '#0F172A', borderBottom: '1px solid #1E293B', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.2)', flexShrink: 0 },
    navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '24px' },
    logo: { fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', flexShrink: 0, textDecoration: 'none' },
    logoAccent: { color: '#F97316' },
    adminBadge: { fontSize: '10px', fontWeight: '700', backgroundColor: '#F97316', color: '#fff', padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.5px' },
    navLinks: { display: 'flex', gap: '4px', flex: 1 },
    navLink: (active) => ({ padding: '7px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: active ? '600' : '400', color: active ? '#fff' : '#94A3B8', backgroundColor: active ? '#1E293B' : 'transparent', textDecoration: 'none', whiteSpace: 'nowrap' }),
    navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
    userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 6px 6px', borderRadius: '10px', border: '1.5px solid #1E293B', cursor: 'pointer', backgroundColor: '#1E293B' },
    userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
    dropdown: { position: 'absolute', top: '48px', right: 0, backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '200px', zIndex: 200, overflow: 'hidden' },
    dropdownItem: { padding: '12px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' },
    main: { flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '28px 32px', boxSizing: 'border-box' },
    pageHeader: { marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    pageTitle: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px', marginBottom: '28px' },
    statCard: (highlight) => ({ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: highlight ? '2px solid #F97316' : '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }),
    statIcon: { fontSize: '28px' },
    statVal: (highlight) => ({ fontSize: '28px', fontWeight: '800', color: highlight ? '#F97316' : '#0F172A', letterSpacing: '-1px' }),
    statLabel: { fontSize: '13px', color: '#64748B', fontWeight: '500' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1.5px solid #E2E8F0', marginBottom: '20px' },
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '18px' },
    actionBtn: (primary) => ({
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '11px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
      textDecoration: 'none', cursor: 'pointer', border: 'none',
      background: primary ? 'linear-gradient(135deg, #0D9488, #065a50)' : '#fff',
      color: primary ? '#fff' : '#0F172A',
      border: primary ? 'none' : '1.5px solid #E2E8F0',
      boxShadow: primary ? '0 2px 8px rgba(13,148,136,0.3)' : 'none',
    }),
  };

  const statItems = stats ? [
    { icon: '👤', val: stats.total_users, label: 'Patients inscrits', highlight: false },
    { icon: '👨‍⚕️', val: stats.approved_doctors, label: 'Médecins actifs', highlight: false },
    { icon: '⏳', val: stats.pending_doctors, label: 'En attente validation', highlight: stats?.pending_doctors > 0 },
    { icon: '📅', val: stats.total_appointments, label: 'RDV total', highlight: false },
    { icon: '🏥', val: stats.total_clinics, label: 'Cliniques', highlight: false },
    { icon: '📊', val: stats.appointments_today, label: "RDV aujourd'hui", highlight: false },
  ] : [];

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      {/* NAVBAR */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <span style={s.adminBadge}>ADMIN</span>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} style={s.navLink(link.id === 'dashboard')}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(!showUserMenu)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{firstName} {user?.last_name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{user?.email}</div>
                    <div style={{ fontSize: '11px', color: '#F97316', fontWeight: '600', marginTop: '2px' }}>Administrateur</div>
                  </div>
                  <div style={{ borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={handleLogout}><span>🚪</span> Déconnexion</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Tableau de bord Admin 🛡️</h1>
            <p style={s.pageSubtitle}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} — Vue globale de la plateforme Freya
            </p>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div style={s.statsGrid}>
            {statItems.map((st, i) => (
              <div key={i} style={s.statCard(st.highlight)}>
                <div style={s.statIcon}>{st.icon}</div>
                <div style={s.statVal(st.highlight)}>{st.val ?? '—'}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Actions rapides */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>⚡ Actions rapides</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button style={s.actionBtn(true)} onClick={() => navigate('/admin/doctors')}>
              👨‍⚕️ Valider les médecins
              {stats?.pending_doctors > 0 && (
                <span style={{ backgroundColor: '#FEF9C3', color: '#CA8A04', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                  {stats.pending_doctors}
                </span>
              )}
            </button>
            <button style={s.actionBtn(false)} onClick={() => navigate('/admin/clinics')}>
              🏥 Gérer les cliniques
            </button>
            <button style={s.actionBtn(false)} onClick={() => navigate('/admin/patients')}>
              👤 Gérer les patients
            </button>
            <button style={s.actionBtn(false)} onClick={() => navigate('/admin/appointments')}>
              📅 Tous les rendez-vous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}