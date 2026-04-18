import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ANALYSES = [
  { cat:'Hématologie',      ic:'🩸', couleur:'#EF4444', bg:'#FEF2F2', bdr:'#FECACA', items:[
    { nom:'Numération Formule Sanguine (NFS)',      prix:350,  delai:'2h'   },
    { nom:'Vitesse de Sédimentation (VS)',          prix:250,  delai:'1h'   },
    { nom:'Groupe Sanguin + Rhésus',               prix:300,  delai:'1h'   },
    { nom:'Taux de Prothrombine (TP)',              prix:400,  delai:'3h'   },
    { nom:'Frottis sanguin',                       prix:450,  delai:'24h'  },
  ]},
  { cat:'Biochimie',        ic:'⚗️', couleur:'#2563EB', bg:'#EFF6FF', bdr:'#BFDBFE', items:[
    { nom:'Glycémie à jeun',                       prix:250,  delai:'1h'   },
    { nom:'HbA1c (Hémoglobine glyquée)',           prix:700,  delai:'24h'  },
    { nom:'Bilan lipidique complet',               prix:800,  delai:'3h'   },
    { nom:'Créatinine + Urée',                     prix:450,  delai:'2h'   },
    { nom:'Transaminases (ASAT + ALAT)',            prix:500,  delai:'2h'   },
    { nom:'Bilan hépatique complet',               prix:1100, delai:'3h'   },
    { nom:'Acide urique',                          prix:300,  delai:'2h'   },
    { nom:'Calcium + Phosphore',                   prix:450,  delai:'2h'   },
    { nom:'Protéines totales',                     prix:400,  delai:'2h'   },
  ]},
  { cat:'Hormonologie',     ic:'🔬', couleur:'#7C3AED', bg:'#F5F3FF', bdr:'#DDD6FE', items:[
    { nom:'TSH (Thyroïde)',                        prix:900,  delai:'24h'  },
    { nom:'T3 + T4 libres',                       prix:1200, delai:'24h'  },
    { nom:'Bilan thyroïdien complet',              prix:1800, delai:'24h'  },
    { nom:'FSH + LH',                              prix:1100, delai:'24h'  },
    { nom:'Estradiol (E2)',                        prix:900,  delai:'24h'  },
    { nom:'Progestérone',                          prix:900,  delai:'24h'  },
    { nom:'Prolactine',                            prix:900,  delai:'24h'  },
    { nom:'Testostérone totale',                   prix:900,  delai:'24h'  },
    { nom:'Cortisol matinal',                      prix:950,  delai:'24h'  },
    { nom:'Insulinémie',                           prix:1000, delai:'24h'  },
  ]},
  { cat:'Sérologie',        ic:'🧪', couleur:'#059669', bg:'#ECFDF5', bdr:'#A7F3D0', items:[
    { nom:'Sérologie Hépatite B (AgHBs)',          prix:700,  delai:'24h'  },
    { nom:'Sérologie Hépatite C',                  prix:800,  delai:'24h'  },
    { nom:'VIH 1+2 (Ag/Ac)',                       prix:800,  delai:'24h'  },
    { nom:'Toxoplasmose IgG + IgM',               prix:700,  delai:'24h'  },
    { nom:'Rubéole IgG + IgM',                    prix:700,  delai:'24h'  },
    { nom:'CRP (Protéine C Réactive)',             prix:400,  delai:'2h'   },
    { nom:'Facteur Rhumatoïde (FR)',               prix:600,  delai:'24h'  },
    { nom:'H. pylori (sérologie)',                 prix:750,  delai:'24h'  },
  ]},
  { cat:'Parasitologie',    ic:'🦠', couleur:'#D97706', bg:'#FFFBEB', bdr:'#FDE68A', items:[
    { nom:'Examen parasitologique des selles',     prix:450,  delai:'24h'  },
    { nom:'Coproculture',                          prix:600,  delai:'48h'  },
    { nom:'ECBU (Analyse urine)',                  prix:500,  delai:'48h'  },
    { nom:'Antibiogramme',                         prix:400,  delai:'48h'  },
    { nom:'Prélèvement gorge / nez',              prix:450,  delai:'48h'  },
  ]},
  { cat:'Vitamines',        ic:'💊', couleur:'#0891B2', bg:'#ECFEFF', bdr:'#A5F3FC', items:[
    { nom:'Vitamine D (25-OH)',                    prix:1200, delai:'24h'  },
    { nom:'Vitamine B12',                          prix:1000, delai:'24h'  },
    { nom:'Folates (B9)',                          prix:950,  delai:'24h'  },
    { nom:'Bilan martial (Fer, Ferritine, Tf)',    prix:950,  delai:'24h'  },
    { nom:'Magnésium',                             prix:350,  delai:'2h'   },
    { nom:'Zinc',                                  prix:600,  delai:'24h'  },
  ]},
  { cat:'Marqueurs tumoraux',ic:'🔎',couleur:'#7C3AED', bg:'#F5F3FF', bdr:'#C4B5FD', items:[
    { nom:'PSA total (Prostate)',                  prix:900,  delai:'24h'  },
    { nom:'CA 125 (Ovaire)',                       prix:950,  delai:'24h'  },
    { nom:'CA 19-9 (Pancréas)',                    prix:950,  delai:'24h'  },
    { nom:'ACE (Colorectal)',                      prix:900,  delai:'24h'  },
    { nom:'AFP (Foie / Testicule)',                prix:900,  delai:'24h'  },
  ]},
  { cat:'Urine & Grossesse', ic:'💛', couleur:'#D97706', bg:'#FEF3C7', bdr:'#FCD34D', items:[
    { nom:'Bandelette urinaire',                   prix:300,  delai:'30min'},
    { nom:'Test de grossesse (bHCG urinaire)',     prix:350,  delai:'30min'},
    { nom:'bHCG quantitatif (sanguin)',            prix:700,  delai:'3h'   },
    { nom:'Microalbuminurie',                      prix:600,  delai:'24h'  },
  ]},
];

