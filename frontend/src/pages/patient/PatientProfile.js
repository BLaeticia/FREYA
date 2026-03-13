import React, { useState } from 'react';

const PatientProfile = () => {
  const [activeSection, setActiveSection] = useState('infos');
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    nom: 'Amine',
    prenom: 'Sara',
    email: 'patient@freya.dz',
    phone: '0555 123 456',
    dob: '15/06/1995',
    gender: 'Femme',
    wilaya: 'Alger',
    address: '12 Rue Didouche Mourad, Alger Centre',
    bloodType: 'A+',
    weight: '62',
    height: '165',
    allergies: 'Pénicilline',
    antecedents: 'Hypertension légère',
  });

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
    logoAccent: { color: '#38BDF8' },
    logoSub: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.4)',
      marginTop: '2px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    nav: { padding: '16px 12px', flex: 1 },
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
      border: active ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
    }),
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
    main: { marginLeft: '260px', flex: 1, padding: '32px' },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
    },
    pageTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#0F172A',
      letterSpacing: '-0.5px',
    },
    pageSub: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
    editBtn: {
      backgroundColor: editing ? '#10B981' : '#0EA5E9',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '10px 20px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    profileHero: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
    },
    heroBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
    },
    avatarLarge: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      backgroundColor: '#0EA5E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: '800',
      color: '#fff',
      border: '4px solid #fff',
      boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
      position: 'relative',
      zIndex: 1,
      marginTop: '20px',
      flexShrink: 0,
    },
    heroInfo: { position: 'relative', zIndex: 1, marginTop: '20px' },
    heroName: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#0F172A',
      letterSpacing: '-0.5px',
    },
    heroSub: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
    heroBadges: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      flexWrap: 'wrap',
    },
    badge: (color, bg) => ({
      fontSize: '12px',
      fontWeight: '600',
      color: color,
      backgroundColor: bg,
      padding: '4px 10px',
      borderRadius: '20px',
    }),
    tabs: {
      display: 'flex',
      gap: '4px',
      backgroundColor: '#fff',
      padding: '6px',
      borderRadius: '14px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      width: 'fit-content',
    },
    tab: (active) => ({
      padding: '8px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: active ? '600' : '400',
      color: active ? '#fff' : '#64748B',
      backgroundColor: active ? '#0EA5E9' : 'transparent',
      border: 'none',
      transition: 'all 0.2s',
    }),
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#0F172A',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    fieldRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px',
      marginBottom: '14px',
    },
    field: { display: 'flex', flexDirection: 'column', gap: '4px' },
    fieldLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#94A3B8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    fieldValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
      padding: '8px 12px',
      backgroundColor: '#F8FAFC',
      borderRadius: '8px',
      border: '1.5px solid #E2E8F0',
    },
    fieldInput: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0F172A',
      padding: '8px 12px',
      backgroundColor: '#EFF6FF',
      borderRadius: '8px',
      border: '1.5px solid #93C5FD',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    },
    vitalCard: (color, bg) => ({
      backgroundColor: bg,
      borderRadius: '14px',
      padding: '16px',
      textAlign: 'center',
      border: `1.5px solid ${color}30`,
    }),
    vitalValue: (color) => ({
      fontSize: '28px',
      fontWeight: '800',
      color: color,
      letterSpacing: '-1px',
    }),
    vitalLabel: {
      fontSize: '12px',
      color: '#64748B',
      marginTop: '2px',
    },
    alertCard: (color, bg) => ({
      backgroundColor: bg,
      border: `1.5px solid ${color}40`,
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }),
    alertText: (color) => ({
      fontSize: '13px',
      fontWeight: '600',
      color: color,
    }),
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
          <div style={styles.logoText}>Frey<span style={styles.logoAccent}>a</span></div>
          <div style={styles.logoSub}>Plateforme médicale Algérie</div>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navSection}>Navigation</div>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navItem(item.id === 'profil')}>
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
            <div style={styles.pageTitle}>Mon Profil</div>
            <div style={styles.pageSub}>Gérez vos informations personnelles et médicales</div>
          </div>
          <button style={styles.editBtn} onClick={() => setEditing(!editing)}>
            {editing ? '✅ Sauvegarder' : '✏️ Modifier'}
          </button>
        </div>

        {/* Hero */}
        <div style={styles.profileHero}>
          <div style={styles.heroBg} />
          <div style={styles.avatarLarge}>SA</div>
          <div style={styles.heroInfo}>
            <div style={styles.heroName}>{profile.prenom} {profile.nom}</div>
            <div style={styles.heroSub}>{profile.email} · {profile.phone}</div>
            <div style={styles.heroBadges}>
              <span style={styles.badge('#0EA5E9', '#E0F2FE')}>🩸 {profile.bloodType}</span>
              <span style={styles.badge('#10B981', '#DCFCE7')}>📍 {profile.wilaya}</span>
              <span style={styles.badge('#8B5CF6', '#EDE9FE')}>👤 {profile.gender}</span>
              <span style={styles.badge('#F59E0B', '#FEF3C7')}>🎂 {profile.dob}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { id: 'infos', label: '👤 Informations' },
            { id: 'medical', label: '🏥 Médical' },
            { id: 'securite', label: '🔒 Sécurité' },
          ].map((tab) => (
            <button
              key={tab.id}
              style={styles.tab(activeSection === tab.id)}
              onClick={() => setActiveSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Infos Tab */}
        {activeSection === 'infos' && (
          <div style={styles.grid2}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>👤 Informations personnelles</div>
              <div style={styles.fieldRow}>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Prénom</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.prenom} onChange={e => setProfile({...profile, prenom: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.prenom}</div>
                  }
                </div>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Nom</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.nom} onChange={e => setProfile({...profile, nom: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.nom}</div>
                  }
                </div>
              </div>
              <div style={styles.fieldRow}>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Date de naissance</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.dob}</div>
                  }
                </div>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Genre</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.gender}</div>
                  }
                </div>
              </div>
              <div style={{...styles.field, marginBottom: '14px'}}>
                <span style={styles.fieldLabel}>Adresse</span>
                {editing
                  ? <input style={styles.fieldInput} value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                  : <div style={styles.fieldValue}>{profile.address}</div>
                }
              </div>
              <div style={styles.fieldRow}>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Wilaya</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.wilaya} onChange={e => setProfile({...profile, wilaya: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.wilaya}</div>
                  }
                </div>
                <div style={styles.field}>
                  <span style={styles.fieldLabel}>Téléphone</span>
                  {editing
                    ? <input style={styles.fieldInput} value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                    : <div style={styles.fieldValue}>{profile.phone}</div>
                  }
                </div>
              </div>
            </div>

            <div>
              {/* Vitals */}
              <div style={{...styles.card, marginBottom: '20px'}}>
                <div style={styles.cardTitle}>⚕️ Données vitales</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={styles.vitalCard('#EF4444', '#FFF1F2')}>
                    <div style={styles.vitalValue('#EF4444')}>{profile.bloodType}</div>
                    <div style={styles.vitalLabel}>Groupe sanguin</div>
                  </div>
                  <div style={styles.vitalCard('#0EA5E9', '#EFF6FF')}>
                    <div style={styles.vitalValue('#0EA5E9')}>{profile.weight}<span style={{fontSize:'14px'}}>kg</span></div>
                    <div style={styles.vitalLabel}>Poids</div>
                  </div>
                  <div style={styles.vitalCard('#10B981', '#F0FDF4')}>
                    <div style={styles.vitalValue('#10B981')}>{profile.height}<span style={{fontSize:'14px'}}>cm</span></div>
                    <div style={styles.vitalLabel}>Taille</div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div style={styles.card}>
                <div style={styles.cardTitle}>⚠️ Alertes médicales</div>
                <div style={styles.alertCard('#EF4444', '#FFF1F2')}>
                  <span>💊</span>
                  <div>
                    <div style={styles.alertText('#EF4444')}>Allergie médicamenteuse</div>
                    <div style={{fontSize:'12px', color:'#64748B'}}>{profile.allergies}</div>
                  </div>
                </div>
                <div style={styles.alertCard('#F59E0B', '#FFFBEB')}>
                  <span>📋</span>
                  <div>
                    <div style={styles.alertText('#D97706')}>Antécédents</div>
                    <div style={{fontSize:'12px', color:'#64748B'}}>{profile.antecedents}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Tab */}
        {activeSection === 'medical' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏥 Dossier médical</div>
            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Allergies</span>
                {editing
                  ? <input style={styles.fieldInput} value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} />
                  : <div style={styles.fieldValue}>{profile.allergies}</div>
                }
              </div>
              <div style={styles.field}>
                <span style={styles.fieldLabel}>Antécédents médicaux</span>
                {editing
                  ? <input style={styles.fieldInput} value={profile.antecedents} onChange={e => setProfile({...profile, antecedents: e.target.value})} />
                  : <div style={styles.fieldValue}>{profile.antecedents}</div>
                }
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeSection === 'securite' && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔒 Sécurité du compte</div>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Email</span>
              <div style={styles.fieldValue}>{profile.email}</div>
            </div>
            <div style={{marginTop: '16px'}}>
              <button style={{...styles.editBtn, backgroundColor: '#64748B'}}>
                🔑 Changer le mot de passe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;