import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

/* ── Demo Data ── */
const PATIENT_INFO = {
  dateNaissance: '12/03/1990',
  age: 35,
  sexe: 'Masculin',
  groupeSanguin: 'A+',
  taille: '175 cm',
  poids: '72 kg',
  allergies: ['Pénicilline', 'Arachides'],
  antecedents: ['Hypertension artérielle', 'Diabète type 2'],
  mutuelle: 'CNAS',
  numeroSecu: '190037512345678',
};

const CONSULTATIONS = [
  { id: 1, date: '10 Mars 2025', doctor: 'Dr. Amira Benali', specialty: 'Cardiologue', motif: 'Contrôle cardiaque annuel', diagnostic: 'Bilan satisfaisant, tension stable', color: '#0D9488', avatar: 'AB' },
  { id: 2, date: '22 Fév 2025', doctor: 'Dr. Karim Meziane', specialty: 'Généraliste', motif: 'Fièvre et toux persistante', diagnostic: 'Infection virale — repos prescrit', color: '#2563EB', avatar: 'KM' },
  { id: 3, date: '5 Jan 2025', doctor: 'Dr. Sonia Hadj', specialty: 'Dermatologue', motif: 'Éruption cutanée bras gauche', diagnostic: 'Dermatite de contact — crème prescrite', color: '#7C3AED', avatar: 'SH' },
  { id: 4, date: '18 Nov 2024', doctor: 'Dr. Amira Benali', specialty: 'Cardiologue', motif: 'Palpitations', diagnostic: 'Stress — aucune anomalie détectée', color: '#0D9488', avatar: 'AB' },
];

const ORDONNANCES = [
  { id: 1, date: '10 Mars 2025', doctor: 'Dr. Amira Benali', medicaments: [{ nom: 'Amlodipine 5mg', posologie: '1 comprimé/jour le matin', duree: '3 mois' }, { nom: 'Aspirine 100mg', posologie: '1 comprimé/jour après repas', duree: '3 mois' }], statut: 'active' },
  { id: 2, date: '22 Fév 2025', doctor: 'Dr. Karim Meziane', medicaments: [{ nom: 'Paracétamol 1g', posologie: '1 comprimé toutes les 6h si douleur', duree: '5 jours' }, { nom: 'Vitamine C 500mg', posologie: '1 comprimé/jour', duree: '15 jours' }], statut: 'terminée' },
  { id: 3, date: '5 Jan 2025', doctor: 'Dr. Sonia Hadj', medicaments: [{ nom: 'Crème Hydrocortisone 1%', posologie: 'Appliquer 2x/jour sur zone affectée', duree: '10 jours' }], statut: 'terminée' },
];

const ANALYSES = [
  { id: 1, date: '08 Mars 2025', type: 'Bilan sanguin complet', laboratoire: 'Labo Central Alger', resultats: [{ nom: 'Glycémie', valeur: '5.2 mmol/L', normal: true, ref: '3.9 – 6.1' }, { nom: 'Cholestérol total', valeur: '4.8 mmol/L', normal: true, ref: '< 5.2' }, { nom: 'Triglycérides', valeur: '2.4 mmol/L', normal: false, ref: '< 1.7' }, { nom: 'Hémoglobine', valeur: '13.8 g/dL', normal: true, ref: '13 – 17' }] },
  { id: 2, date: '20 Fév 2025', type: 'NFS (Numération Formule Sanguine)', laboratoire: 'Clinique El Azhar', resultats: [{ nom: 'Globules rouges', valeur: '4.9 T/L', normal: true, ref: '4.5 – 5.5' }, { nom: 'Globules blancs', valeur: '11.2 G/L', normal: false, ref: '4.0 – 10.0' }, { nom: 'Plaquettes', valeur: '245 G/L', normal: true, ref: '150 – 400' }] },
];

const TABS = [
  { id: 'info', label: '👤 Informations', },
  { id: 'consultations', label: '🩺 Consultations' },
  { id: 'ordonnances', label: '💊 Ordonnances' },
  { id: 'analyses', label: '🔬 Analyses' },
];