const HORAIRES = [
  { jour:'Samedi',   h:'07:30 – 19:00' },
  { jour:'Dimanche', h:'07:30 – 19:00' },
  { jour:'Lundi',    h:'07:30 – 19:00' },
  { jour:'Mardi',    h:'07:30 – 19:00' },
  { jour:'Mercredi', h:'07:30 – 19:00' },
  { jour:'Jeudi',    h:'07:30 – 19:00' },
  { jour:'Vendredi', h:'Fermé', closed:true },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
.lp-wrap { font-family:'DM Sans',-apple-system,sans-serif; background:#F8FAFC; min-height:100vh; color:#0F172A; -webkit-font-smoothing:antialiased; }
.lp-wrap * { box-sizing:border-box; margin:0; padding:0; }
.lp-nav { background:rgba(255,255,255,0.97); border-bottom:1px solid #E2E8F0; position:sticky; top:0; z-index:100; backdrop-filter:blur(10px); padding:0 40px; }
.lp-nav-in { max-width:1200px; margin:0 auto; height:64px; display:flex; align-items:center; justify-content:space-between; }
.lp-nav-logo { font-size:24px; font-weight:800; color:#0F172A; text-decoration:none; letter-spacing:-0.5px; }
.lp-nav-logo span { color:#0D9488; }
.lp-back-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:600; color:#64748B; border:1.5px solid #E2E8F0; background:#fff; cursor:pointer; font-family:inherit; transition:all 0.15s; text-decoration:none; }
.lp-back-btn:hover { color:#0D9488; border-color:#0D9488; background:#F0FDFA; }
.lp-hero { background:linear-gradient(160deg, #065a50 0%, #0D9488 45%, #2DD4BF 100%); padding:52px 40px; position:relative; overflow:hidden; }
.lp-hero::before { content:''; position:absolute; top:-80px; right:-80px; width:350px; height:350px; border-radius:50%; background:rgba(255,255,255,0.07); }
.lp-hero::after  { content:''; position:absolute; bottom:-60px; left:20%; width:300px; height:200px; border-radius:50%; background:rgba(255,255,255,0.04); }
.lp-hero-in { max-width:1200px; margin:0 auto; position:relative; z-index:1; display:flex; align-items:center; gap:28px; }
.lp-hero-av { width:88px; height:88px; border-radius:22px; background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; font-size:40px; flex-shrink:0; }
.lp-hero-pill { display:inline-flex; align-items:center; gap:5px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:600; margin-bottom:10px; backdrop-filter:blur(8px); }
.lp-hero-name { font-size:30px; font-weight:800; color:#fff; letter-spacing:-0.5px; margin-bottom:8px; }
.lp-hero-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.lp-hero-info { display:flex; align-items:center; gap:6px; font-size:14px; color:rgba(255,255,255,0.85); font-weight:500; }
.lp-hero-sep { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.4); }
.lp-hero-badge { background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
.lp-body { max-width:1200px; margin:0 auto; padding:32px 40px; display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; }
.lp-card { background:#fff; border:1px solid #E2E8F0; border-radius:16px; margin-bottom:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05); }
.lp-card:last-child { margin-bottom:0; }
.lp-card-head { padding:16px 22px; border-bottom:1px solid #F1F5F9; display:flex; align-items:center; gap:12px; }
.lp-card-head-ic { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; }
.lp-card-title { font-size:15px; font-weight:700; color:#0F172A; }
.lp-card-body { padding:22px; }
.lp-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.lp-info-box { background:#F8FAFC; border:1px solid #F1F5F9; border-radius:10px; padding:14px 16px; }
.lp-info-lbl { font-size:10px; font-weight:700; color:#94A3B8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:5px; }
.lp-info-val { font-size:14px; font-weight:600; color:#0F172A; }
.lp-info-val.teal { color:#0D9488; }
.lp-hour-row { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid #F8FAFC; font-size:13px; }
.lp-hour-row:last-child { border-bottom:none; }
.lp-hour-day { font-weight:600; color:#334155; }
.lp-hour-time { color:#0D9488; font-weight:700; }
.lp-hour-closed { color:#EF4444; font-weight:700; }
.lp-tabs { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; margin-bottom:20px; }
.lp-tabs::-webkit-scrollbar { display:none; }
.lp-tab { padding:7px 16px; border-radius:20px; font-size:12px; font-weight:700; border:1.5px solid #E2E8F0; background:#fff; color:#64748B; cursor:pointer; white-space:nowrap; transition:all 0.15s; font-family:inherit; }
.lp-tab.on { background:#0D9488; color:#fff; border-color:#0D9488; }
.lp-tab:hover:not(.on) { border-color:#0D9488; color:#0D9488; }
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
.lp-cat-head { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:12px; margin-bottom:14px; }
.lp-cat-ic { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.lp-cat-name { font-size:15px; font-weight:700; }
.lp-cat-count { font-size:12px; font-weight:600; opacity:0.65; }
.lp-services { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.lp-service-item { display:flex; align-items:flex-start; gap:10px; padding:13px; background:#F8FAFC; border:1px solid #F1F5F9; border-radius:10px; }
.lp-service-ic { font-size:20px; flex-shrink:0; }
.lp-service-t { font-size:12px; font-weight:700; color:#0F172A; }
.lp-service-s { font-size:11px; color:#94A3B8; margin-top:2px; }
.lp-sb { position:sticky; top:84px; display:flex; flex-direction:column; gap:14px; }
.lp-contact-card { background:linear-gradient(135deg, #065a50 0%, #0D9488 100%); border-radius:16px; padding:24px; color:#fff; box-shadow:0 4px 20px rgba(13,148,136,0.25); }
.lp-contact-t { font-size:16px; font-weight:700; margin-bottom:18px; }
.lp-contact-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.12); }
.lp-contact-row:last-of-type { border-bottom:none; margin-bottom:6px; }
.lp-contact-row-ic { width:34px; height:34px; border-radius:9px; background:rgba(255,255,255,0.14); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:15px; }
.lp-contact-val { font-size:13px; font-weight:600; }
.lp-contact-lbl { font-size:10px; color:rgba(255,255,255,0.55); margin-top:1px; }
.lp-call-btn { width:100%; padding:13px; background:#fff; color:#0D9488; border:none; border-radius:10px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.15s; margin-top:14px; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
.lp-call-btn:hover { background:#F0FDFA; }
.lp-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.lp-stat { background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:14px; text-align:center; }
.lp-stat-num { font-size:24px; font-weight:800; color:#0D9488; letter-spacing:-0.5px; }
.lp-stat-lbl { font-size:10px; color:#94A3B8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }
.lp-certif { background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
.lp-certif-t { font-size:12px; font-weight:700; color:#065F46; }
.lp-certif-s { font-size:11px; color:#0D9488; margin-top:2px; }
.lp-spin { width:32px; height:32px; border:3px solid #E2E8F0; border-top-color:#0D9488; border-radius:50%; animation:lp-sp 0.7s linear infinite; margin:80px auto; }
@keyframes lp-sp { to { transform:rotate(360deg); } }
.lp-404 { text-align:center; padding:80px 20px; }
.lp-404-ic { font-size:48px; margin-bottom:16px; opacity:0.4; }
@media(max-width:900px) {
  .lp-body { grid-template-columns:1fr; padding:16px 20px; }
  .lp-hero { padding:32px 20px; }
  .lp-nav { padding:0 20px; }
  .lp-info-grid { grid-template-columns:1fr; }
  .lp-sb { position:static; }
  .lp-hero-name { font-size:22px; }
}
`;

export default function LabPublicPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [lab, setLab]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState(0);

  useEffect(() => {
    api.get(`/laboratory/${id}`)
      .then(r => setLab(r.data))
      .catch(() => setLab(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="lp-wrap"><style>{css}</style><div className="lp-spin"/></div>;
  if (!lab) return (
    <div className="lp-wrap"><style>{css}</style>
      <div className="lp-404">
        <div className="lp-404-ic">🔬</div>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Laboratoire introuvable</h2>
        <p style={{color:'#64748B',fontSize:14}}>Ce laboratoire n'existe pas.</p>
      </div>
    </div>
  );

  const cat = ANALYSES[tab];

  return (
    <div className="lp-wrap">
      <style>{css}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-in">
          <Link to="/" className="lp-nav-logo">Freya<span>.</span></Link>
          <button className="lp-back-btn" onClick={() => navigate(-1)}>
            ← Retour aux résultats
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="lp-hero">
        <div className="lp-hero-in">
          <div className="lp-hero-av">🔬</div>
          <div>
            <div className="lp-hero-pill">🏥 Laboratoire d'analyses médicales</div>
            <div className="lp-hero-name">{lab.name}</div>
            <div className="lp-hero-row">
              <div className="lp-hero-info">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {lab.address}
              </div>
              <div className="lp-hero-sep"/>
              <div className="lp-hero-info">{lab.city ? `${lab.city}, ` : ''}{lab.wilaya}</div>
              {lab.phone && <><div className="lp-hero-sep"/><div className="lp-hero-info">📞 {lab.phone}</div></>}
              <div className="lp-hero-badge">✓ Agréé</div>
              <div className="lp-hero-badge">🕐 Sam–Jeu</div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="lp-body">

        {/* COL GAUCHE */}
        <div>

          {/* Infos pratiques */}
          <div className="lp-card">
            <div className="lp-card-head">
              <div className="lp-card-head-ic" style={{background:'#F0FDFA'}}>📋</div>
              <span className="lp-card-title">Informations pratiques</span>
            </div>
            <div className="lp-card-body">
              <div className="lp-info-grid">
                <div className="lp-info-box">
                  <div className="lp-info-lbl">📍 Adresse</div>
                  <div className="lp-info-val">{lab.address}</div>
                </div>
                <div className="lp-info-box">
                  <div className="lp-info-lbl">🗺️ Wilaya</div>
                  <div className="lp-info-val">{lab.wilaya}{lab.city ? ` — ${lab.city}` : ''}</div>
                </div>
                {lab.phone && (
                  <div className="lp-info-box">
                    <div className="lp-info-lbl">📞 Téléphone</div>
                    <div className="lp-info-val teal">{lab.phone}</div>
                  </div>
                )}
                {lab.email && (
                  <div className="lp-info-box">
                    <div className="lp-info-lbl">✉️ Email</div>
                    <div className="lp-info-val teal" style={{fontSize:13}}>{lab.email}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div className="lp-card">
            <div className="lp-card-head">
              <div className="lp-card-head-ic" style={{background:'#FFFBEB'}}>🕐</div>
              <span className="lp-card-title">Horaires d'ouverture</span>
            </div>
            <div className="lp-card-body">
              {lab.openingHours && (
                <div style={{background:'#F0FDFA',border:'1px solid #99F6E4',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13,color:'#065F46',fontWeight:700}}>
                  🕐 {lab.openingHours}
                </div>
              )}
              {HORAIRES.map(h => (
                <div key={h.jour} className="lp-hour-row">
                  <span className="lp-hour-day">{h.jour}</span>
                  <span className={h.closed ? 'lp-hour-closed' : 'lp-hour-time'}>{h.h}</span>
                </div>
              ))}
              <div style={{marginTop:12,padding:'10px 14px',background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:10,fontSize:12,color:'#92400E',fontWeight:600}}>
                ⚠️ Résultats disponibles par SMS et sur votre espace Freya dans les délais indiqués.
              </div>
            </div>
          </div>

          {/* Analyses & Tarifs */}
          <div className="lp-card">
            <div className="lp-card-head">
              <div className="lp-card-head-ic" style={{background:'#F5F3FF'}}>💰</div>
              <span className="lp-card-title">Analyses & Tarifs</span>
            </div>
            <div className="lp-card-body">
              <p style={{fontSize:13,color:'#64748B',marginBottom:18,lineHeight:1.6}}>
                Tarifs indicatifs en dinars algériens (DA). Une ordonnance médicale peut être requise pour certaines analyses.
              </p>
              <div className="lp-tabs">
                {ANALYSES.map((c, i) => (
                  <button key={i} className={`lp-tab${tab===i?' on':''}`} onClick={() => setTab(i)}>
                    {c.ic} {c.cat}
                  </button>
                ))}
              </div>
              <div className="lp-cat-head" style={{background:cat.bg, border:`1px solid ${cat.bdr}`}}>
                <div className="lp-cat-ic" style={{background:cat.bg}}>{cat.ic}</div>
                <div>
                  <div className="lp-cat-name" style={{color:cat.couleur}}>{cat.cat}</div>
                  <div className="lp-cat-count" style={{color:cat.couleur}}>{cat.items.length} analyses</div>
                </div>
              </div>
              <div className="lp-table-wrap">
                <table className="lp-table">
                  <thead>
                    <tr>
                      <th>Analyse</th>
                      <th style={{width:100}}>Délai résultat</th>
                      <th style={{width:130,textAlign:'right'}}>Tarif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((a,i) => (
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
            </div>
          </div>

          {/* Services */}
          <div className="lp-card">
            <div className="lp-card-head">
              <div className="lp-card-head-ic" style={{background:'#EFF6FF'}}>✅</div>
              <span className="lp-card-title">Services proposés</span>
            </div>
            <div className="lp-card-body">
              <div className="lp-services">
                {[
                  ['🏠','Prélèvement à domicile','Sur rendez-vous téléphonique'],
                  ['📱','Résultats en ligne','Via Freya ou SMS'],
                  ['🚀','Résultats urgents','Service express disponible'],
                  ['📄','Ordonnance numérique','Transmission au médecin traitant'],
                  ['🔒','Confidentialité garantie','Données médicales sécurisées'],
                  ['♿','Accès handicapés','Locaux entièrement accessibles'],
                ].map(([ic,t,s]) => (
                  <div key={t} className="lp-service-item">
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

        </div>

        {/* SIDEBAR */}
        <div className="lp-sb">
          <div className="lp-contact-card">
            <div className="lp-contact-t">📞 Contacter le laboratoire</div>
            {[
              lab.phone && {ic:'📞', val:lab.phone,               lbl:'Téléphone'},
              lab.email && {ic:'✉️', val:lab.email,               lbl:'Email'},
              {ic:'📍',            val:lab.city||lab.wilaya,      lbl:'Localisation'},
              {ic:'🕐',            val:'Sam – Jeu : 07h30 – 19h', lbl:'Horaires'},
            ].filter(Boolean).map((item,i) => (
              <div key={i} className="lp-contact-row">
                <div className="lp-contact-row-ic">{item.ic}</div>
                <div>
                  <div className="lp-contact-val">{item.val}</div>
                  <div className="lp-contact-lbl">{item.lbl}</div>
                </div>
              </div>
            ))}
            {lab.phone && (
              <button className="lp-call-btn" onClick={() => window.open(`tel:${lab.phone}`)}>
                📞 Appeler maintenant
              </button>
            )}
          </div>

          <div style={{background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:'#0F172A',marginBottom:14}}>En chiffres</div>
            <div className="lp-stats-grid">
              {[
                ['60+','Analyses'],['8','Catégories'],
                ['2h','Délai min.'],['6j/7','Ouverture'],
              ].map(([n,l]) => (
                <div key={l} className="lp-stat">
                  <div className="lp-stat-num">{n}</div>
                  <div className="lp-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-certif">
            <span style={{fontSize:26}}>✅</span>
            <div>
              <div className="lp-certif-t">Laboratoire agréé</div>
              <div className="lp-certif-s">Ministère de la Santé — Algérie</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}