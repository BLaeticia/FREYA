import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

<<<<<<< HEAD
/* ─── Tarifs analyses ─────────────────────────────── */
const ANALYSES = [
  { cat:'Hématologie',         ic:'🩸', couleur:'#DC2626', bg:'#FEF2F2', bdr:'#FECACA', items:[
    { nom:'Numération Formule Sanguine (NFS)',   prix:350,  delai:'2h'    },
    { nom:'Vitesse de Sédimentation (VS)',       prix:250,  delai:'1h'    },
    { nom:'Groupe Sanguin + Rhésus',            prix:300,  delai:'1h'    },
    { nom:'Taux de Prothrombine (TP)',           prix:400,  delai:'3h'    },
    { nom:'Frottis sanguin',                    prix:450,  delai:'24h'   },
  ]},
  { cat:'Biochimie',           ic:'⚗️', couleur:'#2563EB', bg:'#EFF6FF', bdr:'#BFDBFE', items:[
    { nom:'Glycémie à jeun',                    prix:250,  delai:'1h'    },
    { nom:'HbA1c (Hémoglobine glyquée)',         prix:700,  delai:'24h'   },
    { nom:'Bilan lipidique complet',             prix:800,  delai:'3h'    },
    { nom:'Créatinine + Urée',                  prix:450,  delai:'2h'    },
    { nom:'Transaminases (ASAT + ALAT)',          prix:500,  delai:'2h'    },
    { nom:'Bilan hépatique complet',             prix:1100, delai:'3h'    },
    { nom:'Acide urique',                        prix:300,  delai:'2h'    },
    { nom:'Calcium + Phosphore',                prix:450,  delai:'2h'    },
  ]},
  { cat:'Hormonologie',        ic:'🔬', couleur:'#7C3AED', bg:'#F5F3FF', bdr:'#DDD6FE', items:[
    { nom:'TSH (Thyroïde)',                     prix:900,  delai:'24h'   },
    { nom:'T3 + T4 libres',                     prix:1200, delai:'24h'   },
    { nom:'Bilan thyroïdien complet',           prix:1800, delai:'24h'   },
    { nom:'FSH + LH',                           prix:1100, delai:'24h'   },
    { nom:'Estradiol (E2)',                      prix:900,  delai:'24h'   },
    { nom:'Progestérone',                        prix:900,  delai:'24h'   },
    { nom:'Prolactine',                          prix:900,  delai:'24h'   },
    { nom:'Testostérone totale',                prix:900,  delai:'24h'   },
    { nom:'Cortisol matinal',                   prix:950,  delai:'24h'   },
  ]},
  { cat:'Sérologie',           ic:'🧪', couleur:'#059669', bg:'#ECFDF5', bdr:'#A7F3D0', items:[
    { nom:'Sérologie Hépatite B (AgHBs)',       prix:700,  delai:'24h'   },
    { nom:'Sérologie Hépatite C',               prix:800,  delai:'24h'   },
    { nom:'VIH 1+2 (Ag/Ac)',                    prix:800,  delai:'24h'   },
    { nom:'Toxoplasmose IgG + IgM',             prix:700,  delai:'24h'   },
    { nom:'CRP (Protéine C Réactive)',           prix:400,  delai:'2h'    },
    { nom:'Facteur Rhumatoïde',                 prix:600,  delai:'24h'   },
    { nom:'H. pylori (sérologie)',              prix:750,  delai:'24h'   },
  ]},
  { cat:'Parasitologie',       ic:'🦠', couleur:'#D97706', bg:'#FFFBEB', bdr:'#FDE68A', items:[
    { nom:'Examen parasitologique des selles',  prix:450,  delai:'24h'   },
    { nom:'Coproculture',                        prix:600,  delai:'48h'   },
    { nom:'ECBU (Analyse urine)',               prix:500,  delai:'48h'   },
    { nom:'Antibiogramme',                      prix:400,  delai:'48h'   },
    { nom:'Prélèvement gorge / nez',            prix:450,  delai:'48h'   },
  ]},
  { cat:'Vitamines & Minéraux',ic:'💊', couleur:'#0891B2', bg:'#ECFEFF', bdr:'#A5F3FC', items:[
    { nom:'Vitamine D (25-OH)',                  prix:1200, delai:'24h'   },
    { nom:'Vitamine B12',                        prix:1000, delai:'24h'   },
    { nom:'Folates (B9)',                        prix:950,  delai:'24h'   },
    { nom:'Bilan martial complet',              prix:950,  delai:'24h'   },
    { nom:'Magnésium',                           prix:350,  delai:'2h'    },
    { nom:'Zinc',                                prix:600,  delai:'24h'   },
  ]},
  { cat:'Marqueurs tumoraux',  ic:'🔎', couleur:'#9333EA', bg:'#FDF4FF', bdr:'#E9D5FF', items:[
    { nom:'PSA total (Prostate)',                prix:900,  delai:'24h'   },
    { nom:'CA 125 (Ovaire)',                    prix:950,  delai:'24h'   },
    { nom:'CA 19-9 (Pancréas)',                 prix:950,  delai:'24h'   },
    { nom:'ACE (Colorectal)',                   prix:900,  delai:'24h'   },
    { nom:'AFP (Foie / Testicule)',              prix:900,  delai:'24h'   },
  ]},
  { cat:'Urine & Grossesse',   ic:'💛', couleur:'#B45309', bg:'#FEF3C7', bdr:'#FCD34D', items:[
    { nom:'Bandelette urinaire',                prix:300,  delai:'30min' },
    { nom:'Test de grossesse (bHCG urinaire)', prix:350,  delai:'30min' },
    { nom:'bHCG quantitatif (sanguin)',         prix:700,  delai:'3h'    },
    { nom:'Microalbuminurie',                   prix:600,  delai:'24h'   },
  ]},
];

