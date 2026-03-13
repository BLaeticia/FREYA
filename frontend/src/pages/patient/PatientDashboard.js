import React, { useState } from 'react';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('accueil');

  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Amira Benali',
      specialty: 'Cardiologue',
      date: 'Lundi 17 Mars',
      time: '09h30',
      status: 'upcoming',
      wilaya: 'Alger',
      avatar: 'AB',
      color: '#0EA5E9',
    },
    {
      id: 2,
      doctor: 'Dr. Karim Meziane',
      specialty: 'Généraliste',
      date: 'Jeudi 20 Mars',
      time: '14h00',
      status: 'upcoming',
      wilaya: 'Alger',
      avatar: 'KM',
      color: '#10B981',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: 'Dr. Sonia Hadj',
      specialty: 'Dermatologue',
      date: '5 Février 2026',
      time: '10h00',
      status: 'past',
      avatar: 'SH',
      color: '#8B5CF6',
    },
  ];

  const doctors = [
    { name: 'Dr. Amira Benali', specialty: 'Cardiologue', rating: 4.9, reviews: 128, avatar: 'AB', color: '#0EA5E9', available: true },
    { name: 'Dr. Karim Meziane', specialty: 'Généraliste', rating: 4.7, reviews: 245, avatar: 'KM', color: '#10B981', available: true },
    { name: 'Dr. Sonia Hadj', specialty: 'Dermatologue', rating: 4.8, reviews: 89, avatar: 'SH', color: '#8B5CF6', available: false },
    { name: 'Dr. Yacine Bouali', specialty: 'Pédiatre', rating: 4.9, reviews: 312, avatar: 'YB', color: '#F59E0B', available: true },
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
      padding: '0',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: 100,
    },
    logo: {
      padding: '28px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    logoText: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#fff',
      letterSpacing: '-0.5px',
    },
    logoAccent: {
      color: '#38BDF8',
    },
    logoSub: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.4)',
      marginTop: '2px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    nav: {
      padding: '16px 12px',
      flex: 1,
    },
    navSection: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.3)',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      padding: '12px 12px 8px',
    },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '10px',
      cursor: 'pointer',
      marginBottom: '2px',
      backgroundColor: active ? 'rgba(56,189,248,0.15)' : 'transparent',
      color: active ? '#38BDF8' : 'rgba(255,255,255,0.6)',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s',
      border: active ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
    }),
    navIcon: {
      fontSize: '18px',
      width: '20px',
      textAlign: 'center',
    },
    userCard: {
      margin: '12px',
      padding: '14px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    userAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#38BDF8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '700',
      color: '#0F172A',
    },
    userName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#fff',
    },
    userRole: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.4)',
    },
    main: {
      marginLeft: '260px',
      flex: 1,
      padding: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    greeting: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#0F172A',
      letterSpacing: '-0.5px',
    },
    greetingSub: {
      fontSize: '14px',
      color: '#64748B',
      marginTop: '4px',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#fff',
      border: '1.5px solid #E2E8F0',
      borderRadius: '12px',
      padding: '10px 16px',
      width: '280px',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      color: '#0F172A',
      width: '100%',
      backgroundColor: 'transparent',
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '28px',
    },
    statCard: (color) => ({
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '20px',
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }),
    statNumber: (color) => ({
      fontSize: '32px',
      fontWeight: '800',
      color: color,
      letterSpacing: '-1px',
    }),
    statLabel: {
      fontSize: '13px',
      color: '#64748B',
      marginTop: '4px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: '20px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewAll: {
      fontSize: '12px',
      color: '#38BDF8',
      cursor: 'pointer',
      fontWeight: '500',
    },
    appointmentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '14px',
      borderRadius: '12px',
      backgroundColor: '#F8FAFC',
      marginBottom: '10px',
      border: '1px solid #E2E8F0',
    },
    apptAvatar: (color) => ({
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      backgroundColor: color + '20',
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: '700',
      flexShrink: 0,
    }),
    apptInfo: {
      flex: 1,
    },
    apptDoctor: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#0F172A',
    },
    apptSpecialty: {
      fontSize: '12px',
      color: '#64748B',
      marginTop: '2px',
    },
    apptBadge: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    },
    apptDate: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#0EA5E9',
      backgroundColor: '#E0F2FE',
      padding: '3px 8px',
      borderRadius: '6px',
    },
    apptTime: {
      fontSize: '11px',
      color: '#64748B',
    },
    doctorItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      cursor: 'pointer',
      marginBottom: '8px',
      border: '1px solid #E2E8F0',
      transition: 'all 0.2s',
    },
    doctorAvatar: (color) => ({
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: color + '20',
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: '700',
      flexShrink: 0,
    }),
    doctorName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#0F172A',
    },
    doctorSpec: {
      fontSize: '11px',
      color: '#64748B',
    },
    availableBadge: (available) => ({
      fontSize: '10px',
      padding: '2px 8px',
      borderRadius: '20px',
      fontWeight: '600',
      backgroundColor: available ? '#DCFCE7' : '#FEE2E2',
      color: available ? '#16A34A' : '#DC2626',
      marginLeft: 'auto',
    }),
    rdvBtn: {
      backgroundColor: '#0EA5E9',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 20px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    notifDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#EF4444',
      borderRadius: '50%',
      display: 'inline-block',
      marginLeft: '6px',
    },
  };

  const navItems = [
    { id: 'accueil', icon: '🏠', label: 'Accueil' },
    { id: 'rdv', icon: '📅', label: 'Mes rendez-vous' },
    { id: 'medecins', icon: '👨‍⚕️', label: 'Mes médecins' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'profil', icon: '👤', label: 'Mon profil' },
  ];

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>
            Frey<span style={styles.logoAccent}>a</span>
          </div>
          <div style={styles.logoSub}>Plateforme médicale Algérie</div>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navSection}>Navigation</div>
          {navItems.map((item) => (
            <div
              key={item.id}
              style={styles.navItem(activeTab === item.id)}
              onClick={() => setActiveTab(item.id)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
              {item.id === 'messages' && <span style={styles.notifDot} />}
            </div>
          ))}
        </nav>

        <div style={styles.userCard}>
          <div style={styles.userAvatar}>SA</div>
          <div>
            <div style={styles.userName}>Sara Amine</div>
            <div style={styles.userRole}>Patient</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <div style={styles.greeting}>Bonjour, Sara 👋</div>
            <div style={styles.greetingSub}>Jeudi 12 Mars 2026 · Alger</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input style={styles.searchInput} placeholder="Chercher un médecin, spécialité..." />
            </div>
            <button style={styles.rdvBtn}>
              <span>＋</span> Prendre RDV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard('#0EA5E9')}>
            <div style={styles.statNumber('#0EA5E9')}>2</div>
            <div style={styles.statLabel}>Rendez-vous à venir</div>
          </div>
          <div style={styles.statCard('#10B981')}>
            <div style={styles.statNumber('#10B981')}>5</div>
            <div style={styles.statLabel}>Médecins consultés</div>
          </div>
          <div style={styles.statCard('#8B5CF6')}>
            <div style={styles.statNumber('#8B5CF6')}>3</div>
            <div style={styles.statLabel}>Documents médicaux</div>
          </div>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {/* Appointments */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>📅 Prochains rendez-vous</span>
              <span style={styles.viewAll}>Voir tout →</span>
            </div>
            {appointments.map((appt) => (
              <div key={appt.id} style={styles.appointmentItem}>
                <div style={styles.apptAvatar(appt.color)}>{appt.avatar}</div>
                <div style={styles.apptInfo}>
                  <div style={styles.apptDoctor}>{appt.doctor}</div>
                  <div style={styles.apptSpecialty}>{appt.specialty} · {appt.wilaya}</div>
                </div>
                <div style={styles.apptBadge}>
                  <span style={styles.apptDate}>{appt.date}</span>
                  <span style={styles.apptTime}>⏰ {appt.time}</span>
                </div>
              </div>
            ))}

            <div style={{ ...styles.cardTitle, marginTop: '20px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#64748B' }}>Passés</span>
            </div>
            {pastAppointments.map((appt) => (
              <div key={appt.id} style={{ ...styles.appointmentItem, opacity: 0.6 }}>
                <div style={styles.apptAvatar(appt.color)}>{appt.avatar}</div>
                <div style={styles.apptInfo}>
                  <div style={styles.apptDoctor}>{appt.doctor}</div>
                  <div style={styles.apptSpecialty}>{appt.specialty}</div>
                </div>
                <div style={styles.apptBadge}>
                  <span style={{ ...styles.apptDate, backgroundColor: '#F1F5F9', color: '#64748B' }}>{appt.date}</span>
                  <span style={styles.apptTime}>⏰ {appt.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Doctors */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>👨‍⚕️ Mes médecins</span>
              <span style={styles.viewAll}>Voir tout →</span>
            </div>
            {doctors.map((doc, i) => (
              <div key={i} style={styles.doctorItem}>
                <div style={styles.doctorAvatar(doc.color)}>{doc.avatar}</div>
                <div>
                  <div style={styles.doctorName}>{doc.name}</div>
                  <div style={styles.doctorSpec}>{doc.specialty} · ⭐ {doc.rating}</div>
                </div>
                <span style={styles.availableBadge(doc.available)}>
                  {doc.available ? 'Disponible' : 'Indispo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;