export default function PatientDossier() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedOrd, setExpandedOrd] = useState(null);
  const [expandedAna, setExpandedAna] = useState(null);

  const firstName = user?.first_name || 'Patient';
  const fullName = `${user?.first_name || 'Mohamed'} ${user?.last_name || 'Benali'}`;
  const initials = `${user?.first_name?.[0] || 'P'}${user?.last_name?.[0] || ''}`.toUpperCase();

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .tab-btn:hover { background-color: #F1F5F9 !important; color: #0F172A !important; }
        .nav-link:hover { background-color: #F1F5F9 !important; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        .card-hover:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; transform: translateY(-1px); transition: all 0.2s; }
        .expand-btn:hover { background-color: #E2E8F0 !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.25s ease; }
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
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/patient/profile' },
                    { icon: '📅', label: 'Mes rendez-vous', path: '/patient/appointments' },
                    { icon: '💬', label: 'Messages', path: '/patient/messages' },
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
            <h1 style={s.pageTitle}>🗂️ Dossier Médical</h1>
            <p style={s.pageSubtitle}>Consultez et gérez l'ensemble de vos informations de santé</p>
          </div>
          <button style={s.exportBtn} onClick={() => toast.success('Export PDF en cours...')}>
            ⬇ Exporter PDF
          </button>
        </div>

        {/* Patient Banner */}
        <div style={s.banner}>
          <div style={s.bannerAvatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={s.bannerName}>{fullName}</div>
            <div style={s.bannerMeta}>
              {PATIENT_INFO.age} ans · {PATIENT_INFO.sexe} · Groupe sanguin : <strong>{PATIENT_INFO.groupeSanguin}</strong> · {PATIENT_INFO.mutuelle}
            </div>
          </div>
          <div style={s.bannerStats}>
            {[
              { val: CONSULTATIONS.length, label: 'Consultations' },
              { val: ORDONNANCES.length, label: 'Ordonnances' },
              { val: ANALYSES.length, label: 'Analyses' },
            ].map((st, i) => (
              <div key={i} style={s.bannerStat}>
                <div style={s.bannerStatVal}>{st.val}</div>
                <div style={s.bannerStatLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {TABS.map(tab => (
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
        {activeTab === 'info' && (
          <div className="fade-up" style={s.grid2}>
            {/* Infos personnelles */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>👤 Informations personnelles</h3>
              <div style={s.infoGrid}>
                {[
                  { label: 'Date de naissance', val: PATIENT_INFO.dateNaissance },
                  { label: 'Âge', val: `${PATIENT_INFO.age} ans` },
                  { label: 'Sexe', val: PATIENT_INFO.sexe },
                  { label: 'Groupe sanguin', val: PATIENT_INFO.groupeSanguin },
                  { label: 'Taille', val: PATIENT_INFO.taille },
                  { label: 'Poids', val: PATIENT_INFO.poids },
                  { label: 'Mutuelle', val: PATIENT_INFO.mutuelle },
                  { label: 'N° Sécurité sociale', val: PATIENT_INFO.numeroSecu },
                ].map((item, i) => (
                  <div key={i} style={s.infoItem}>
                    <div style={s.infoLabel}>{item.label}</div>
                    <div style={s.infoVal}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Allergies */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>⚠️ Allergies connues</h3>
                {PATIENT_INFO.allergies.length === 0 ? (
                  <p style={s.emptyText}>Aucune allergie renseignée</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {PATIENT_INFO.allergies.map((a, i) => (
                      <span key={i} style={s.allergyChip}>{a}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Antécédents */}
              <div style={s.card}>
                <h3 style={s.cardTitle}>📋 Antécédents médicaux</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {PATIENT_INFO.antecedents.map((a, i) => (
                    <div key={i} style={s.antecedentItem}>
                      <span style={{ color: '#0D9488', fontWeight: '700', marginRight: '8px' }}>•</span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Consultations ── */}
        {activeTab === 'consultations' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {CONSULTATIONS.map(c => (
              <div key={c.id} className="card-hover" style={s.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={s.consultAvatar(c.color)}>{c.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={s.consultDoctor}>{c.doctor}</div>
                        <div style={s.consultSpec}>{c.specialty}</div>
                      </div>
                      <span style={s.consultDate}>{c.date}</span>
                    </div>
                    <div style={s.consultRow}>
                      <span style={s.consultLabel}>Motif :</span>
                      <span style={s.consultText}>{c.motif}</span>
                    </div>
                    <div style={s.consultRow}>
                      <span style={s.consultLabel}>Diagnostic :</span>
                      <span style={{ ...s.consultText, color: '#0D9488', fontWeight: '600' }}>{c.diagnostic}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Ordonnances ── */}
        {activeTab === 'ordonnances' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ORDONNANCES.map(o => (
              <div key={o.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={s.consultDoctor}>{o.doctor}</div>
                    <div style={s.consultSpec}>{o.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={s.statutChip(o.statut === 'active')}>
                      {o.statut === 'active' ? '✅ Active' : '⏹ Terminée'}
                    </span>
                    <button
                      className="expand-btn"
                      style={s.expandBtn}
                      onClick={() => setExpandedOrd(expandedOrd === o.id ? null : o.id)}
                    >
                      {expandedOrd === o.id ? '▲ Masquer' : '▼ Détails'}
                    </button>
                  </div>
                </div>
                {expandedOrd === o.id && (
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {o.medicaments.map((m, i) => (
                      <div key={i} style={s.medicamentItem}>
                        <div style={s.medicamentNom}>💊 {m.nom}</div>
                        <div style={s.medicamentDetail}>Posologie : {m.posologie}</div>
                        <div style={s.medicamentDetail}>Durée : {m.duree}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Analyses ── */}
        {activeTab === 'analyses' && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ANALYSES.map(a => (
              <div key={a.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={s.consultDoctor}>🔬 {a.type}</div>
                    <div style={s.consultSpec}>{a.laboratoire} · {a.date}</div>
                  </div>
                  <button
                    className="expand-btn"
                    style={s.expandBtn}
                    onClick={() => setExpandedAna(expandedAna === a.id ? null : a.id)}
                  >
                    {expandedAna === a.id ? '▲ Masquer' : '▼ Résultats'}
                  </button>
                </div>
                {expandedAna === a.id && (
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Paramètre', 'Valeur', 'Référence', 'Statut'].map(h => (
                            <th key={h} style={s.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {a.resultats.map((r, i) => (
                          <tr key={i}>
                            <td style={s.td}>{r.nom}</td>
                            <td style={{ ...s.td, fontWeight: '700', color: r.normal ? '#0F172A' : '#DC2626' }}>{r.valeur}</td>
                            <td style={{ ...s.td, color: '#94A3B8', fontSize: '12px' }}>{r.ref}</td>
                            <td style={s.td}>
                              <span style={r.normal ? s.normalChip : s.abnormalChip}>
                                {r.normal ? '✓ Normal' : '⚠ Anormal'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────── STYLES ─────────── */
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
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  exportBtn: { background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#0F172A' },

  banner: { backgroundColor: '#fff', borderRadius: '18px', border: '1.5px solid #E2E8F0', padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  bannerAvatar: { width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg,#0D9488,#065F52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: '#fff', flexShrink: 0 },
  bannerName: { fontSize: '20px', fontWeight: '800', color: '#0F172A' },
  bannerMeta: { fontSize: '13px', color: '#64748B', marginTop: '4px' },
  bannerStats: { display: 'flex', gap: '24px', marginLeft: 'auto' },
  bannerStat: { textAlign: 'center' },
  bannerStatVal: { fontSize: '24px', fontWeight: '800', color: '#0D9488' },
  bannerStatLabel: { fontSize: '11px', color: '#94A3B8', fontWeight: '500' },

  tabs: { display: 'flex', gap: '6px', marginBottom: '20px', backgroundColor: '#fff', padding: '6px', borderRadius: '14px', border: '1.5px solid #E2E8F0', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' },
  tab: (active) => ({ padding: '9px 20px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: active ? '700' : '500', color: active ? '#fff' : '#64748B', backgroundColor: active ? '#0D9488' : 'transparent', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }),

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '22px', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  cardTitle: { fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' },

  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  infoItem: { backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '12px 14px' },
  infoLabel: { fontSize: '11px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' },
  infoVal: { fontSize: '14px', fontWeight: '600', color: '#0F172A' },

  allergyChip: { backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '13px', fontWeight: '600', padding: '5px 12px', borderRadius: '20px' },
  antecedentItem: { backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center' },
  emptyText: { fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' },

  consultAvatar: (color) => ({ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }),
  consultDoctor: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
  consultSpec: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  consultDate: { fontSize: '12px', fontWeight: '600', color: '#fff', backgroundColor: '#0D9488', padding: '4px 12px', borderRadius: '20px' },
  consultRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' },
  consultLabel: { fontSize: '12px', fontWeight: '700', color: '#94A3B8', whiteSpace: 'nowrap' },
  consultText: { fontSize: '14px', color: '#0F172A' },

  statutChip: (active) => ({ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', backgroundColor: active ? '#DCFCE7' : '#F1F5F9', color: active ? '#16A34A' : '#64748B' }),
  expandBtn: { fontSize: '12px', fontWeight: '600', color: '#64748B', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', transition: 'background 0.15s' },

  medicamentItem: { backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '12px 16px' },
  medicamentNom: { fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' },
  medicamentDetail: { fontSize: '13px', color: '#64748B' },

  th: { textAlign: 'left', padding: '8px 12px', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1.5px solid #E2E8F0' },
  td: { padding: '12px', fontSize: '14px', color: '#0F172A', borderBottom: '1px solid #F8FAFC' },
  normalChip: { fontSize: '11px', fontWeight: '600', backgroundColor: '#DCFCE7', color: '#16A34A', padding: '3px 10px', borderRadius: '20px' },
  abnormalChip: { fontSize: '11px', fontWeight: '600', backgroundColor: '#FEE2E2', color: '#DC2626', padding: '3px 10px', borderRadius: '20px' },
};