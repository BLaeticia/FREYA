import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const TABS = [
  { id: 'info', label: '👤 Informations' },
  { id: 'consultations', label: '🩺 Consultations' },
  { id: 'ordonnances', label: '💊 Ordonnances' },
  { id: 'analyses', label: '🔬 Analyses' },
];

export default function PatientDossier() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ── CLEF DE STOCKAGE UNIQUE PAR UTILISATEUR ──
  const storageKey = `freya_patient_info_${user?.id || user?.email || 'default'}`;

  // ── CHARGEMENT INITIAL DEPUIS localStorage ──
  const loadSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch { return {}; }
  };

  const firstName = user?.firstName || user?.first_name || 'Patient';
  const lastName = user?.lastName || user?.last_name || '';
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0] || 'P'}${lastName[0] || ''}`.toUpperCase();

  const birthDate = user?.birthDate || user?.birth_date;
  const age = birthDate
    ? new Date().getFullYear() - new Date(birthDate).getFullYear()
    : '--';

  // ── ÉTAT DES INFORMATIONS ÉDITABLES ──
  const [editData, setEditData] = useState(() => {
    const saved = loadSaved();
    return {
      phone: saved.phone || user?.phone || '',
      birthDate: saved.birthDate || birthDate || '',
      bloodGroup: saved.bloodGroup || user?.bloodGroup || 'A+',
      insurance: saved.insurance || user?.insurance || 'CNAS',
      ssn: saved.ssn || user?.ssn || '',
      address: saved.address || user?.address || '',
    };
  });

  // ── ÉTAT TEMPORAIRE PENDANT L'ÉDITION ──
  const [tempData, setTempData] = useState({ ...editData });

  // ── RECHARGEMENT SI L'UTILISATEUR CHANGE ──
  useEffect(() => {
    const saved = loadSaved();
    setEditData(prev => ({
      phone: saved.phone || user?.phone || prev.phone,
      birthDate: saved.birthDate || birthDate || prev.birthDate,
      bloodGroup: saved.bloodGroup || user?.bloodGroup || prev.bloodGroup,
      insurance: saved.insurance || user?.insurance || prev.insurance,
      ssn: saved.ssn || user?.ssn || prev.ssn,
      address: saved.address || user?.address || prev.address,
    }));
  }, [user?.id]);

  const handleEditStart = () => {
    setTempData({ ...editData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData({ ...editData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      //on envoie les donnees au serveur dur la route existante
      await api.put('/records/profile', tempData);
      // Si le serveur répond OK, on met à jour le store global
      updateUser({ ...user, ...tempData });
      
      localStorage.setItem(storageKey, JSON.stringify(tempData))
      setEditData({ ...tempData });
      setIsEditing(false);
      toast.success('Informations mises à jour  :) !');
    } catch (error){
      console.error("Erreur API:", error);
      toast.error("Le serveur n'a pas pu enregistrer les modifications"); 
    }
  };

  const handleChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Déconnecté avec succès');
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Chargement du profil...</div>;

  // ── Données à afficher (mode lecture) ──
  const displayAge = editData.birthDate
    ? new Date().getFullYear() - new Date(editData.birthDate).getFullYear()
    : age;

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .nav-link:hover { background-color: #F1F5F9 !important; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.25s ease; }
        .edit-input { width: 100%; box-sizing: border-box; padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #0F172A; background: #F8FAFC; transition: border-color 0.2s; }
        .edit-input:focus { outline: none; border-color: #0D9488; background: #fff; }
        .edit-input:hover { border-color: #CBD5E1; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className="nav-link" style={s.navLink(link.id === 'dossier')}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <button style={s.rdvBtn} onClick={() => navigate('/doctors')}>+ Prendre RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={s.userName}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={s.dropdownHeader}>
                    <div style={s.dropdownName}>{fullName}</div>
                    <div style={s.dropdownEmail}>{user?.email}</div>
                  </div>
                  <div className="dropdown-item" style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={handleLogout}>
                    <span>🚪</span> Déconnexion
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={s.main}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>🗂️ Dossier Médical</h1>
            <p style={s.pageSubtitle}>Consultez et gérez vos informations de santé</p>
          </div>
          <button style={s.exportBtn} onClick={() => toast.success('Génération du PDF...')}>⬇ Exporter PDF</button>
        </div>

        {/* Bannière Patient */}
        <div style={s.banner}>
          <div style={s.bannerAvatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={s.bannerName}>{fullName}</div>
            <div style={s.bannerMeta}>
              {displayAge} ans · {user?.gender === 'M' ? 'Masculin' : 'Féminin'} · Groupe : <strong>{editData.bloodGroup}</strong> · {editData.insurance}
            </div>
          </div>
          <div style={s.bannerStats}>
            <div style={s.bannerStat}>
              <div style={s.bannerStatVal}>1</div>
              <div style={s.bannerStatLabel}>Consultations</div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div style={s.tabs}>
          {TABS.map(tab => (
            <button key={tab.id} style={s.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONTENU DES ONGLETS ── */}
        <div className="fade-up">
          {activeTab === 'info' && (
            <div style={s.grid2}>
              {/* ── CARTE INFORMATIONS PERSONNELLES ── */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>👤 Informations personnelles</h3>

                {!isEditing ? (
                  /* ── MODE LECTURE ── */
                  <>
                    <div style={s.infoGrid}>
                      {[
                        { label: 'Date de naissance', val: editData.birthDate || 'Non renseignée' },
                        { label: 'Email', val: user?.email },
                        { label: 'Téléphone', val: editData.phone || 'Non renseigné' },
                        { label: 'Groupe sanguin', val: editData.bloodGroup },
                        { label: 'N° Sécurité sociale', val: editData.ssn || '---' },
                        { label: 'Mutuelle', val: editData.insurance },
                      ].map((item, i) => (
                        <div key={i} style={s.infoItem}>
                          <div style={s.infoLabel}>{item.label}</div>
                          <div style={s.infoVal}>{item.val}</div>
                        </div>
                      ))}
                    </div>
                    {/* BOUTON EN BAS */}
                    <div style={s.btnRow}>
                      <button style={s.editBtn} onClick={handleEditStart}>
                        ✏️ Modifier mes informations
                      </button>
                    </div>
                  </>
                ) : (
                  /* ── MODE ÉDITION ── */
                  <>
                    <div style={s.infoGrid}>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>Date de naissance</div>
                        <input
                          className="edit-input"
                          type="date"
                          value={tempData.birthDate}
                          onChange={e => handleChange('birthDate', e.target.value)}
                        />
                      </div>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>Email</div>
                        <div style={{ ...s.infoVal, color: '#94A3B8', fontStyle: 'italic', fontSize: '12px' }}>
                          {user?.email} <span style={{ fontSize: '10px' }}>(non modifiable)</span>
                        </div>
                      </div>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>Téléphone</div>
                        <input
                          className="edit-input"
                          type="tel"
                          placeholder="0551227056"
                          value={tempData.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                        />
                      </div>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>Groupe sanguin</div>
                        <select
                          className="edit-input"
                          value={tempData.bloodGroup}
                          onChange={e => handleChange('bloodGroup', e.target.value)}
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>N° Sécurité sociale</div>
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="---"
                          value={tempData.ssn}
                          onChange={e => handleChange('ssn', e.target.value)}
                        />
                      </div>
                      <div style={s.infoItem}>
                        <div style={s.infoLabel}>Mutuelle</div>
                        <input
                          className="edit-input"
                          type="text"
                          placeholder="CNAS"
                          value={tempData.insurance}
                          onChange={e => handleChange('insurance', e.target.value)}
                        />
                      </div>
                    </div>
                    {/* BOUTONS EN BAS */}
                    <div style={s.btnRow}>
                      <button style={s.cancelBtn} onClick={handleCancel}>Annuler</button>
                      <button style={s.saveBtn} onClick={handleSave}>💾 Enregistrer</button>
                    </div>
                  </>
                )}
              </div>

              {/* ── CARTE ALLERGIES ── */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>⚠️ Allergies & Antécédents</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  <span style={s.allergyChip}>Aucune allergie signalée</span>
                </div>
                <div style={s.antecedentItem}>• Dossier médical informatisé actif</div>
              </div>
            </div>
          )}

          {activeTab !== 'info' && (
            <div style={{ ...s.card, textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#64748B' }}>Aucune donnée disponible dans la section {activeTab}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STYLES ──
const s = {
  root: { fontFamily: "'DM Sans', sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh' },
  navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 },
  navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#0F172A', textDecoration: 'none' },
  logoAccent: { color: '#F97316' },
  navLinks: { display: 'flex', gap: '10px', marginLeft: '40px', flex: 1 },
  navLink: (active) => ({ padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: active ? '700' : '500', color: active ? '#0D9488' : '#64748B', backgroundColor: active ? '#CCFBF1' : 'transparent', textDecoration: 'none' }),
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  rdvBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', cursor: 'pointer', fontWeight: '600' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700' },
  userName: { fontSize: '13px', fontWeight: '600' },
  dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: '200px' },
  dropdownHeader: { padding: '12px', borderBottom: '1px solid #F1F5F9' },
  dropdownName: { fontSize: '14px', fontWeight: '700' },
  dropdownEmail: { fontSize: '11px', color: '#94A3B8' },
  dropdownItem: { padding: '10px 12px', fontSize: '13px', cursor: 'pointer' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '30px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '25px' },
  pageTitle: { fontSize: '26px', fontWeight: '800' },
  pageSubtitle: { fontSize: '14px', color: '#64748B' },
  exportBtn: { backgroundColor: '#fff', border: '1px solid #E2E8F0', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  banner: { backgroundColor: '#fff', borderRadius: '18px', padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', border: '1px solid #E2E8F0' },
  bannerAvatar: { width: '60px', height: '60px', borderRadius: '15px', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', fontWeight: '800' },
  bannerName: { fontSize: '22px', fontWeight: '800' },
  bannerMeta: { fontSize: '14px', color: '#64748B' },
  bannerStats: { display: 'flex', gap: '30px', marginLeft: 'auto' },
  bannerStat: { textAlign: 'center' },
  bannerStatVal: { fontSize: '24px', fontWeight: '800', color: '#0D9488' },
  bannerStatLabel: { fontSize: '11px', color: '#94A3B8' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: (active) => ({ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: active ? '#0D9488' : '#fff', color: active ? '#fff' : '#64748B', cursor: 'pointer', fontWeight: '700' }),
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' },
  cardTitle: { fontSize: '16px', fontWeight: '800', marginBottom: '15px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  infoItem: { backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px' },
  infoLabel: { fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' },
  infoVal: { fontSize: '13px', fontWeight: '600' },
  allergyChip: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  antecedentItem: { padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '13px', marginBottom: '5px' },
  // ── BOUTONS EN BAS ──
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' },
  editBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  saveBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  cancelBtn: { backgroundColor: '#fff', border: '1.5px solid #E2E8F0', color: '#64748B', borderRadius: '9px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
};