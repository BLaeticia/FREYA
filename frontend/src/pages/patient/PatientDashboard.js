import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { appointmentsAPI, notificationsAPI } from '../../services/api';
import FavorisWidget from '../../components/FavorisWidget';
// Dans le JSX, après les stats :
<FavorisWidget />

const PatientDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('accueil');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const firstName = user?.first_name || 'Patient';
  const lastName = user?.last_name || '';
  const initials = `${user?.first_name?.[0] || 'P'}${user?.last_name?.[0] || ''}`.toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, notifRes] = await Promise.allSettled([
          appointmentsAPI.getMyAppointments({ limit: 5 }),
          notificationsAPI.getAll(),
        ]);
        if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data?.appointments || []);
        if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data?.notifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));
  const unreadNotifs = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Déconnecté avec succès');
  };

  const statusMap = {
    pending: { label: 'En attente', color: '#D97706', bg: '#FEF3C7' },
    confirmed: { label: 'Confirmé', color: '#16A34A', bg: '#DCFCE7' },
    completed: { label: 'Terminé', color: '#64748B', bg: '#F1F5F9' },
    cancelled: { label: 'Annulé', color: '#DC2626', bg: '#FEE2E2' },
  };

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const avatarColors = ['#0D9488', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  const s = {
    root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh' },

    // NAVBAR
    navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '32px' },
    logo: { fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', flexShrink: 0, textDecoration: 'none' },
    logoAccent: { color: '#F97316' },
    navLinks: { display: 'flex', gap: '4px', flex: 1 },
    navLink: (active) => ({
      padding: '7px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: active ? '600' : '400',
      color: active ? '#0D9488' : '#64748B', backgroundColor: active ? '#CCFBF1' : 'transparent',
      textDecoration: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
    }),
    navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
    notifBtn: { position: 'relative', backgroundColor: '#F0F9F8', border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', fontSize: '18px' },
    notifBadge: { position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', backgroundColor: '#EF4444', borderRadius: '50%', fontSize: '9px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
    rdvBtn: { background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px 6px 6px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff' },
    userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #065a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
    userName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
    dropdown: { position: 'absolute', top: '72px', right: '32px', backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '200px', zIndex: 200, overflow: 'hidden' },
    dropdownItem: { padding: '12px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' },

    // CONTENT
    content: { maxWidth: '1200px', margin: '0 auto', padding: '28px 32px' },

    // Welcome banner
    welcomeBanner: { background: 'linear-gradient(135deg, #065a50 0%, #0D9488 100%)', borderRadius: '20px', padding: '28px 36px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' },
    bannerShape1: { position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' },
    bannerShape2: { position: 'absolute', right: '80px', bottom: '-60px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' },
    bannerLeft: { position: 'relative', zIndex: 1 },
    bannerGreeting: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '6px' },
    bannerSub: { fontSize: '14px', color: 'rgba(255,255,255,0.75)' },
    bannerInfo: { marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' },
    bannerBtn: { backgroundColor: '#fff', color: '#0D9488', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', position: 'relative', zIndex: 1, flexShrink: 0 },

    // Stats
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: (color, bg) => ({ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', borderTop: `3px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '14px' }),
    statIcon: (bg) => ({ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }),
    statNumber: (color) => ({ fontSize: '26px', fontWeight: '800', color, letterSpacing: '-1px' }),
    statLabel: { fontSize: '12px', color: '#64748B', marginTop: '2px' },

    // Grid
    grid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    cardTitle: { fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    viewAll: { fontSize: '12px', color: '#0D9488', cursor: 'pointer', fontWeight: '500', textDecoration: 'none' },

    apptItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '12px', backgroundColor: '#F8FAFC', marginBottom: '10px', border: '1px solid #E2E8F0' },
    apptAvatar: (color) => ({ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '20', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }),
    apptInfo: { flex: 1 },
    apptDoctor: { fontSize: '14px', fontWeight: '600', color: '#0F172A' },
    apptSpec: { fontSize: '12px', color: '#64748B', marginTop: '2px' },
    apptMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
    statusBadge: (status) => ({ fontSize: '11px', fontWeight: '600', color: statusMap[status]?.color || '#64748B', backgroundColor: statusMap[status]?.bg || '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }),
    apptTime: { fontSize: '11px', color: '#64748B' },

    emptyState: { textAlign: 'center', padding: '32px 20px', color: '#94A3B8' },
    emptyIcon: { fontSize: '36px', marginBottom: '12px' },
    emptyText: { fontSize: '14px', fontWeight: '500' },
    emptyBtn: { marginTop: '12px', background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

    quickLinks: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    quickLink: (color, bg) => ({ backgroundColor: bg, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', border: `1px solid ${color}20` }),
    quickLinkIcon: { fontSize: '22px' },
    quickLinkText: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
    quickLinkSub: { fontSize: '11px', color: '#64748B' },

    notifItem: (read) => ({ padding: '12px', borderRadius: '10px', backgroundColor: read ? '#F8FAFC' : '#F0F9F8', marginBottom: '8px', border: `1px solid ${read ? '#E2E8F0' : '#CCFBF1'}` }),
    notifTitle: (read) => ({ fontSize: '13px', fontWeight: read ? '400' : '600', color: '#0F172A' }),
    notifDate: { fontSize: '11px', color: '#94A3B8', marginTop: '4px' },
  };

  return (
    <div style={s.root} onClick={() => { setShowUserMenu(false); setShowNotifs(false); }}>

      {/* NAVBAR */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={{ ...s.logo, textDecoration: 'none' }}>
            Frey<span style={s.logoAccent}>a</span>
          </Link>

          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} style={s.navLink(activeNav === link.id)} onClick={() => setActiveNav(link.id)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={s.navRight}>
            {/* Notifications */}
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={s.notifBtn} onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}>
                🔔
                {unreadNotifs > 0 && <span style={s.notifBadge}>{unreadNotifs}</span>}
              </button>
              {showNotifs && (
                <div style={{ ...s.dropdown, right: 0, top: '48px', width: '300px' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>Aucune notification</div>
                  ) : (
                    notifications.slice(0, 4).map((n, i) => (
                      <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', fontSize: '13px', color: n.is_read ? '#64748B' : '#0F172A', fontWeight: n.is_read ? '400' : '600' }}>
                        {n.title || n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button style={s.rdvBtn} onClick={() => navigate('/doctors')}>＋ Prendre RDV</button>

            {/* User menu */}
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={s.userName}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{firstName} {lastName}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{user?.email}</div>
                  </div>
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/patient/profile' },
                    { icon: '📅', label: 'Mes rendez-vous', path: '/patient/appointments' },
                    { icon: '⚙️', label: 'Paramètres', path: '/patient/profile' },
                  ].map((item, i) => (
                    <div key={i} style={s.dropdownItem} onClick={() => { navigate(item.path); setShowUserMenu(false); }}>
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={handleLogout}>
                      <span>🚪</span> Déconnexion
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={s.content}>

        {/* Welcome Banner */}
        <div style={s.welcomeBanner}>
          <div style={s.bannerShape1} />
          <div style={s.bannerShape2} />
          <div style={s.bannerLeft}>
            <div style={s.bannerGreeting}>Bonjour, {firstName} 👋</div>
            <div style={s.bannerSub}>{today.charAt(0).toUpperCase() + today.slice(1)}</div>
            <div style={s.bannerInfo}>
              Vous avez <strong style={{ color: '#fff' }}>{upcoming.length} rendez-vous</strong> à venir
            </div>
          </div>
          <button style={s.bannerBtn} onClick={() => navigate('/doctors')}>
            🔍 Trouver un médecin
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { icon: '📅', label: 'RDV à venir', value: upcoming.length, color: '#0D9488', bg: '#CCFBF1' },
            { icon: '✅', label: 'Consultations', value: past.length, color: '#10B981', bg: '#DCFCE7' },
            { icon: '🔔', label: 'Notifications', value: unreadNotifs, color: '#F59E0B', bg: '#FEF3C7' },
            { icon: '👨‍⚕️', label: 'Mes médecins', value: '—', color: '#8B5CF6', bg: '#EDE9FE' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard(stat.color, stat.bg)}>
              <div style={s.statIcon(stat.bg)}>{stat.icon}</div>
              <div>
                <div style={s.statNumber(stat.color)}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={s.grid}>
          {/* Appointments */}
          <div style={s.card}>
            <div style={s.cardTitle}>
              <span>📅 Prochains rendez-vous</span>
              <Link to="/patient/appointments" style={s.viewAll}>Voir tout →</Link>
            </div>
            {loading ? (
              <div style={s.emptyState}><div style={s.emptyIcon}>⏳</div><div style={s.emptyText}>Chargement...</div></div>
            ) : upcoming.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>📅</div>
                <div style={s.emptyText}>Aucun rendez-vous à venir</div>
                <button style={s.emptyBtn} onClick={() => navigate('/doctors')}>Prendre un RDV →</button>
              </div>
            ) : (
              upcoming.map((appt, i) => {
                const color = avatarColors[i % avatarColors.length];
                const doctorName = `Dr. ${appt.doctor_first_name || ''} ${appt.doctor_last_name || ''}`.trim();
                const apptInitials = doctorName.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('');
                return (
                  <div key={appt.id} style={s.apptItem}>
                    <div style={s.apptAvatar(color)}>{apptInitials || 'Dr'}</div>
                    <div style={s.apptInfo}>
                      <div style={s.apptDoctor}>{doctorName}</div>
                      <div style={s.apptSpec}>{appt.specialty || 'Médecin'}</div>
                    </div>
                    <div style={s.apptMeta}>
                      <span style={s.statusBadge(appt.status)}>{statusMap[appt.status]?.label || appt.status}</span>
                      <span style={s.apptTime}>📅 {new Date(appt.appointment_date).toLocaleDateString('fr-FR')}</span>
                      <span style={s.apptTime}>⏰ {appt.start_time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick links */}
            <div style={s.card}>
              <div style={s.cardTitle}><span>⚡ Accès rapide</span></div>
              <div style={s.quickLinks}>
                {[
                  { icon: '🔍', label: 'Rechercher', sub: 'un médecin', color: '#0D9488', bg: '#CCFBF1', path: '/doctors' },
                  { icon: '📅', label: 'Mes RDV', sub: 'calendrier', color: '#8B5CF6', bg: '#EDE9FE', path: '/patient/appointments' },
                  { icon: '💬', label: 'Messages', sub: 'soignants', color: '#F59E0B', bg: '#FEF3C7', path: '/patient/messages' },
                  { icon: '📄', label: 'Dossier', sub: 'médical', color: '#10B981', bg: '#DCFCE7', path: '/patient/dossier' },
                ].map((item, i) => (
                  <Link key={i} to={item.path} style={s.quickLink(item.color, item.bg)}>
                    <span style={s.quickLinkIcon}>{item.icon}</span>
                    <div>
                      <div style={s.quickLinkText}>{item.label}</div>
                      <div style={s.quickLinkSub}>{item.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={s.card}>
              <div style={s.cardTitle}>
                <span>🔔 Notifications</span>
                {unreadNotifs > 0 && (
                  <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                    {unreadNotifs} nouveau{unreadNotifs > 1 ? 'x' : ''}
                  </span>
                )}
              </div>
              {loading ? (
                <div style={s.emptyState}><div>⏳</div></div>
              ) : notifications.length === 0 ? (
                <div style={s.emptyState}>
                  <div style={s.emptyIcon}>🔔</div>
                  <div style={s.emptyText}>Aucune notification</div>
                </div>
              ) : (
                notifications.slice(0, 4).map((notif, i) => (
                  <div key={i} style={s.notifItem(notif.is_read)}>
                    <div style={s.notifTitle(notif.is_read)}>{notif.title || notif.message}</div>
                    <div style={s.notifDate}>{new Date(notif.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
