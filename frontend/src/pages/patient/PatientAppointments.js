import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const UPCOMING = [
  { id: 1, doctor: 'Dr. Amira Benali', specialty: 'Cardiologue', date: 'Lundi 17 Mars 2026', time: '09h30', address: '12 Rue Didouche Mourad, Alger', avatar: 'AB', color: '#0D9488', type: 'Consultation', status: 'confirmed' },
  { id: 2, doctor: 'Dr. Karim Meziane', specialty: 'Généraliste', date: 'Jeudi 20 Mars 2026', time: '14h00', address: '5 Bd Krim Belkacem, Alger', avatar: 'KM', color: '#2563EB', type: 'Suivi', status: 'pending' },
];

const PAST = [
  { id: 3, doctor: 'Dr. Sonia Hadj', specialty: 'Dermatologue', date: '5 Février 2026', time: '10h00', address: '8 Rue Ben Mehidi, Alger', avatar: 'SH', color: '#7C3AED', type: 'Consultation', status: 'done' },
  { id: 4, doctor: 'Dr. Yacine Bouali', specialty: 'Pédiatre', date: '14 Janvier 2026', time: '11h30', address: '3 Rue Hassiba Ben Bouali, Alger', avatar: 'YB', color: '#F59E0B', type: 'Urgence', status: 'done' },
  { id: 5, doctor: 'Dr. Amira Benali', specialty: 'Cardiologue', date: '2 Décembre 2025', time: '09h00', address: '12 Rue Didouche Mourad, Alger', avatar: 'AB', color: '#0D9488', type: 'Contrôle', status: 'done' },
];

const STATUS_MAP = {
  confirmed: { bg: '#DCFCE7', color: '#16A34A', label: '✅ Confirmé' },
  pending:   { bg: '#FEF3C7', color: '#D97706', label: '⏳ En attente' },
  done:      { bg: '#F1F5F9', color: '#64748B', label: '✔ Terminé' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: '❌ Annulé' },
};

