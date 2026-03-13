import React, { useState } from 'react';

const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);

  const upcoming = [
    {
      id: 1,
      doctor: 'Dr. Amira Benali',
      specialty: 'Cardiologue',
      date: 'Lundi 17 Mars 2026',
      time: '09h30',
      wilaya: 'Alger',
      address: '12 Rue Didouche Mourad, Alger',
      avatar: 'AB',
      color: '#0EA5E9',
      type: 'Consultation',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: 'Dr. Karim Meziane',
      specialty: 'Généraliste',
      date: 'Jeudi 20 Mars 2026',
      time: '14h00',
      wilaya: 'Alger',
      address: '5 Bd Krim Belkacem, Alger',
      avatar: 'KM',
      color: '#10B981',
      type: 'Suivi',
      status: 'pending',
    },
  ];

  const past = [
    {
      id: 3,
      doctor: 'Dr. Sonia Hadj',
      specialty: 'Dermatologue',
      date: '5 Février 2026',
      time: '10h00',
      wilaya: 'Alger',
      address: '8 Rue Ben Mehidi, Alger',
      avatar: 'SH',
      color: '#8B5CF6',
      type: 'Consultation',
      status: 'done',
    },
    {
      id: 4,
      doctor: 'Dr. Yacine Bouali',
      specialty: 'Pédiatre',
      date: '14 Janvier 2026',
      time: '11h30',
      wilaya: 'Alger',
      address: '3 Rue Hassiba Ben Bouali',
      avatar: 'YB',
      color: '#F59E0B',
      type: 'Urgence',
      status: 'done',
    },
    {
      id: 5,
      doctor: 'Dr. Amira Benali',
      specialty: 'Cardiologue',
      date: '2 Décembre 2025',
      time: '09h00',
      wilaya: 'Alger',
      address: '12 Rue Didouche Mourad',
      avatar: 'AB',
      color: '#0EA5E9',
      type: 'Contrôle',
      status: 'done',
    },
  ];

  const styles = {
    root: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      backgroundColor: '#F0F4F8',
      minHeight: '100vh',
      display: 'flex',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
    },
    logo: {
      padding: '28px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    logoText: { fontSize: '26px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' },
    logoAccent: { color: '#38BDF8' },
    logoSub: {
      fontSize: '11px', color: 'rgba(255,255,255,0.4)',
      marginTop: '2px', letterSpacing: '0.5px', textTransform: 'uppercase',
    },
    nav: { padding: '16px 12px', flex: 1 },
    navSection: {
      fontSize: '10px', color: 'rgba(255,255,255,0.3)',
      letterSpacing: '1.5px', textTransform: 'uppercase', padding: '12px 12px 8px',
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '2px',
      backgroundColor: active ? 'rgba(56,189,248,0.15)' : 'transparent',
      color: active ? '#38BDF8' : 'rgba(255,255,255,0.6)',
      fontSize: '14px', fontWeight: active ? '600' : '400',
      border: active ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
    }),
    userCard: {
      margin: '12px', padding: '14px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
    },
    userAvatar: {
      width: '36px', height: '36px', borderRadius: '50%',
      backgroundColor: '#38BDF8', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#0F172A',
    },
    main: { marginLeft: '260px', flex: 1, padding: '32px' },
    pageHeader: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '28px',
    },
    pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
    pageSub: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
    newRdvBtn: {
      backgroundColor: '#0EA5E9', color: '#fff', border: 'none',
      borderRadius: '10px', padding: '10px 20px', fontSize: '13px',
      fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
    },
    statsRow: {
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '14px', marginBottom: '24px',
    },
    statCard: (color) => ({
      backgroundColor: '#fff', borderRadius: '14px', padding: '18px',
      borderTop: `3px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }),
    statNum: (color) => ({ fontSize: '28px', fontWeight: '800', color }),
    statLabel: { fontSize: '12px', color: '#64748B', marginTop: '2px' },
    tabs: {
      display: 'flex', gap: '4px', backgroundColor: '#fff',
      padding: '6px', borderRadius: '14px', marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', width: 'fit-content',
    },
    tab: (active) => ({
      padding: '8px 20px', borderRadius: '10px', cursor: 'pointer',
      fontSize: '13px', fontWeight: active ? '600' : '400',
      color: active ? '#fff' : '#64748B',
      backgroundColor: active ? '#0EA5E9' : 'transparent',
      border: 'none', transition: 'all 0.2s',
    }),
    apptCard: {
      backgroundColor: '#fff', borderRadius: '16px', padding: '20px',
      marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', gap: '16px',
      border: '1px solid #E2E8F0',
    },
    dateBlock: (color) => ({
      backgroundColor: color + '15', borderRadius: '12px',
      padding: '12px 16px', textAlign: 'center', minWidth: '70px', flexShrink: 0,
    }),
    dateDay: (color) => ({ fontSize: '24px', fontWeight: '800', color, letterSpacing: '-1px' }),
    dateMonth: { fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' },
    divider: { width: '1px', height: '60px', backgroundColor: '#E2E8F0', flexShrink: 0 },
    apptAvatar: (color) => ({
      width: '48px', height: '48px', borderRadius: '12px',
      backgroundColor: color + '20', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', fontWeight: '700', flexShrink: 0,
    }),
    apptInfo: { flex: 1 },
    apptDoctor: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
    apptSpec: { fontSize: '13px', color: '#64748B', marginTop: '2px' },
    apptMeta: { display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' },
    metaItem: {
      fontSize: '12px', color: '#64748B',
      display: 'flex', alignItems: 'center', gap: '4px',
    },
    statusBadge: (status) => {
      const map = {
        confirmed: { bg: '#DCFCE7', color: '#16A34A', label: '✅ Confirmé' },
        pending: { bg: '#FEF3C7', color: '#D97706', label: '⏳ En attente' },
        done: { bg: '#F1F5F9', color: '#64748B', label: '✔ Terminé' },
      };
      const s = map[status];
      return {
        style: { backgroundColor: s.bg, color: s.color, fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px' },
        label: s.label,
      };
    },
    typeBadge: (type) => ({
      fontSize: '11px', fontWeight: '600', color: '#0EA5E9',
      backgroundColor: '#E0F2FE', padding: '4px 10px', borderRadius: '20px',
    }),
    actions: { display: 'flex', gap: '8px', flexShrink: 0 },
    actionBtn: (primary) => ({
      padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
      cursor: 'pointer', border: 'none',
      backgroundColor: primary ? '#0EA5E9' : '#F1F5F9',
      color: primary ? '#fff' : '#64748B',
    }),
    modal: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    },
    modalBox: {
      backgroundColor: '#fff', borderRadius: '20px', padding: '32px',
      width: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
    modalTitle: { fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' },
    formField: { marginBottom: '14px' },
    formLabel: { fontSize: '12px', fontWeight: '600', color: '#64748B', marginBottom: '6px', display: 'block' },
    formInput: {
      width: '100%', padding: '10px 14px', borderRadius: '10px',
      border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none',
      boxSizing: 'border-box',
    },
    formSelect: {
      width: '100%', padding: '10px 14px', borderRadius: '10px',
      border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none',
      boxSizing: 'border-box', backgroundColor: '#fff',
    },
    modalBtns: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  };

  const navItems = [
    { id: 'accueil', icon: '🏠', label: 'Accueil' },
    { id: 'rdv', icon: '📅', label: 'Mes rendez-vous' },
    { id: 'medecins', icon: '👨‍⚕️', label: 'Mes médecins' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'profil', icon: '👤', label: 'Mon profil' },
  ];

  const parseDate = (dateStr) => {
    const parts = dateStr.split(' ');
    return { day: parts[1], month: parts[2]?.substring(0, 3) };
  };

  const list = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>Frey<span style={styles.logoAccent}>a</span></div>
          <div style={styles.logoSub}>Plateforme médicale Algérie</div>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navSection}>Navigation</div>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navItem(item.id === 'rdv')}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={styles.userCard}>
          <div style={styles.userAvatar}>SA</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Sara Amine</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Patient</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.pageTitle}>Mes Rendez-vous</div>
            <div style={styles.pageSub}>Gérez tous vos rendez-vous médicaux</div>
          </div>
          <button style={styles.newRdvBtn} onClick={() => setShowModal(true)}>
            ＋ Nouveau RDV
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard('#0EA5E9')}>
            <div style={styles.statNum('#0EA5E9')}>2</div>
            <div style={styles.statLabel}>À venir</div>
          </div>
          <div style={styles.statCard('#10B981')}>
            <div style={styles.statNum('#10B981')}>1</div>
            <div style={styles.statLabel}>Confirmés</div>
          </div>
          <div style={styles.statCard('#F59E0B')}>
            <div style={styles.statNum('#F59E0B')}>1</div>
            <div style={styles.statLabel}>En attente</div>
          </div>
          <div style={styles.statCard('#64748B')}>
            <div style={styles.statNum('#64748B')}>3</div>
            <div style={styles.statLabel}>Passés</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={styles.tab(activeTab === 'upcoming')} onClick={() => setActiveTab('upcoming')}>
            📅 À venir ({upcoming.length})
          </button>
          <button style={styles.tab(activeTab === 'past')} onClick={() => setActiveTab('past')}>
            ✔ Passés ({past.length})
          </button>
        </div>

        {/* List */}
        {list.map((appt) => {
          const { day, month } = parseDate(appt.date);
          const status = styles.statusBadge(appt.status);
          return (
            <div key={appt.id} style={styles.apptCard}>
              <div style={styles.dateBlock(appt.color)}>
                <div style={styles.dateDay(appt.color)}>{day}</div>
                <div style={styles.dateMonth}>{month}</div>
              </div>
              <div style={styles.divider} />
              <div style={styles.apptAvatar(appt.color)}>{appt.avatar}</div>
              <div style={styles.apptInfo}>
                <div style={styles.apptDoctor}>{appt.doctor}</div>
                <div style={styles.apptSpec}>{appt.specialty}</div>
                <div style={styles.apptMeta}>
                  <span style={styles.metaItem}>⏰ {appt.time}</span>
                  <span style={styles.metaItem}>📍 {appt.address}</span>
                  <span style={styles.typeBadge(appt.type)}>{appt.type}</span>
                  <span style={status.style}>{status.label}</span>
                </div>
              </div>
              <div style={styles.actions}>
                {appt.status !== 'done' && (
                  <>
                    <button style={styles.actionBtn(true)}>Détails</button>
                    <button style={styles.actionBtn(false)}>Annuler</button>
                  </>
                )}
                {appt.status === 'done' && (
                  <button style={styles.actionBtn(true)}>🔄 Reprendre RDV</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau RDV */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>📅 Nouveau Rendez-vous</div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Spécialité</label>
              <select style={styles.formSelect}>
                <option>Généraliste</option>
                <option>Cardiologue</option>
                <option>Dermatologue</option>
                <option>Pédiatre</option>
                <option>Ophtalmologue</option>
                <option>Gynécologue</option>
              </select>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Wilaya</label>
              <select style={styles.formSelect}>
                <option>Alger</option>
                <option>Oran</option>
                <option>Constantine</option>
                <option>Annaba</option>
                <option>Blida</option>
                <option>Bordj Bou Arréridj</option>
              </select>
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Date souhaitée</label>
              <input type="date" style={styles.formInput} />
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel}>Type de consultation</label>
              <select style={styles.formSelect}>
                <option>Consultation</option>
                <option>Suivi</option>
                <option>Urgence</option>
                <option>Contrôle</option>
              </select>
            </div>
            <div style={styles.modalBtns}>
              <button style={styles.actionBtn(false)} onClick={() => setShowModal(false)}>Annuler</button>
              <button style={styles.actionBtn(true)} onClick={() => setShowModal(false)}>Rechercher →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;