const HORAIRES = [
  { jour:'Samedi',    h:'07:30 – 19:00' },
  { jour:'Dimanche',  h:'07:30 – 19:00' },
  { jour:'Lundi',     h:'07:30 – 19:00' },
  { jour:'Mardi',     h:'07:30 – 19:00' },
  { jour:'Mercredi',  h:'07:30 – 19:00' },
  { jour:'Jeudi',     h:'07:30 – 19:00' },
  { jour:'Vendredi',  h:'Fermé', closed:true },
];

const SERVICES = [
  ['🏠','Prélèvement à domicile','Sur rendez-vous téléphonique'],
  ['📱','Résultats en ligne',    'Via Freya ou SMS'],
  ['🚀','Résultats urgents',     'Service express disponible'],
  ['📄','Ordonnance numérique',  'Transmission au médecin traitant'],
  ['🔒','Confidentialité',       'Données médicales sécurisées'],
  ['♿','Accès handicapés',      'Locaux entièrement accessibles'],
];

/* ─── CSS ─────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

.lp { font-family:'DM Sans',-apple-system,sans-serif; background:#F8FAFC; min-height:100vh; color:#0F172A; -webkit-font-smoothing:antialiased; }
.lp * { box-sizing:border-box; margin:0; padding:0; }

/* NAV */
.lp-nav { background:rgba(255,255,255,0.97); border-bottom:1px solid #E2E8F0; position:sticky; top:0; z-index:100; backdrop-filter:blur(12px); padding:0 40px; }
.lp-nav-in { max-width:900px; margin:0 auto; height:64px; display:flex; align-items:center; justify-content:space-between; }
.lp-logo { font-size:36px; font-weight:900; color: #064b47; text-decoration:none; letter-spacing:-0.5px; }
.lp-logo span { color: #07534d; }
.lp-back { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px; font-size:15px; font-weight:600; color: #64748B; border:1.5px solid #E2E8F0; background: #f7fffe; cursor:pointer; font-family:inherit; transition:all 0.15s; }
.lp-back:hover { color:#0D9488; border-color:#0D9488; background:#F0FDFA; }

.lp-hero {
  background: linear-gradient(160deg,#065a50 0%,#0D9488 45%,#2DD4BF 100%);
  padding:44px 40px; position:relative; overflow:hidden;
}
.lp-hero::before { content:''; position:absolute; top:-80px; right:-80px; width:300px; height:300px; border-radius:50%; background:rgba(255,255,255,0.07); }
.lp-hero::after  { content:''; position:absolute; bottom:-60px; left:25%; width:350px; height:180px; border-radius:50%; background:rgba(255,255,255,0.04); }
.lp-hero-in { max-width:900px; margin:0 auto; position:relative; z-index:1; display:flex; align-items:center; gap:24px; }
.lp-hero-ic { width:80px; height:80px; border-radius:20px; background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; font-size:38px; flex-shrink:0; }
.lp-hero-badge { display:inline-flex; align-items:center; gap:5px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; margin-bottom:8px; }
.lp-hero-name { font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.5px; margin-bottom:8px; }
.lp-hero-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.lp-hero-info { font-size:13px; color:rgba(255,255,255,0.85); font-weight:500; display:flex; align-items:center; gap:5px; }
.lp-hero-sep { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.4); }
.lp-hero-tag { background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:3px 12px; border-radius:20px; font-size:12px; font-weight:600; }

/* BODY — UNE SEULE COLONNE centrée */
.lp-body { max-width:1200px; margin:0 auto; padding:30px 40px 50px; }

/* CARDS */
.lp-card { background: #fff; border:1px solid #E2E8F0; border-radius:16px; margin-bottom:16px; box-shadow:0 1px 4px rgba(0,0,0,0.04); overflow:hidden; }
.lp-card-head { padding:15px 22px; border-bottom:1px solid #F1F5F9; display:flex; align-items:center; gap:12px; }
.lp-card-ic { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.lp-card-title { font-size:25px; font-weight:700; color: #0F172A; }
.lp-card-body { padding:20px 22px; }

/* INFO RAPIDE (contact + stats dans une seule rangée) */
.lp-quickrow { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
.lp-quick-item { background: #eaeef3; border:1px solid #F1F5F9; border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
.lp-quick-ic { width:36px; height:36px; border-radius:9px; background: #f6fbfc; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.lp-quick-lbl { font-size:14px; font-weight:700; color: #8e8f92; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:3px; }
.lp-quick-val { font-size:13px; font-weight:700; color:#0F172A; }
.lp-quick-val.teal { color:#0D9488; }

/* CONTACT CARD — gradient compact horizontal */
.lp-contact-band {
  background:linear-gradient(135deg,#065a50 0%,#0D9488 100%);height: 100px;
  border-radius:14px; padding:20px 24px; margin-bottom:16px;
  display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
}
.lp-contact-band-left { display:flex; align-items:center; gap:20px; flex-wrap:wrap; flex:1; }
.lp-contact-band-item { display:flex; align-items:center; gap:10px; }
.lp-contact-band-ic { width:36px; height:36px; border-radius:9px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.lp-contact-band-val { font-size:15px; font-weight:700; color: #fff; }
.lp-contact-band-lbl { font-size:12px; color:rgb(243, 250, 248); margin-top:1px; }
.lp-call-btn { background:#fff; color:#0D9488; border:none; border-radius:10px; padding:11px 22px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; white-space:nowrap; transition:all 0.15s; flex-shrink:0; }
.lp-call-btn:hover { background:#F0FDFA; }

/* STATS RAPIDES inline */
.lp-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:16px; }
.lp-stat { background: #edf5f4; border:1px solid #a4e2df; border-radius:12px; padding:14px; text-align:center; }
.lp-stat-num { font-size:26px; font-weight:900; color: #0d5e57; letter-spacing:-0.5px; }
.lp-stat-lbl { font-size:12px; color: #828fa1; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }

/* HORAIRES */
.lp-horaires-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
.lp-hour-row { display:flex; justify-content:space-between; align-items:center; padding:9px 14px; border-bottom:1px solid #F8FAFC; border-right:1px solid #F8FAFC; font-size:13px; }
.lp-hour-row:nth-child(even) { border-right:none; }
.lp-hour-row:nth-last-child(-n+2) { border-bottom:none; }
.lp-hour-day { font-weight:600; color:#334155; }
.lp-hour-time { color:#0D9488; font-weight:700; }
.lp-hour-closed { color:#EF4444; font-weight:700; }

/* TABS ANALYSES */
.lp-tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; margin-bottom:18px; }
.lp-tabs::-webkit-scrollbar { display:none; }
.lp-tab { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:700; border:1.5px solid #E2E8F0; background:#fff; color:#64748B; cursor:pointer; white-space:nowrap; transition:all 0.15s; font-family:inherit; }
.lp-tab.on { background:#0D9488; color:#fff; border-color:#0D9488; }
.lp-tab:hover:not(.on) { border-color:#0D9488; color:#0D9488; }

/* CAT HEADER */
.lp-cat-head { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; margin-bottom:14px; }
.lp-cat-ic { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; }
.lp-cat-name { font-size:14px; font-weight:700; }
.lp-cat-count { font-size:12px; font-weight:600; opacity:0.65; }

/* TABLE ANALYSES */
.lp-table-wrap { border-radius:12px; border:1px solid #E2E8F0; overflow:hidden; }
.lp-table { width:100%; border-collapse:collapse; }
.lp-table thead { background:#F8FAFC; }
.lp-table th { padding:10px 16px; font-size:10px; font-weight:700; color:#94A3B8; text-transform:uppercase; letter-spacing:0.8px; text-align:left; border-bottom:1px solid #E2E8F0; }
.lp-table td { padding:13px 16px; font-size:13px; border-bottom:1px solid #F8FAFC; vertical-align:middle; }
.lp-table tbody tr:hover td { background:#FAFBFD; }
.lp-table tbody tr:last-child td { border-bottom:none; }
.lp-an-name { font-weight:600; color:#0F172A; }
.lp-an-prix { font-size:17px; font-weight:800; color:#0D9488; }
.lp-an-da { font-size:11px; color:#94A3B8; margin-top:1px; }
.lp-an-delai { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:#64748B; background:#F1F5F9; padding:3px 9px; border-radius:20px; }

/* SERVICES */
.lp-services { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.lp-service { display:flex; align-items:flex-start; gap:10px; padding:14px; background:#F8FAFC; border:1px solid #F1F5F9; border-radius:12px; }
.lp-service-ic { font-size:20px; flex-shrink:0; }
.lp-service-t { font-size:12px; font-weight:700; color:#0F172A; }
.lp-service-s { font-size:11px; color:#94A3B8; margin-top:2px; }

/* CERTIF */
.lp-certif { display:flex; align-items:center; gap:14px; padding:14px 18px; background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; margin-bottom:0; }
.lp-certif-t { font-size:13px; font-weight:700; color:#065F46; }
.lp-certif-s { font-size:12px; color:#0D9488; margin-top:1px; }

/* SPINNER / 404 */
.lp-spin { width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#0D9488; border-radius:50%; animation:lp-r 0.7s linear infinite; margin:80px auto; }
@keyframes lp-r { to { transform:rotate(360deg); } }
.lp-404 { text-align:center; padding:80px 20px; color:#64748B; }

@media(max-width:700px) {
  .lp-body { padding:16px 20px 40px; }
  .lp-nav  { padding:0 20px; }
  .lp-hero { padding:32px 20px; }
  .lp-hero-name { font-size:20px; }
  .lp-quickrow { grid-template-columns:1fr 1fr; }
  .lp-stats-row { grid-template-columns:1fr 1fr; }
  .lp-horaires-grid { grid-template-columns:1fr; }
  .lp-services { grid-template-columns:1fr 1fr; }
  .lp-contact-band { flex-direction:column; align-items:flex-start; }
}
`;

export default function LabPublicPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [lab,     setLab]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState(0);

=======
/* 1. ON PLACE LES STYLES EN HAUT POUR ÉVITER L'ERREUR D'INITIALISATION */
const s = {
  root: { fontFamily: "'DM Sans', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh' },
  loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px', color: '#0D9488' },
  navbar: { 
    height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0',
    display: 'flex', alignItems: 'center', padding: '0 40px', position: 'sticky', top: 0, zIndex: 10
  },
  navInner: { width: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '24px', fontWeight: '800', color: '#0F172A', textDecoration: 'none' },
  backBtn: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: '600', backgroundColor: '#fff' },
  hero: { 
    background: 'linear-gradient(160deg, #065a50 0%, #0D9488 40%, #2DD4BF 100%)',
    padding: '60px 40px', position: 'relative', overflow: 'hidden', color: '#fff'
  },
  heroShape1: { position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' },
  heroContent: { maxWidth: '1200px', margin: '0 auto', position: 'relative' },
  heroBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '16px' },
  heroTitle: { fontSize: '42px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-1px' },
  heroInfoRow: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  heroInfo: { fontSize: '15px', fontWeight: '500', opacity: 0.9 },
  heroDivider: { width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.3)' },
  container: { maxWidth: '1000px', margin: '30px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  cardHeader: { padding: '20px', borderBottom: '1px solid #F1F5F9' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#0F172A' },
  tabs: { display: 'flex', gap: '10px', padding: '15px 20px', overflowX: 'auto', backgroundColor: '#F8FAFC' },
  tab: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', backgroundColor: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '13px' },
  tabActive: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #0D9488', backgroundColor: '#0D9488', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 20px', fontSize: '12px', color: '#64748B', textTransform: 'uppercase', backgroundColor: '#F8FAFC' },
  td: { padding: '16px 20px', borderBottom: '1px solid #F1F5F9', fontSize: '14px' },
  delaiBadge: { backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  horairesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', padding: '10px' },
  hourRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #F8FAFC' },
  dayLabel: { fontWeight: '600', color: '#475569' },
  hours: { color: '#0D9488', fontWeight: '700' },
  closed: { color: '#EF4444', fontWeight: '700' }
};

const ANALYSES = [
  { cat:'Hématologie', ic:'🩸', items:[ { nom:'Numération Formule Sanguine (NFS)', prix:350, delai:'2h' }, { nom:'Groupe Sanguin + Rhésus', prix:300, delai:'1h' } ]},
  { cat:'Biochimie', ic:'⚗️', items:[ { nom:'Glycémie à jeun', prix:250, delai:'1h' }, { nom:'Bilan lipidique complet', prix:800, delai:'3h' } ]},
  { cat:'Sérologie', ic:'🧪', items:[ { nom:'VIH 1+2 (Ag/Ac)', prix:800, delai:'24h' }, { nom:'H. pylori (sérologie)', prix:750, delai:'24h' } ]},
];

const HORAIRES = [
  { jour:'Samedi', h:'07:30 – 19:00' }, { jour:'Dimanche', h:'07:30 – 19:00' }, { jour:'Lundi', h:'07:30 – 19:00' },
  { jour:'Mardi', h:'07:30 – 19:00' }, { jour:'Mercredi', h:'07:30 – 19:00' }, { jour:'Jeudi', h:'07:30 – 19:00' },
  { jour:'Vendredi', h:'Fermé', closed:true },
];

export default function LabPublicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
  useEffect(() => {
    api.get(`/laboratory/${id}`)
      .then(r => setLab(r.data))
      .catch(() => setLab(null))
      .finally(() => setLoading(false));
  }, [id]);

<<<<<<< HEAD
  if (loading) return <div className="lp"><style>{css}</style><div className="lp-spin"/></div>;

  if (!lab) return (
    <div className="lp"><style>{css}</style>
      <div className="lp-404">
        <div style={{fontSize:48,marginBottom:16}}>🔬</div>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Laboratoire introuvable</h2>
        <p>Ce laboratoire n'existe pas ou a été supprimé.</p>
      </div>
    </div>
  );

  const cat = ANALYSES[tab];
=======
  if (loading) return <div style={s.loader}>Chargement...</div>;
  if (!lab) return <div style={s.loader}>Laboratoire introuvable</div>;

  const currentCat = ANALYSES[tab];
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38

  return (
<<<<<<< HEAD
    <div className="lp">
      <style>{css}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-in">
          <Link to="/" className="lp-logo">Freya<span>.</span></Link>
          <button className="lp-back" onClick={() => navigate(-1)}>← Retour aux résultats</button>
=======
    <div style={s.root}>
      <nav style={s.navbar}>
        <div style={s.navInner}>
<<<<<<< HEAD
          <div style={s.logo}>
            Frey<span style={{ color: '#0D9488' }}>a</span>
          </div>
          <div style={s.navLinks}>
            <a href="#features" style={s.navLink}>Fonctionnalités</a>
            <a href="#specialties" style={s.navLink}>Spécialités</a>
            <a href="#about" style={s.navLink}>À propos</a>
            <a href="#contact" style={s.navLink}>Contact</a>
          </div>
          <div style={s.navActions}>
            <Link to="/login" style={s.loginBtn}>Se connecter</Link>
            <Link to="/register" style={s.registerBtn}>S''inscrire</Link>
          </div>
>>>>>>> 849b888 (Sauvegarde locale des corrections PFE)
        </div>
      </nav>

      {/* HERO */}
      <div className="lp-hero">
        <div className="lp-hero-in">
          <div className="lp-hero-ic">🔬</div>
          <div>
            <div className="lp-hero-badge">🏥 Laboratoire d'analyses médicales</div>
            <div className="lp-hero-name">{lab.name}</div>
            <div className="lp-hero-row">
              <div className="lp-hero-info">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {lab.address}
              </div>
              <div className="lp-hero-sep"/>
              <div className="lp-hero-info">{lab.city ? `${lab.city}, ` : ''}{lab.wilaya}</div>
              {lab.phone && <><div className="lp-hero-sep"/><div className="lp-hero-info">📞 {lab.phone}</div></>}
              <div className="lp-hero-tag">✓ Agréé</div>
              <div className="lp-hero-tag">🕐 Sam – Jeu</div>
            </div>
=======
          <Link to="/" style={s.logo}>Frey<span style={{ color: '#0D9488' }}>a</span></Link>
          <button style={s.backBtn} onClick={() => navigate(-1)}>← Retour</button>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroShape1} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🔬 Partenaire Bio-Santé</div>
          {/* Utilisation de ?. pour éviter de planter si une donnée manque */}
          <h1 style={s.heroTitle}>{lab?.name || "Laboratoire d'analyses"}</h1>
          <div style={s.heroInfoRow}>
            <span style={s.heroInfo}>📍 {lab?.address || 'Adresse non renseignée'}, {lab?.wilaya || ''}</span>
            <span style={s.heroDivider} />
            <span style={s.heroInfo}>📞 {lab?.phone || "Non renseigné"}</span>
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* ── CORPS — UNE SEULE COLONNE ── */}
      <div className="lp-body">

        {/* 1. BAND CONTACT — bande horizontale teal */}
        <div className="lp-contact-band">
          <div className="lp-contact-band-left">
            {lab.phone && (
              <div className="lp-contact-band-item">
                <div className="lp-contact-band-ic">📞</div>
                <div>
                  <div className="lp-contact-band-val">{lab.phone}</div>
                  <div className="lp-contact-band-lbl">Téléphone</div>
                </div>
              </div>
            )}
            {lab.email && (
              <div className="lp-contact-band-item">
                <div className="lp-contact-band-ic">✉️</div>
                <div>
                  <div className="lp-contact-band-val">{lab.email}</div>
                  <div className="lp-contact-band-lbl">Email</div>
                </div>
              </div>
            )}
            <div className="lp-contact-band-item">
              <div className="lp-contact-band-ic">📍</div>
              <div>
                <div className="lp-contact-band-val">{lab.city || lab.wilaya}</div>
                <div className="lp-contact-band-lbl">Localisation</div>
              </div>
            </div>
            <div className="lp-contact-band-item">
              <div className="lp-contact-band-ic">🕐</div>
              <div>
                <div className="lp-contact-band-val">Sam – Jeu : 07h30 – 19h</div>
                <div className="lp-contact-band-lbl">Horaires</div>
              </div>
            </div>
          </div>
          {lab.phone && (
            <button className="lp-call-btn" onClick={() => window.open(`tel:${lab.phone}`)}>
              📞 Appeler maintenant
            </button>
          )}
        </div>

        {/* 2. STATS */}
        <div className="lp-stats-row">
          {[['60+','Analyses'],['8','Catégories'],['2h','Délai min.'],['6j/7','Ouverture']].map(([n,l]) => (
            <div key={l} className="lp-stat">
              <div className="lp-stat-num">{n}</div>
              <div className="lp-stat-lbl">{l}</div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* 3. INFOS PRATIQUES */}
        <div className="lp-card">
          <div className="lp-card-head">
            <div className="lp-card-ic" style={{background:'#F0FDFA'}}>📋</div>
            <span className="lp-card-title">Informations pratiques</span>
=======
      {/* SPECIALTIES */}
      <section id="specialties" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Consultez par spécialité</h2>
            <p style={s.sectionSub}>Trouvez le spécialiste qu''il vous faut parmi nos médecins qualifiés</p>
>>>>>>> 849b888 (Sauvegarde locale des corrections PFE)
          </div>
          <div className="lp-card-body">
            <div className="lp-quickrow">
              <div className="lp-quick-item">
                <div className="lp-quick-ic">📍</div>
                <div>
                  <div className="lp-quick-lbl">Adresse</div>
                  <div className="lp-quick-val">{lab.address}</div>
                </div>
=======
      <div style={s.container}>
        <section style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Tarifs des Analyses</h2>
          </div>
          <div style={s.tabs}>
            {ANALYSES.map((c, i) => (
              <button key={i} style={tab === i ? s.tabActive : s.tab} onClick={() => setTab(i)}>
                {c.ic} {c.cat}
              </button>
            ))}
          </div>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Examen</th>
                <th style={s.th}>Délai</th>
                <th style={s.th}>Prix</th>
              </tr>
            </thead>
            <tbody>
              {currentCat.items.map((item, i) => (
                <tr key={i}>
                  <td style={s.td}>{item.nom}</td>
                  <td style={s.td}><span style={s.delaiBadge}>{item.delai}</span></td>
                  <td style={{...s.td, fontWeight: '800', color: '#0D9488'}}>{item.prix} DA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={s.card}>
          <div style={s.cardHeader}><h2 style={s.cardTitle}>Horaires d'ouverture</h2></div>
          <div style={s.horairesGrid}>
            {HORAIRES.map((h, i) => (
              <div key={i} style={s.hourRow}>
                <span style={s.dayLabel}>{h.jour}</span>
                <span style={h.closed ? s.closed : s.hours}>{h.h}</span>
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
              </div>
              <div className="lp-quick-item">
                <div className="lp-quick-ic">🗺️</div>
                <div>
                  <div className="lp-quick-lbl">Wilaya</div>
                  <div className="lp-quick-val">{lab.wilaya}{lab.city ? ` — ${lab.city}` : ''}</div>
                </div>
              </div>
              {lab.phone && (
                <div className="lp-quick-item">
                  <div className="lp-quick-ic">📞</div>
                  <div>
                    <div className="lp-quick-lbl">Téléphone</div>
                    <div className="lp-quick-val teal">{lab.phone}</div>
                  </div>
                </div>
              )}
              {lab.email && (
                <div className="lp-quick-item">
                  <div className="lp-quick-ic">✉️</div>
                  <div>
                    <div className="lp-quick-lbl">Email</div>
                    <div className="lp-quick-val teal" style={{fontSize:12}}>{lab.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
<<<<<<< HEAD
        </div>

        {/* 4. HORAIRES */}
        <div className="lp-card">
          <div className="lp-card-head">
            <div className="lp-card-ic" style={{background:'#FFFBEB'}}>🕐</div>
            <span className="lp-card-title">Horaires d'ouverture</span>
          </div>
          <div className="lp-card-body">
            {lab.openingHours && (
              <div style={{background:'#F0FDFA',border:'1px solid #99F6E4',borderRadius:10,padding:'9px 14px',marginBottom:14,fontSize:13,color:'#065F46',fontWeight:700}}>
                🕐 {lab.openingHours}
              </div>
            )}
            <div className="lp-horaires-grid">
              {HORAIRES.map(h => (
                <div key={h.jour} className="lp-hour-row">
                  <span className="lp-hour-day">{h.jour}</span>
                  <span className={h.closed ? 'lp-hour-closed' : 'lp-hour-time'}>{h.h}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,padding:'9px 14px',background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:10,fontSize:12,color:'#92400E',fontWeight:600}}>
              ⚠️ Résultats disponibles par SMS et sur votre espace Freya dans les délais indiqués.
            </div>
          </div>
        </div>

        {/* 5. ANALYSES & TARIFS */}
        <div className="lp-card">
          <div className="lp-card-head">
            <div className="lp-card-ic" style={{background:'#F5F3FF'}}>💰</div>
            <span className="lp-card-title">Analyses & Tarifs</span>
          </div>
          <div className="lp-card-body">
            <p style={{fontSize:13,color:'#64748B',marginBottom:16,lineHeight:1.6}}>
              Tarifs indicatifs en dinars algériens (DA). Contactez le laboratoire pour confirmation.
            </p>

            <div className="lp-tabs">
              {ANALYSES.map((c, i) => (
                <button key={i} className={`lp-tab${tab === i ? ' on' : ''}`} onClick={() => setTab(i)}>
                  {c.ic} {c.cat}
                </button>
              ))}
            </div>

            <div className="lp-cat-head" style={{background: cat.bg, border: `1px solid ${cat.bdr}`}}>
              <div className="lp-cat-ic" style={{background: cat.bg}}>{cat.ic}</div>
              <div>
                <div className="lp-cat-name" style={{color: cat.couleur}}>{cat.cat}</div>
                <div className="lp-cat-count" style={{color: cat.couleur}}>{cat.items.length} analyses disponibles</div>
              </div>
            </div>
<<<<<<< HEAD

            <div className="lp-table-wrap">
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>Analyse</th>
                    <th style={{width:110}}>Délai résultat</th>
                    <th style={{width:130,textAlign:'right'}}>Tarif</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((a, i) => (
                    <tr key={i}>
                      <td><span className="lp-an-name">{a.nom}</span></td>
                      <td><span className="lp-an-delai">⏱ {a.delai}</span></td>
                      <td style={{textAlign:'right'}}>
                        <div className="lp-an-prix">{a.prix.toLocaleString('fr-DZ')}</div>
                        <div className="lp-an-da">DA</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{marginTop:12,fontSize:12,color:'#94A3B8',textAlign:'center'}}>
              * Tarifs indicatifs — Contactez le laboratoire pour confirmation
=======
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Support</div>
              <a style={s.footerLink} href="#">Centre d''aide</a>
              <a style={s.footerLink} href="#">Nous contacter</a>
              <a style={s.footerLink} href="#">CGU</a>
>>>>>>> 849b888 (Sauvegarde locale des corrections PFE)
            </div>
          </div>
        </div>

        {/* 6. SERVICES */}
        <div className="lp-card">
          <div className="lp-card-head">
            <div className="lp-card-ic" style={{background:'#EFF6FF'}}>✅</div>
            <span className="lp-card-title">Services proposés</span>
          </div>
          <div className="lp-card-body">
            <div className="lp-services">
              {SERVICES.map(([ic, t, s]) => (
                <div key={t} className="lp-service">
                  <span className="lp-service-ic">{ic}</span>
                  <div>
                    <div className="lp-service-t">{t}</div>
                    <div className="lp-service-s">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. CERTIFICATION */}
        <div className="lp-certif">
          <span style={{fontSize:28}}>✅</span>
          <div>
            <div className="lp-certif-t">Laboratoire agréé — Ministère de la Santé</div>
            <div className="lp-certif-s">Toutes les analyses sont réalisées selon les normes algériennes et internationales.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
=======
        </section>
      </div>
    </div>
  );
}
>>>>>>> 46c9b642d471240671036c70042eb1f14e89cc38
