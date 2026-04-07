import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { appointmentsAPI, notificationsAPI } from '../../services/api';

const PatientDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [activeNav, setActiveNav] = useState('accueil');

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
    pending:   { label: 'En attente', color: '#B45309', bg: '#FEF3C7', dot: '#F59E0B' },
    confirmed: { label: 'Confirmé',   color: '#065F46', bg: '#D1FAE5', dot: '#10B981' },
    completed: { label: 'Terminé',    color: '#475569', bg: '#F1F5F9', dot: '#94A3B8' },
    cancelled: { label: 'Annulé',     color: '#991B1B', bg: '#FEE2E2', dot: '#EF4444' },
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const avatarColors = ['#0D9488', '#7C3AED', '#0284C7', '#D97706', '#DB2777', '#059669'];

  const navLinks = [
    { id: 'accueil',  label: 'Accueil',           path: '/patient' },
    { id: 'rdv',      label: 'Mes rendez-vous',   path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages',           path: '/patient/messages' },
    { id: 'dossier',  label: 'Dossier médical',    path: '/patient/dossier' },
    { id: 'favoris',  label: '❤ Favoris',          path: '/patient/favoris' },
  ];

  const quickActions = [
    { icon: '🔍', label: 'Rechercher', sub: 'Spécialité ou nom', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', path: '/doctors' },
    { icon: '📅', label: 'Mes RDV', sub: 'Gérer mon agenda', color: '#7C3AED', bg: '#FAF5FF', border: '#DDD6FE', path: '/patient/appointments' },
    { icon: '📄', label: 'Documents', sub: 'Analyses & Ordonnances', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', path: '/patient/dossier' },
    { icon: '👨‍👩‍👧‍👦', label: 'Ma famille', sub: 'Gérer mes proches', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', path: '/patient/profile' },
  ];

  const nextAppt = upcoming[0];
  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div style={s.root} onClick={() => { setShowUserMenu(false); setShowNotifs(false); }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .nav-lnk { transition: all 0.15s ease; border-bottom: 2px solid transparent; }
        .nav-lnk:hover { background-color: #F8FAFC !important; color: #0F172A !important; }
        .appt-row { transition: all 0.2s ease; }
        .appt-row:hover { background-color: #fff !important; transform: scale(1.01); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .quick-card { transition: all 0.18s ease; }
        .quick-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .pill-btn { transition: all 0.15s ease; border: none; outline: none; }
        .pill-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .fade-in { animation: fadeSlide 0.4s ease both; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .skeleton { animation: pulse 1.5s ease infinite; background: #E2E8F0; border-radius: 8px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}> Frey<span style={s.logoAccent}>a</span> </Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className="nav-lnk" style={s.navLink(activeNav === link.id)} onClick={() => setActiveNav(link.id)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={s.iconBtn} onClick={() => { setShowNotifs(v => !v); setShowUserMenu(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadNotifs > 0 && <span style={s.notifBadge}>{unreadNotifs}</span>}
              </button>
              {showNotifs && (
                <div style={s.notifDropdown} className="fade-in">
                  <div style={s.notifHeader}>
                    <span style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>Notifications</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>Aucune notification</div>
                  ) : (
                    notifications.slice(0, 5).map((n, i) => (
                      <div key={i} style={s.notifItem(n.is_read)}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.is_read ? '#CBD5E1' : '#0D9488', flexShrink: 0, marginTop: '4px' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: n.is_read ? '400' : '600' }}>{n.title || n.message}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(n.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <button className="pill-btn" style={s.ctaBtn} onClick={() => navigate('/doctors')}>Prendre RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={s.userBtn} onClick={() => { setShowUserMenu(v => !v); setShowNotifs(false); }}>
                <div style={s.userAvatar}>{initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700' }}>{firstName}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Patient</div>
                </div>
              </button>
              {showUserMenu && (
                <div style={s.userDropdown} className="fade-in">
                   <div style={s.dropdownTop}>
                      <div style={s.userAvatar}>{initials}</div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{firstName} {lastName}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user?.email}</div>
                      </div>
                   </div>
                   <div style={{ padding: '8px' }}>
                      <div style={s.dropdownItem} onClick={() => navigate('/patient/profile')}>👤 Mon profil</div>
                      <div style={s.dropdownItem} onClick={handleLogout}>🚪 Déconnexion</div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ══ MAIN CONTENT ══ */}
      <main style={s.main}>
        
        {/* 1. BARRE DE RECHERCHE DOCTOLIB STYLE */}
        <div style={s.searchBarContainer} className="fade-in">
          <div style={s.searchIcon}>🔍</div>
          <input 
            type="text" 
            placeholder="Nom du médecin, spécialité, ville (ex: Cardiologue, Alger...)" 
            style={s.searchInput}
            onFocus={() => navigate('/doctors')} 
          />
          <button style={s.searchBtn} onClick={() => navigate('/doctors')}>Rechercher</button>
        </div>

        {/* 2. HERO BANNER */}
        <div style={s.heroBanner} className="fade-in">
          <div style={s.heroLeft}>
            <div style={s.heroGreeting}>Bonjour, <span style={{ color: '#5EEAD4' }}>{firstName}</span> 👋</div>
            <div style={s.heroDate}>{today}</div>
            <div style={s.heroStat}>
              {upcoming.length > 0 ? <><span style={s.heroStatNum}>{upcoming.length}</span> rendez-vous à venir</> : 'Aucun rendez-vous prévu'}
            </div>
          </div>

          {nextAppt ? (
            <div style={s.nextApptCard}>
              <div style={s.nextApptLabel}>Prochain rendez-vous</div>
              <div style={s.nextApptDoctor}>Dr. {nextAppt.doctor_first_name} {nextAppt.doctor_last_name}</div>
              <div style={s.nextApptTime}>📅 {formatDate(nextAppt.appointment_date)} à {nextAppt.start_time}</div>
              <div style={{ ...s.statusBadge, marginTop: '10px', backgroundColor: statusMap[nextAppt.status]?.bg, color: statusMap[nextAppt.status]?.color }}>
                {statusMap[nextAppt.status]?.label}
              </div>
            </div>
          ) : (
            <div style={s.nextApptCard}>
              <div style={s.nextApptLabel}>Prêt pour un check-up ?</div>
              <button className="pill-btn" style={s.heroSearchBtn} onClick={() => navigate('/doctors')}>Trouver un médecin</button>
            </div>
          )}
        </div>

        {/* 3. GRILLE DE CONTENU */}
        <div style={s.contentGrid}>
          {/* GAUCHE : RDV */}
          <div style={s.card} className="fade-in">
            <div style={s.cardHeader}>
              <div style={s.cardTitle}><div style={s.cardTitleDot('#0D9488')} /> Vos prochains rendez-vous</div>
              <Link to="/patient/appointments" style={s.viewAll}>Tout voir →</Link>
            </div>
            {loading ? <div className="skeleton" style={{ height: '100px' }} /> : 
              upcoming.length === 0 ? (
                <div style={s.emptyState}>Vous n'avez pas de rendez-vous confirmés.</div>
              ) : (
                upcoming.map((appt, i) => (
                  <div key={appt.id} className="appt-row" style={s.apptRow}>
                    <div style={s.apptAvatar(avatarColors[i % 6])}>Dr</div>
                    <div style={{ flex: 1 }}>
                      <div style={s.apptDoctorName}>Dr. {appt.doctor_first_name} {appt.doctor_last_name}</div>
                      <div style={s.apptSpecialty}>{appt.specialty}</div>
                      <div style={s.apptDateRow}>
                        <span style={s.apptDateChip}>📅 {formatDate(appt.appointment_date)}</span>
                        <span style={s.apptDateChip}>⏰ {appt.start_time}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div style={{ ...s.statusBadge, backgroundColor: statusMap[appt.status]?.bg, color: statusMap[appt.status]?.color }}>
                            {statusMap[appt.status]?.label}
                        </div>
                        <button style={s.manageBtn} onClick={() => navigate('/patient/appointments')}>Gérer</button>
                    </div>
                  </div>
                ))
              )
            }
          </div>

          {/* DROITE : ACTIONS & INFOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={s.card}>
              <div style={s.cardTitle}><div style={s.cardTitleDot('#7C3AED')} /> Accès rapide</div>
              <div style={s.quickGrid}>
                {quickActions.map((action, i) => (
                  <Link key={i} to={action.path} className="quick-card" style={s.quickCard(action.color, action.bg, action.border)}>
                    <span style={{ fontSize: '20px' }}>{action.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{action.label}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{action.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* BADGE DE SÉCURITÉ (Très important pour un PFE) */}
            <div style={s.securityBadge}>
               <span style={{ fontSize: '18px' }}>🔐</span>
               <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#065F46' }}>Données Sécurisées</div>
                  <div style={{ fontSize: '10px', color: '#0D9488' }}>Vos informations médicales sont protégées selon les normes de santé.</div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ══ STYLES ══ */
const s = {
  root: { fontFamily: "'Sora', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh' },
  navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '65px', display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#0F172A', textDecoration: 'none' },
  logoAccent: { color: '#0D9488' },
  navLinks: { display: 'flex', gap: '5px', flex: 1 },
  navLink: (active) => ({ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: active ? '#0D9488' : '#64748B', textDecoration: 'none', backgroundColor: active ? '#F0FDFA' : 'transparent', fontWeight: active ? '600' : '400' }),
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconBtn: { padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#fff', cursor: 'pointer', position: 'relative' },
  notifBadge: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#EF4444', color: '#fff', fontSize: '9px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  ctaBtn: { backgroundColor: '#0D9488', color: '#fff', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#fff', cursor: 'pointer' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#0D9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' },
  
  /* SEARCH BAR */
  searchBarContainer: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '6px 10px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' },
  searchIcon: { padding: '0 10px', color: '#94A3B8' },
  searchInput: { flex: 1, border: 'none', outline: 'none', padding: '12px', fontSize: '14px' },
  searchBtn: { backgroundColor: '#0D9488', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },

  /* HERO */
  heroBanner: { background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)', borderRadius: '20px', padding: '30px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', position: 'relative', overflow: 'hidden' },
  heroGreeting: { fontSize: '24px', fontWeight: '800', marginBottom: '4px' },
  heroDate: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '15px' },
  heroStatNum: { fontSize: '20px', fontWeight: '800', color: '#5EEAD4' },
  nextApptCard: { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '20px', borderRadius: '16px', minWidth: '260px' },
  nextApptLabel: { fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '8px' },
  nextApptDoctor: { fontSize: '16px', fontWeight: '700' },
  nextApptTime: { fontSize: '12px', marginTop: '4px', color: 'rgba(255,255,255,0.8)' },
  heroSearchBtn: { backgroundColor: '#fff', color: '#0D9488', padding: '10px 15px', borderRadius: '8px', fontWeight: '700', fontSize: '12px', marginTop: '10px' },

  /* LAYOUT & CARDS */
  main: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '18px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '700' },
  cardTitleDot: (color) => ({ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }),
  viewAll: { fontSize: '12px', color: '#0D9488', textDecoration: 'none', fontWeight: '600' },
  
  /* APPOINTMENT ROW */
  apptRow: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '14px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', marginBottom: '10px', cursor: 'pointer' },
  apptAvatar: (color) => ({ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: color+'20', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }),
  apptDoctorName: { fontSize: '14px', fontWeight: '700', color: '#1E293B' },
  apptSpecialty: { fontSize: '12px', color: '#64748B' },
  apptDateRow: { display: 'flex', gap: '10px', marginTop: '6px' },
  apptDateChip: { fontSize: '11px', backgroundColor: '#fff', padding: '3px 8px', borderRadius: '6px', color: '#475569', border: '1px solid #E2E8F0' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', display: 'inline-flex' },
  manageBtn: { backgroundColor: 'transparent', border: '1px solid #0D9488', color: '#0D9488', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' },

  /* QUICK ACTIONS */
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '15px' },
  quickCard: (color, bg, border) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '14px', backgroundColor: bg, border: `1px solid ${border}`, textDecoration: 'none', color: '#1E293B' }),
  
  securityBadge: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '14px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', marginTop: '10px' },
  
  notifDropdown: { position: 'absolute', top: '45px', right: 0, width: '280px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 200 },
  notifItem: (read) => ({ padding: '12px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '10px', backgroundColor: read ? '#fff' : '#F0FDFA' }),
  userDropdown: { position: 'absolute', top: '50px', right: 0, width: '220px', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 200 },
  dropdownTop: { padding: '15px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '10px', alignItems: 'center' },
  dropdownItem: { padding: '10px 15px', fontSize: '13px', cursor: 'pointer', hover: { backgroundColor: '#F8FAFC' } },
  emptyState: { textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '40px 0' },
};

export default PatientDashboard;