export default function PatientAppointments() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState({ upcoming: UPCOMING, past: PAST });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(null); // appt id
  const [showDetailModal, setShowDetailModal] = useState(null); // appt object

  const firstName = user?.first_name || 'Patient';
  const initials = `${user?.first_name?.[0] || 'P'}${user?.last_name?.[0] || ''}`.toUpperCase();

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const handleCancel = (id) => {
    setAppointments(prev => ({
      ...prev,
      upcoming: prev.upcoming.map(a => a.id === id ? { ...a, status: 'cancelled' } : a),
    }));
    setShowCancelModal(null);
    toast.success('Rendez-vous annulé.');
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
    { id: 'favoris', label: '❤️ Favoris', path: '/patient/favoris' },
  ];

  const list = activeTab === 'upcoming' ? appointments.upcoming : appointments.past;

  const parseDate = (dateStr) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 3) return { day: parts[1], month: parts[2]?.substring(0, 3) };
    return { day: '—', month: '—' };
  };

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .nav-link:hover { background-color: #F1F5F9 !important; }
        .appt-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-1px); }
        .appt-card { transition: all 0.18s ease; }
        .btn-hover:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-hover { transition: all 0.15s; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.22s ease; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className="nav-link" style={s.navLink(link.id === 'rdv')}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <button style={s.rdvBtn} onClick={() => setShowNewModal(true)}>+ Nouveau RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={s.userName}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={s.dropdownHeader}>
                    <div style={s.dropdownName}>{firstName} {user?.last_name}</div>
                    <div style={s.dropdownEmail}>{user?.email}</div>
                  </div>
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/patient/profile' },
                    { icon: '💬', label: 'Messages', path: '/patient/messages' },
                    { icon: '🗂️', label: 'Dossier médical', path: '/patient/dossier' },
                  ].map((item, i) => (
                    <div key={i} className="dropdown-item" style={s.dropdownItem} onClick={() => navigate(item.path)}>
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #F1F5F9' }}>
                    <div className="dropdown-item" style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={handleLogout}>
                      <span>🚪</span> Déconnexion
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={s.main}>
        {/* Page Header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>📅 Mes Rendez-vous</h1>
            <p style={s.pageSubtitle}>Gérez tous vos rendez-vous médicaux</p>
          </div>
          <button className="btn-hover" style={s.newBtn} onClick={() => setShowNewModal(true)}>
            + Nouveau rendez-vous
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { icon: '📅', val: appointments.upcoming.length, label: 'À venir', color: '#0D9488' },
            { icon: '✅', val: appointments.upcoming.filter(a => a.status === 'confirmed').length, label: 'Confirmés', color: '#16A34A' },
            { icon: '⏳', val: appointments.upcoming.filter(a => a.status === 'pending').length, label: 'En attente', color: '#D97706' },
            { icon: '✔', val: appointments.past.length, label: 'Passés', color: '#64748B' },
          ].map((st, i) => (
            <div key={i} style={s.statCard(st.color)}>
              <div style={{ fontSize: '26px' }}>{st.icon}</div>
              <div style={s.statVal(st.color)}>{st.val}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={s.tab(activeTab === 'upcoming')} onClick={() => setActiveTab('upcoming')}>
            📅 À venir ({appointments.upcoming.length})
          </button>
          <button style={s.tab(activeTab === 'past')} onClick={() => setActiveTab('past')}>
            ✔ Passés ({appointments.past.length})
          </button>
        </div>

        {/* List */}
        <div className="fade-up">
          {list.length === 0 && (
            <div style={s.emptyState}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <h3 style={{ color: '#64748B', fontWeight: '600' }}>Aucun rendez-vous</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Vos rendez-vous apparaîtront ici</p>
            </div>
          )}
          {list.map(appt => {
            const { day, month } = parseDate(appt.date);
            const st = STATUS_MAP[appt.status];
            return (
              <div key={appt.id} className="appt-card" style={s.apptCard(appt.status === 'cancelled')}>
                {/* Date block */}
                <div style={s.dateBlock(appt.color)}>
                  <div style={s.dateDay(appt.color)}>{day}</div>
                  <div style={s.dateMonth}>{month}</div>
                </div>

                <div style={s.divider} />

                {/* Avatar */}
                <div style={s.apptAvatar(appt.color)}>{appt.avatar}</div>

                {/* Info */}
                <div style={s.apptInfo}>
                  <div style={s.apptDoctor}>{appt.doctor}</div>
                  <div style={s.apptSpec}>{appt.specialty}</div>
                  <div style={s.apptMeta}>
                    <span style={s.metaTag}>⏰ {appt.time}</span>
                    <span style={s.metaTag}>📍 {appt.address}</span>
                    <span style={s.typeChip}>{appt.type}</span>
                    <span style={{ ...s.statusChip, backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={s.actions}>
                  {appt.status === 'done' && (
                    <button className="btn-hover" style={s.btnPrimary} onClick={() => navigate('/doctors')}>
                      🔄 Reprendre RDV
                    </button>
                  )}
                  {(appt.status === 'confirmed' || appt.status === 'pending') && (
                    <>
                      <button className="btn-hover" style={s.btnPrimary} onClick={() => setShowDetailModal(appt)}>
                        Détails
                      </button>
                      <button className="btn-hover" style={s.btnDanger} onClick={() => setShowCancelModal(appt.id)}>
                        Annuler
                      </button>
                    </>
                  )}
                  {appt.status === 'cancelled' && (
                    <button className="btn-hover" style={s.btnGhost} onClick={() => navigate('/doctors')}>
                      + Reprendre
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL: Nouveau RDV ── */}
      {showNewModal && (
        <div style={s.overlay} onClick={() => setShowNewModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>📅 Nouveau Rendez-vous</h2>
            <div style={s.formField}>
              <label style={s.formLabel}>Spécialité</label>
              <select style={s.formSelect}>
                {['Généraliste', 'Cardiologue', 'Dermatologue', 'Pédiatre', 'Ophtalmologue', 'Gynécologue', 'Neurologie'].map(sp => (
                  <option key={sp}>{sp}</option>
                ))}
              </select>
            </div>
            <div style={s.formField}>
              <label style={s.formLabel}>Wilaya</label>
              <select style={s.formSelect}>
                {['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tizi Ouzou', 'Sétif'].map(w => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
            <div style={s.formField}>
              <label style={s.formLabel}>Date souhaitée</label>
              <input type="date" style={s.formInput} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div style={s.formField}>
              <label style={s.formLabel}>Type de consultation</label>
              <select style={s.formSelect}>
                {['Consultation', 'Suivi', 'Urgence', 'Contrôle'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={s.formField}>
              <label style={s.formLabel}>Motif (optionnel)</label>
              <input type="text" placeholder="Ex: douleurs thoraciques..." style={s.formInput} />
            </div>
            <div style={s.modalBtns}>
              <button style={s.btnGhost} onClick={() => setShowNewModal(false)}>Annuler</button>
              <button className="btn-hover" style={s.btnPrimary} onClick={() => { setShowNewModal(false); navigate('/doctors'); }}>
                Rechercher un médecin →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Confirmer annulation ── */}
      {showCancelModal && (
        <div style={s.overlay} onClick={() => setShowCancelModal(null)}>
          <div style={{ ...s.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ ...s.modalTitle, textAlign: 'center' }}>Annuler ce rendez-vous ?</h2>
            <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '24px' }}>
              Cette action est irréversible. Le médecin sera notifié de l'annulation.
            </p>
            <div style={s.modalBtns}>
              <button style={s.btnGhost} onClick={() => setShowCancelModal(null)}>Non, garder</button>
              <button className="btn-hover" style={{ ...s.btnPrimary, backgroundColor: '#EF4444' }} onClick={() => handleCancel(showCancelModal)}>
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Détails RDV ── */}
      {showDetailModal && (
        <div style={s.overlay} onClick={() => setShowDetailModal(null)}>
          <div style={{ ...s.modal, maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>📋 Détails du rendez-vous</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '14px' }}>
              <div style={{ ...s.apptAvatar(showDetailModal.color), width: '52px', height: '52px' }}>{showDetailModal.avatar}</div>
              <div>
                <div style={s.apptDoctor}>{showDetailModal.doctor}</div>
                <div style={s.apptSpec}>{showDetailModal.specialty}</div>
              </div>
            </div>
            {[
              { label: 'Date', val: showDetailModal.date },
              { label: 'Heure', val: showDetailModal.time },
              { label: 'Adresse', val: showDetailModal.address },
              { label: 'Type', val: showDetailModal.type },
              { label: 'Statut', val: STATUS_MAP[showDetailModal.status].label },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '14px' }}>
                <span style={{ color: '#94A3B8', fontWeight: '600' }}>{row.label}</span>
                <span style={{ color: '#0F172A', fontWeight: '500' }}>{row.val}</span>
              </div>
            ))}
            <div style={{ ...s.modalBtns, marginTop: '20px' }}>
              <button style={s.btnGhost} onClick={() => setShowDetailModal(null)}>Fermer</button>
              <button className="btn-hover" style={s.btnPrimary} onClick={() => { setShowDetailModal(null); navigate('/patient/messages'); }}>
                💬 Contacter le médecin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── STYLES ─── */
const s = {
  root: { fontFamily: "'DM Sans','Segoe UI',sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexShrink: 0 },
  navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', textDecoration: 'none', flexShrink: 0 },
  logoAccent: { color: '#F97316' },
  navLinks: { display: 'flex', gap: '2px', flex: 1 },
  navLink: (active) => ({ padding: '7px 13px', borderRadius: '8px', fontSize: '13.5px', fontWeight: active ? '700' : '500', color: active ? '#0D9488' : '#64748B', backgroundColor: active ? '#CCFBF1' : 'transparent', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s' }),
  navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  rdvBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 11px 5px 5px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#0D9488,#065F52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
  dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.10)', minWidth: '210px', zIndex: 300, overflow: 'hidden' },
  dropdownHeader: { padding: '14px 16px', borderBottom: '1px solid #F1F5F9' },
  dropdownName: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  dropdownEmail: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  dropdownItem: { padding: '11px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' },

  main: { flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '28px 32px', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  newBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '22px' },
  statCard: (color) => ({ backgroundColor: '#fff', borderRadius: '16px', padding: '18px 20px', border: '1.5px solid #E2E8F0', borderTop: `3px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '6px' }),
  statVal: (color) => ({ fontSize: '28px', fontWeight: '800', color, letterSpacing: '-1px' }),
  statLabel: { fontSize: '12px', color: '#64748B', fontWeight: '500' },

  tabs: { display: 'flex', gap: '6px', backgroundColor: '#fff', padding: '6px', borderRadius: '14px', marginBottom: '18px', width: 'fit-content', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
  tab: (active) => ({ padding: '8px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: active ? '700' : '500', color: active ? '#fff' : '#64748B', backgroundColor: active ? '#0D9488' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }),

  apptCard: (cancelled) => ({ backgroundColor: cancelled ? '#FFFBFB' : '#fff', borderRadius: '16px', padding: '18px 22px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px', border: cancelled ? '1.5px solid #FEE2E2' : '1.5px solid #E2E8F0' }),
  dateBlock: (color) => ({ backgroundColor: color + '12', borderRadius: '12px', padding: '10px 14px', textAlign: 'center', minWidth: '64px', flexShrink: 0 }),
  dateDay: (color) => ({ fontSize: '22px', fontWeight: '800', color, letterSpacing: '-1px' }),
  dateMonth: { fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2px' },
  divider: { width: '1px', height: '52px', backgroundColor: '#E2E8F0', flexShrink: 0 },
  apptAvatar: (color) => ({ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }),
  apptInfo: { flex: 1, minWidth: 0 },
  apptDoctor: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
  apptSpec: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  apptMeta: { display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' },
  metaTag: { fontSize: '12px', color: '#64748B' },
  typeChip: { fontSize: '11px', fontWeight: '600', color: '#0D9488', backgroundColor: '#CCFBF1', padding: '3px 10px', borderRadius: '20px' },
  statusChip: { fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' },
  actions: { display: 'flex', gap: '8px', flexShrink: 0 },
  btnPrimary: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnDanger: { backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '9px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnGhost: { backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '9px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#94A3B8' },

  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
  modal: { backgroundColor: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', margin: '0 16px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '22px' },
  formField: { marginBottom: '14px' },
  formLabel: { fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.4px' },
  formInput: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: '#0F172A' },
  formSelect: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#fff', fontFamily: 'inherit', color: '#0F172A' },
  modalBtns: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
};