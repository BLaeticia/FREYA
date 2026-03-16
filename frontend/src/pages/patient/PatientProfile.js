import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function PatientProfile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('infos');
  const [editing, setEditing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [profile, setProfile] = useState({
    prenom: user?.first_name || 'Sara',
    nom: user?.last_name || 'Amine',
    email: user?.email || 'patient@freya.dz',
    phone: user?.phone || '0555 123 456',
    dob: '15/06/1995',
    gender: 'Femme',
    wilaya: 'Alger',
    address: '12 Rue Didouche Mourad, Alger Centre',
    bloodType: 'A+',
    weight: '62',
    height: '165',
    allergies: 'Pénicilline',
    antecedents: 'Hypertension légère',
    mutuelle: 'CNAS',
  });

  const initials = `${profile.prenom?.[0] || 'P'}${profile.nom?.[0] || ''}`.toUpperCase();

  const handleSave = () => {
    setEditing(false);
    toast.success('Profil mis à jour !');
  };

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  const Field = ({ label, field, type = 'text', options }) => (
    <div style={s.field}>
      <span style={s.fieldLabel}>{label}</span>
      {editing ? (
        options ? (
          <select style={s.fieldInput} value={profile[field]} onChange={e => setProfile({ ...profile, [field]: e.target.value })}>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            style={s.fieldInput}
            value={profile[field]}
            onChange={e => setProfile({ ...profile, [field]: e.target.value })}
          />
        )
      ) : (
        <div style={s.fieldValue}>{profile[field] || '—'}</div>
      )}
    </div>
  );

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .nav-link:hover { background-color: #F1F5F9 !important; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        .tab-btn:hover { background-color: #F1F5F9 !important; color: #0F172A !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.22s ease; }
        input:focus, select:focus { border-color: #0D9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className="nav-link" style={s.navLink(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <button style={s.rdvBtn} onClick={() => navigate('/doctors')}>+ Prendre RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={s.userName}>{profile.prenom}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={s.dropdownHeader}>
                    <div style={s.dropdownName}>{profile.prenom} {profile.nom}</div>
                    <div style={s.dropdownEmail}>{profile.email}</div>
                  </div>
                  {[
                    { icon: '📅', label: 'Mes rendez-vous', path: '/patient/appointments' },
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
            <h1 style={s.pageTitle}>👤 Mon Profil</h1>
            <p style={s.pageSubtitle}>Gérez vos informations personnelles et médicales</p>
          </div>
          <button
            style={editing ? s.saveBtn : s.editBtn}
            onClick={editing ? handleSave : () => setEditing(true)}
          >
            {editing ? '✅ Sauvegarder' : '✏️ Modifier'}
          </button>
        </div>

        {/* Hero Banner */}
        <div style={s.hero}>
          <div style={s.heroBg} />
          <div style={s.heroContent}>
            <div style={s.heroAvatar}>
              {initials}
              {editing && (
                <div style={s.avatarEditOverlay}>📷</div>
              )}
            </div>
            <div style={s.heroInfo}>
              <div style={s.heroName}>{profile.prenom} {profile.nom}</div>
              <div style={s.heroSub}>{profile.email} · {profile.phone}</div>
              <div style={s.heroBadges}>
                <span style={s.badge('#EF4444', '#FEE2E2')}>🩸 {profile.bloodType}</span>
                <span style={s.badge('#0D9488', '#CCFBF1')}>📍 {profile.wilaya}</span>
                <span style={s.badge('#7C3AED', '#EDE9FE')}>👤 {profile.gender}</span>
                <span style={s.badge('#D97706', '#FEF3C7')}>🎂 {profile.dob}</span>
                <span style={s.badge('#2563EB', '#DBEAFE')}>🏥 {profile.mutuelle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {[
            { id: 'infos', label: '👤 Informations' },
            { id: 'medical', label: '🏥 Médical' },
            { id: 'securite', label: '🔒 Sécurité' },
          ].map(tab => (
            <button
              key={tab.id}
              className="tab-btn"
              style={s.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Informations ── */}
        {activeTab === 'infos' && (
          <div className="fade-up" style={s.grid2}>
            {/* Infos personnelles */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>👤 Informations personnelles</h3>
              <div style={s.fieldGrid}>
                <Field label="Prénom" field="prenom" />
                <Field label="Nom" field="nom" />
                <Field label="Date de naissance" field="dob" />
                <Field label="Genre" field="gender" options={['Homme', 'Femme']} />
                <Field label="Téléphone" field="phone" type="tel" />
                <Field label="Wilaya" field="wilaya" options={['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tizi Ouzou', 'Sétif', 'Batna']} />
              </div>
              <div style={{ marginTop: '14px' }}>
                <Field label="Adresse complète" field="address" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Vitals */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>⚕️ Données vitales</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { val: profile.bloodType, label: 'Groupe sanguin', color: '#EF4444', bg: '#FEF2F2', unit: '' },
                    { val: profile.weight, label: 'Poids', color: '#0D9488', bg: '#F0FDF9', unit: 'kg' },
                    { val: profile.height, label: 'Taille', color: '#2563EB', bg: '#EFF6FF', unit: 'cm' },
                  ].map((v, i) => (
                    <div key={i} style={{ backgroundColor: v.bg, borderRadius: '12px', padding: '14px', textAlign: 'center', border: `1.5px solid ${v.color}20` }}>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: v.color, letterSpacing: '-0.5px' }}>
                        {v.val}<span style={{ fontSize: '12px' }}>{v.unit}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>{v.label}</div>
                    </div>
                  ))}
                </div>
                {editing && (
                  <div style={s.fieldGrid}>
                    <Field label="Poids (kg)" field="weight" type="number" />
                    <Field label="Taille (cm)" field="height" type="number" />
                  </div>
                )}
              </div>

              {/* Alertes */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>⚠️ Alertes médicales</h3>
                <div style={s.alertCard('#EF4444', '#FEF2F2')}>
                  <span style={{ fontSize: '20px' }}>💊</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>Allergie médicamenteuse</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{profile.allergies}</div>
                  </div>
                </div>
                <div style={s.alertCard('#D97706', '#FFFBEB')}>
                  <span style={{ fontSize: '20px' }}>📋</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#D97706' }}>Antécédents</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{profile.antecedents}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Médical ── */}
        {activeTab === 'medical' && (
          <div className="fade-up" style={s.card}>
            <h3 style={s.cardTitle}>🏥 Informations médicales</h3>
            <div style={s.fieldGrid}>
              <Field label="Groupe sanguin" field="bloodType" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
              <Field label="Mutuelle / Assurance" field="mutuelle" options={['CNAS', 'CASNOS', 'Privée', 'Aucune']} />
              <Field label="Poids (kg)" field="weight" type="number" />
              <Field label="Taille (cm)" field="height" type="number" />
            </div>
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Field label="Allergies connues" field="allergies" />
              <Field label="Antécédents médicaux" field="antecedents" />
            </div>
            {!editing && (
              <div style={{ marginTop: '20px', padding: '14px', backgroundColor: '#F0FDF9', borderRadius: '12px', border: '1.5px solid #CCFBF1' }}>
                <p style={{ fontSize: '13px', color: '#0D9488', fontWeight: '600' }}>
                  💡 Pour mettre à jour vos informations médicales, cliquez sur <strong>Modifier</strong> en haut à droite.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Sécurité ── */}
        {activeTab === 'securite' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={s.card}>
              <h3 style={s.cardTitle}>📧 Informations de connexion</h3>
              <div style={s.fieldGrid}>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Adresse email</span>
                  <div style={s.fieldValue}>{profile.email}</div>
                </div>
                <div style={s.field}>
                  <span style={s.fieldLabel}>Mot de passe</span>
                  <div style={s.fieldValue}>••••••••••</div>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <h3 style={s.cardTitle}>🔑 Changer le mot de passe</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
                {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le nouveau mot de passe'].map((label, i) => (
                  <div key={i} style={s.field}>
                    <span style={s.fieldLabel}>{label}</span>
                    <input type="password" placeholder="••••••••" style={s.fieldInput} />
                  </div>
                ))}
                <button
                  style={s.saveBtn}
                  onClick={() => toast.success('Mot de passe modifié !')}
                >
                  🔒 Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            <div style={{ ...s.card, border: '1.5px solid #FEE2E2' }}>
              <h3 style={{ ...s.cardTitle, color: '#EF4444' }}>⚠️ Zone de danger</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
              </p>
              <button
                style={{ backgroundColor: '#FEF2F2', color: '#EF4444', border: '1.5px solid #FEE2E2', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => toast.error('Contactez le support pour supprimer votre compte.')}
              >
                🗑️ Supprimer mon compte
              </button>
            </div>
          </div>
        )}
      </div>
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
  navLink: () => ({ padding: '7px 13px', borderRadius: '8px', fontSize: '13.5px', fontWeight: '500', color: '#64748B', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s' }),
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
  editBtn: { background: '#fff', border: '1.5px solid #0D9488', color: '#0D9488', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  saveBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  hero: { backgroundColor: '#fff', borderRadius: '18px', border: '1.5px solid #E2E8F0', marginBottom: '20px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  heroBg: { height: '80px', background: 'linear-gradient(135deg,#0D9488,#2DD4BF)' },
  heroContent: { display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 28px 24px', marginTop: '-40px' },
  heroAvatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#0D9488,#065F52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#fff', border: '4px solid #fff', boxShadow: '0 4px 14px rgba(13,148,136,0.3)', flexShrink: 0, position: 'relative', cursor: 'pointer' },
  avatarEditOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0D9488', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid #fff' },
  heroInfo: { paddingBottom: '4px' },
  heroName: { fontSize: '20px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.3px' },
  heroSub: { fontSize: '13px', color: '#64748B', marginTop: '3px' },
  heroBadges: { display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' },
  badge: (color, bg) => ({ fontSize: '11px', fontWeight: '600', color, backgroundColor: bg, padding: '4px 10px', borderRadius: '20px' }),

  tabs: { display: 'flex', gap: '6px', backgroundColor: '#fff', padding: '6px', borderRadius: '14px', marginBottom: '20px', width: 'fit-content', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
  tab: (active) => ({ padding: '9px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: active ? '700' : '500', color: active ? '#fff' : '#64748B', backgroundColor: active ? '#0D9488' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }),

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '22px', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '18px' },
  fieldGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  fieldLabel: { fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px' },
  fieldValue: { fontSize: '14px', fontWeight: '500', color: '#0F172A', padding: '9px 13px', backgroundColor: '#F8FAFC', borderRadius: '9px', border: '1.5px solid #E2E8F0' },
  fieldInput: { fontSize: '14px', fontWeight: '500', color: '#0F172A', padding: '9px 13px', backgroundColor: '#F0FDF9', borderRadius: '9px', border: '1.5px solid #99F6E4', outline: 'none', width: '100%', fontFamily: 'inherit', transition: 'border-color 0.15s' },
  alertCard: (color, bg) => ({ backgroundColor: bg, border: `1.5px solid ${color}30`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }),
};