import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doctorsAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const statusBadge = (s) => {
  const map = {
    pending: { bg: '#FEF9C3', color: '#CA8A04', label: 'En attente' },
    confirmed: { bg: '#DCFCE7', color: '#16A34A', label: 'Confirmé' },
    completed: { bg: '#DBEAFE', color: '#2563EB', label: 'Terminé' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulé' },
  };
  const st = map[s] || { bg: '#F1F5F9', color: '#64748B', label: s };
  return (
    <span style={{ backgroundColor: st.bg, color: st.color, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
      {st.label}
    </span>
  );
};

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const firstName = user?.first_name || 'Médecin';
  const lastName = user?.last_name || '';
  const initials = `${user?.first_name?.[0] || 'D'}${user?.last_name?.[0] || ''}`.toUpperCase();

  useEffect(() => {
    doctorsAPI.getDashboardStats()
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const navLinks = [
    { id: 'dashboard', label: 'Tableau de bord', path: '/doctor' },
    { id: 'appointments', label: 'Rendez-vous', path: '/doctor/appointments' },
    { id: 'patients', label: 'Mes patients', path: '/doctor/patients' },
    { id: 'messages', label: 'Messages', path: '/doctor/messages' },
    { id: 'profile', label: 'Mon profil', path: '/doctor/profile' },
  ];

  const stats = data?.stats || {};
  const upcoming = data?.upcoming || [];
  const unreadMessages = stats.unread_messages || 0;

  const s = {
    root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', flexShrink: 0 },
    navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '24px' },
    logo: { fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', flexShrink: 0, textDecoration: 'none' },
    logoAccent: { color: '#F97316' },
    navLinks: { display: 'flex', gap: '4px', flex: 1 },
    navLink: (active) => ({ padding: '7px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: active ? '600' : '400', color: active ? '#0D9488' : '#64748B', backgroundColor: active ? '#CCFBF1' : 'transparent', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }),
    navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
    userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 6px 6px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff' },
    userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #065a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
    dropdown: { position: 'absolute', top: '48px', right: 0, backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '200px', zIndex: 200, overflow: 'hidden' },
    dropdownItem: { padding: '12px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' },
    main: { flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '28px 32px', boxSizing: 'border-box' },
    pageHeader: { marginBottom: '24px' },
    pageTitle: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px', marginBottom: '28px' },
    statCard: (highlight) => ({ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: highlight ? '2px solid #0D9488' : '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }),
    statIcon: { fontSize: '28px' },
    statVal: (highlight) => ({ fontSize: '28px', fontWeight: '800', color: highlight ? '#0D9488' : '#0F172A', letterSpacing: '-1px' }),
    statLabel: { fontSize: '13px', color: '#64748B', fontWeight: '500' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1.5px solid #E2E8F0', marginBottom: '20px' },
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '18px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px 14px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid #E2E8F0' },
    td: { padding: '14px', fontSize: '14px', color: '#0F172A', borderBottom: '1px solid #F1F5F9' },
    avatar: { width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0D9488, #065a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' },
    emptyState: { textAlign: 'center', padding: '40px 20px', color: '#94A3B8' },
    loadingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' },
  };

  if (loading) return (
    <div style={s.root}>
      <div style={s.loadingWrap}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTop: '3px solid #0D9488', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748B', fontSize: '14px' }}>Chargement...</p>
      </div>
    </div>
  );

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      {/* NAVBAR */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} style={s.navLink(link.id === 'dashboard')}>
                {link.label}
                {link.id === 'messages' && unreadMessages > 0 && (
                  <span style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '10px' }}>{unreadMessages}</span>
                )}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(!showUserMenu)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Dr. {lastName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Dr. {firstName} {lastName}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{user?.email}</div>
                  </div>
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/doctor/profile' },
                    { icon: '📅', label: 'Mes rendez-vous', path: '/doctor/appointments' },
                    { icon: '💬', label: 'Messages', path: '/doctor/messages' },
                  ].map((item, i) => (
                    <div key={i} style={s.dropdownItem} onClick={() => navigate(item.path)}>
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}
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
          <h1 style={s.pageTitle}>Bonjour, Dr. {lastName} 👋</h1>
          <p style={s.pageSubtitle}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} — Voici un aperçu de votre activité aujourd'hui
          </p>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { icon: '📅', val: stats.today_appointments || 0, label: "RDV aujourd'hui", highlight: false },
            { icon: '⏳', val: stats.pending_appointments || 0, label: 'En attente', highlight: stats.pending_appointments > 0 },
            { icon: '👥', val: stats.total_patients || 0, label: 'Patients total', highlight: false },
            { icon: '💬', val: stats.unread_messages || 0, label: 'Messages non lus', highlight: stats.unread_messages > 0 },
            { icon: '⭐', val: stats.rating_avg?.rating_avg ? `${parseFloat(stats.rating_avg.rating_avg).toFixed(1)}/5` : '—', label: 'Note moyenne', highlight: false },
            { icon: '📊', val: stats.total_appointments || 0, label: 'RDV total', highlight: false },
          ].map((st, i) => (
            <div key={i} style={s.statCard(st.highlight)}>
              <div style={s.statIcon}>{st.icon}</div>
              <div style={s.statVal(st.highlight)}>{st.val}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming appointments */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={s.cardTitle}>📋 Prochains rendez-vous</h3>
            <button
              onClick={() => navigate('/doctor/appointments')}
              style={{ background: 'none', border: '1.5px solid #0D9488', color: '#0D9488', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Voir tout →
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
              <h3 style={{ color: '#64748B', fontWeight: '600' }}>Aucun rendez-vous à venir</h3>
              <p style={{ fontSize: '13px' }}>Vos prochains créneaux apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Patient', 'Date', 'Heure', 'Motif', 'Statut'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map(a => (
                    <tr key={a.id}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={s.avatar}>{a.first_name?.[0]}{a.last_name?.[0]}</div>
                          <span style={{ fontWeight: '500' }}>{a.first_name} {a.last_name}</span>
                        </div>
                      </td>
                      <td style={s.td}>{new Date(a.appointment_date).toLocaleDateString('fr-FR')}</td>
                      <td style={s.td}><strong>{a.appointment_time}</strong></td>
                      <td style={{ ...s.td, color: '#64748B', fontSize: '13px' }}>{a.motif || '—'}</td>
                      <td style={s.td}>{statusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}