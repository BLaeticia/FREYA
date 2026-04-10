import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HeartButton } from '../../components/FavorisWidget';
import api from '../../services/api';

/* ─── DONNÉES ─────────────────────────────────────────────── */
const WILAYAS = [
  { code: '01', nom: 'Adrar' },          { code: '02', nom: 'Chlef' },
  { code: '03', nom: 'Laghouat' },       { code: '04', nom: 'Oum El Bouaghi' },
  { code: '05', nom: 'Batna' },          { code: '06', nom: 'Béjaïa' },
  { code: '07', nom: 'Biskra' },         { code: '08', nom: 'Béchar' },
  { code: '09', nom: 'Blida' },          { code: '10', nom: 'Bouira' },
  { code: '11', nom: 'Tamanrasset' },    { code: '12', nom: 'Tébessa' },
  { code: '13', nom: 'Tlemcen' },        { code: '14', nom: 'Tiaret' },
  { code: '15', nom: 'Tizi Ouzou' },     { code: '16', nom: 'Alger' },
  { code: '17', nom: 'Djelfa' },         { code: '18', nom: 'Jijel' },
  { code: '19', nom: 'Sétif' },          { code: '20', nom: 'Saïda' },
  { code: '21', nom: 'Skikda' },         { code: '22', nom: 'Sidi Bel Abbès' },
  { code: '23', nom: 'Annaba' },         { code: '24', nom: 'Guelma' },
  { code: '25', nom: 'Constantine' },    { code: '26', nom: 'Médéa' },
  { code: '27', nom: 'Mostaganem' },     { code: '28', nom: "M'Sila" },
  { code: '29', nom: 'Mascara' },        { code: '30', nom: 'Ouargla' },
  { code: '31', nom: 'Oran' },           { code: '32', nom: 'El Bayadh' },
  { code: '33', nom: 'Illizi' },         { code: '34', nom: 'Bordj Bou Arréridj' },
  { code: '35', nom: 'Boumerdès' },      { code: '36', nom: 'El Tarf' },
  { code: '37', nom: 'Tindouf' },        { code: '38', nom: 'Tissemsilt' },
  { code: '39', nom: 'El Oued' },        { code: '40', nom: 'Khenchela' },
  { code: '41', nom: 'Souk Ahras' },     { code: '42', nom: 'Tipaza' },
  { code: '43', nom: 'Mila' },           { code: '44', nom: 'Aïn Defla' },
  { code: '45', nom: 'Naâma' },          { code: '46', nom: 'Aïn Témouchent' },
  { code: '47', nom: 'Ghardaïa' },       { code: '48', nom: 'Relizane' },
  { code: '49', nom: 'Timimoun' },       { code: '50', nom: 'Bordj Badji Mokhtar' },
  { code: '51', nom: 'Béni Abbès' },     { code: '52', nom: 'Ouled Djellal' },
  { code: '53', nom: 'In Salah' },       { code: '54', nom: 'In Guezzam' },
  { code: '55', nom: 'Touggourt' },      { code: '56', nom: 'Djanet' },
  { code: '57', nom: "El M'Ghair" },     { code: '58', nom: 'El Meniaa' },
];

const SPECIALITES_GROUPED = {
  'Médecine générale': [
    'Médecin généraliste', 'Médecine interne', "Médecine d'urgence",
    'Médecine du travail', 'Médecine préventive',
  ],
  'Chirurgie': [
    'Chirurgien général', 'Chirurgien orthopédiste', 'Chirurgien cardiothoracique',
    'Chirurgien vasculaire', 'Chirurgien pédiatrique', 'Neurochirurgien',
    'Chirurgien plasticien', 'Chirurgien urologue', 'Chirurgien digestif',
    'Chirurgien maxillo-facial',
  ],
  'Médecine spécialisée': [
    'Cardiologue', 'Pneumologue', 'Gastro-entérologue', 'Néphrologue',
    'Endocrinologue', 'Rhumatologue', 'Neurologue', 'Hématologue',
    'Infectiologue', 'Oncologue', 'Allergologue', 'Immunologue',
  ],
  'Santé de la femme & enfant': [
    'Gynécologue', 'Obstétricien', 'Gynécologue-obstétricien',
    'Pédiatre', 'Néonatologiste', 'Pédopsychiatre',
  ],
  'Spécialités sensorielles': ['Ophtalmologue', 'ORL', 'Audiologiste', 'Phoniatre'],
  'Dermatologie & Esthétique': ['Dermatologue', 'Vénérologue', 'Dermatologue esthétique'],
  'Santé mentale': ['Psychiatre', 'Psychologue clinicien', 'Neuropsychiatre'],
  'Imagerie & Biologie': ['Radiologue', 'Médecin nucléaire', 'Anatomopathologiste', 'Biologiste médical'],
  'Rééducation': ['Kinésithérapeute', 'Médecin rééducateur', 'Orthophoniste', 'Ergothérapeute'],
  'Stomatologie': ['Dentiste', 'Orthodontiste', 'Chirurgien dentiste', 'Parodontologue'],
  'Autres spécialités': [
    'Anesthésiste-réanimateur', 'Réanimateur', 'Gériatre', 'Médecin sportif',
    'Acupuncteur', 'Homéopathe', 'Nutritionniste', 'Diététicien', 'Urologue', 'Proctologue',
  ],
};

const ALL_SPECIALITES = Object.values(SPECIALITES_GROUPED).flat();

const PRICE_RANGES = [
  { label: 'Tous les tarifs',   min: 0,    max: 99999 },
  { label: 'Moins de 1 000 DA', min: 0,    max: 999   },
  { label: '1 000 – 2 000 DA',  min: 1000, max: 2000  },
  { label: '2 000 – 3 000 DA',  min: 2001, max: 3000  },
  { label: '3 000 – 5 000 DA',  min: 3001, max: 5000  },
  { label: 'Plus de 5 000 DA',  min: 5001, max: 99999 },
];

const SORT_OPTIONS = [
  { value: 'rating',     label: 'Meilleure note'    },
  { value: 'price_asc',  label: 'Prix croissant'    },
  { value: 'price_desc', label: 'Prix décroissant'  },
  { value: 'experience', label: 'Plus expérimenté'  },
  { value: 'name',       label: 'Ordre alphabétique'},
];

/* ─── CSS ─────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

:root {
  --navy: #0B1D6E;
  --navy-deep: #071347;
  --blue: #2563eb;
  --blue-mid: #1d4ed8;
  --accent: #3b82f6;
  --bg: #ffffff;
  --card: #d1e2fa;
  --sky: #e2e8f0;
  --sky-mid: #cbd5e1;
  --white: #FFFFFF;
  --slate: #64748B;
  --slate-light: #94A3B8;
  --border: #e5e7eb;
  --text: #0a0f1b;
  --text-mid: #232d3a;
  --text-light: #657186;
  --green: #059669;
  --green-bg: #ECFDF5;
  --green-border: #A7F3D0;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(11,29,110,0.06);
  --shadow-hover: 0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(11,29,110,0.14);
}
.sp-searchbar {
  display: none !important;
}

.sp { font-family:'DM Sans',-apple-system,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased; }
.sp * { box-sizing:border-box; margin:0; padding:0; }

/* ── TOPBAR ── */
.sp-nav {
  background: #2f51af;
  position:sticky; top:0; z-index:100;
  border-bottom:4px solid rgba(255,255,255,0.07);
}
.sp-nav-inner {
  max-width:1280px; margin:0 auto; padding:0 28px;
  display:flex; align-items:center; gap:16px; height:100px;
}
.sp-logo {
  font-family:'DM Serif Display',serif;
  font-size: 40px; color: #ffffff; cursor:pointer;
  letter-spacing: 2px; white-space: nowrap; flex-shrink:0;font-weight: 800;
}
.sp-logo em { font-style:italic; color:#93c5fd; }

/* Search bar */
.sp-searchbar {
  flex:1; max-width:600px; display:flex;
  background:#fff; border-radius:10px;
  overflow:hidden; height:42px;
  box-shadow:0 0 0 2px rgba(255,255,255,0.1);
  transition:box-shadow 0.2s;
}
.sp-searchbar:focus-within { box-shadow:0 0 0 2px rgba(147,197,253,0.5); }
.sp-sb-field {
  flex:1; display:flex; align-items:center;
  padding:0 14px; gap:9px; border-right:1px solid var(--border);
}
.sp-sb-field svg { color:var(--slate-light); flex-shrink:0; }
.sp-sb-field input {
  border:none; outline:none; font-size:13.5px;
  font-family:inherit; color:var(--text); width:100%; font-weight:500;
}
.sp-sb-field input::placeholder { color:#C4CEDC; font-weight:400; }
.sp-sb-loc {
  display:flex; align-items:center; padding:0 14px;
  gap:8px; min-width:155px; border-right:1px solid var(--border);
}
.sp-sb-loc svg { color:var(--slate-light); flex-shrink:0; }
.sp-sb-loc select {
  border:none; outline:none; font-size:13px; font-family:inherit;
  color:var(--text); background:transparent; appearance:none;
  max-width:120px; font-weight:500; cursor:pointer;
}
.sp-sb-btn {
  background:var(--blue); color:#fff; border:none;
  padding:0 22px; font-size:13px; font-weight:600;
  cursor:pointer; font-family:inherit; letter-spacing:1px;
  transition:background 0.15s;
}
.sp-sb-btn:hover { background: var(--navy-deep); }
.sp-nav-actions { display:flex; align-items:center; gap:10px; margin-left:auto; flex-shrink:0; }
.sp-nav-btn {
  padding:9px 22px; font-size:16px; font-weight:800;
  color: #095e5e; border: 2px solid rgba(255,255,255,0.2);
  border-radius:13px; cursor:pointer; background: #cddbf0;
  font-family:inherit; white-space:nowrap; transition:all 0.15s;
}
.sp-nav-btn:hover { border-color:rgba(255,255,255,0.5); color:#fff; background:rgba(255,255,255,0.07); }

/* ── ACTIVE FILTERS ── */
.sp-filterbar {
  background:#fff; border-bottom:1px solid var(--border);
  padding:0 28px;
}
.sp-filterbar-inner {
  max-width:1280px; margin:0 auto;
  display:flex; align-items:center; gap:8px;
  padding:10px 0; flex-wrap:wrap;
}
.sp-filterbar-label { font-size:12px; color:var(--slate); font-weight:600; }
.sp-chip {
  display:inline-flex; align-items:center; gap:5px;
  background:var(--sky); border:1px solid var(--sky-mid);
  border-radius:20px; padding:4px 11px 4px 12px;
  font-size:12px; font-weight:600; color:var(--blue); cursor:pointer;
  transition:all 0.12s;
}
.sp-chip:hover { background:var(--sky-mid); }
.sp-chip-x { font-size:15px; line-height:1; opacity:0.6; }
.sp-chip-x:hover { opacity:1; }
.sp-clear-all {
  font-size:12px; color:var(--slate); cursor:pointer;
  font-weight:600; margin-left:4px; text-decoration:underline;
  text-decoration-color:transparent; transition:all 0.12s;
}
.sp-clear-all:hover { color:var(--blue); text-decoration-color:var(--blue); }

/* ── PAGE BODY ── */
.sp-layout { display:flex;
   grid-template-columns: 280px 1fr;
  max-width:1400px; 
  margin:0 auto;
  padding:32px 5px;
  gap:40px;
  background: #ffffff; }

/* ── SIDEBAR ── */
.sp-sidebar { width:360px;
  flex-shrink:0;
  background: transparent;   
  padding: 12px;
  border-radius: 12px; }
.sp-sidebar-sticky { position:sticky; top:88px; display:flex; flex-direction:column; gap:8px; max-height:calc(100vh - 110px); overflow-y:auto; padding-right:6px; }
.sp-sidebar-sticky::-webkit-scrollbar { width:3px; }
.sp-sidebar-sticky::-webkit-scrollbar-thumb { background:var(--sky-mid); border-radius:2px; }

/* Scrollbar globale */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 12px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.sp-filter-card {
  background: #e9f2fc;
  border:1px solid var(--border);
  border-radius:16px;   padding: 4px; overflow:hidden;
  box-shadow:0 2px 10px rgba(0,0,0,0.05);
}
.sp-filter-header {
  padding:14px 18px; display:flex; align-items:center;
  justify-content:space-between; cursor:pointer; user-select:none;
  transition:background 0.12s;
}
.sp-filter-header:hover { background:var(--sky); color: var(--navy); }
.sp-filter-title { font-size:16px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px; }
.sp-filter-title-icon { color:var(--blue); }
.sp-filter-badge {
  font-size:10px; font-weight:800; background:var(--blue); color:#fff;
  border-radius:20px; padding:1px 7px; letter-spacing:0.2px;
}
.sp-filter-arrow { color: var(--blue);
  font-size: 18px;       
  font-weight: bold;
  padding: 4px 8px;       
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer; }
.sp-filter-arrow.open { transform:rotate(180deg); }
.sp-filter-divider { height:1px; background:var(--border); margin:0 18px; }
.sp-filter-body { padding:12px 18px 16px; }

.sp-filter-search-input {
  width:100%; background: #f1f5f9; border:1px solid var(--border);
  border-radius: 7px; padding: 14px; font-size: 15px; font-family: inherit;
  color: #000000; outline:none; margin-bottom:12px; transition:border 0.15s;
}
.sp-filter-search-input::placeholder { color:var(--slate-light); }
.sp-filter-search-input:focus { border-color:var(--blue); background:white; }

/* Wilaya grid */

.sp-wilaya-opt {
  overflow: hidden;
}

.sp-wilaya-name {
  white-space: nowrap;
   overflow: hidden;
  text-overflow: ellipsis;
}


.sp-wilaya-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:1px;
  max-height:220px; overflow-y:auto;
}
.sp-wilaya-grid::-webkit-scrollbar { width:6px; height: 4px;}
.sp-wilaya-grid::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.sp-wilaya-grid::-webkit-scrollbar-thumb { background: #94a3b8; border-radius:10px; }
.sp-wilaya-grid::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
.sp-wilaya-opt {
  display:flex; align-items:center; gap:6px;
  padding:6px 7px; cursor:pointer; border-radius:7px;
  transition:background 0.1s;
}
.sp-wilaya-opt:hover { background:var(--sky); }
.sp-wilaya-opt input { accent-color:var(--blue); width:13px; height:13px; flex-shrink:0; cursor:pointer; }
.sp-wilaya-code { font-size:12px; color: #334155; font-weight:800; min-width:16px; }
.sp-wilaya-name { font-size:12px; color:var(--text-mid); font-weight:500; }
.sp-wilaya-opt.sel .sp-wilaya-name { color:var(--blue); font-weight:700; }
.sp-wilaya-opt.sel { background:var(--sky); }

/* Spec list */
.sp-spec-group-label {
  font-size:9.5px; font-weight:800; color:var(--slate-light);
  text-transform:uppercase; letter-spacing:1.2px; margin:10px 0 4px;
}
.sp-spec-opt {
  display:flex; align-items:center; gap:9px;
  padding:6px 0; cursor:pointer; border-radius:6px;
}
.sp-spec-opt input { accent-color:var(--blue); width:13px; height:13px; flex-shrink:0; cursor:pointer; }
.sp-spec-opt-label { font-size:14px; color:var(--text-mid); font-weight:500; transition:color 0.1s; }
.sp-spec-opt:hover .sp-spec-opt-label { color:var(--blue); }
.sp-spec-opt.sel .sp-spec-opt-label { color:var(--blue); font-weight:600; }

/* Price options */
.sp-price-opt {
  display:flex; align-items:center; gap:9px;
  padding:7px 0; cursor:pointer; border-bottom:1px solid var(--border);
}
.sp-price-opt:last-child { border-bottom:none; }
.sp-price-opt input { accent-color:var(--blue); width:13px; height:13px; flex-shrink:0; cursor:pointer; }
.sp-price-opt-label { font-size:14px; color:var(--text-mid); font-weight:500; transition:color 0.1s; }
.sp-price-opt:hover .sp-price-opt-label { color:var(--blue); }
.sp-price-opt.sel .sp-price-opt-label { color:var(--blue); font-weight:600; }

.sp-filter-reset {
  width:100%; padding:7px; background:var(--sky);
  border:1px solid var(--sky-mid); border-radius:7px;
  color:var(--blue); font-size:12px; font-weight:600;
  cursor:pointer; font-family:inherit; transition:all 0.12s; margin-top:10px;
}
.sp-filter-reset:hover { background:var(--sky-mid); }

/* ── MAIN RESULTS ── */
.sp-main { flex:1; min-width:0; }

/* Tabs */
.sp-tabs { display:flex; gap:0; border-bottom:2px solid var(--border); margin-bottom:20px; }
.sp-tab {
  padding:18px 32px; font-size:18px; font-weight:600;
  color:var(--slate); cursor:pointer; border:none; background:none;
  font-family:inherit; border-bottom:2px solid transparent;
  margin-bottom:-2px; transition:all 0.15s; display:flex; align-items:center; gap:7px;
}
.sp-tab:hover { color:var(--text); }
.sp-tab.active { color:var(--blue); border-bottom: 3px solid var(--blue); font-weight:800; }
.sp-tab-icon { font-size:15px; }

/* Results header */
.sp-results-head {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:16px; gap:12px; flex-wrap:wrap;
}
.sp-results-count { font-size:14px; color:var(--slate); font-weight:500; }
.sp-results-count strong { color:var(--text); font-weight:700; }
.sp-sort-wrap { display:flex; align-items:center; gap:8px; }
.sp-sort-label { font-size:12px; color:var(--slate-light); font-weight:500; }
.sp-sort-select {
  background:#fff; border:1.5px solid var(--border);
  border-radius:8px; padding:7px 14px; font-size:13px;
  font-family:inherit; color:var(--text); outline:none;
  cursor:pointer; appearance:none; font-weight:500;
  box-shadow:var(--shadow); transition:border 0.15s;
}
.sp-sort-select:focus { border-color:var(--accent); }

/* ── DOCTOR CARD ── */
.sp-card {
  background: #f2f7fd; border-radius:16px;
  border:1.5px solid var(--border);
  padding:26px 30px; margin-bottom:18px;
  display:flex; gap:24px; cursor:pointer;
  transition:all 0.18s; box-shadow:var(--shadow);
}
.sp-card:hover {
  border-color:var(--accent); box-shadow:0 10px 30px rgba(0,0,0,0.08);
  transform:translateY(-4px);
}

.sp-card-avatar {
  width:72px; height:72px; border-radius:14px; flex-shrink:0;
  background:linear-gradient(135deg, var(--navy) 0%, var(--blue-mid) 100%);
  display:flex; align-items:center; justify-content:center;
  font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px;
}
.sp-card-body { flex:1; min-width:0; }
.sp-card-name { font-size:22px; font-weight:700; color: #0f172a; margin-bottom:3px; }
.sp-card-spec {
  font-size:16px; color:var(--blue); font-weight:600;
  margin-bottom:8px; display:inline-flex; align-items:center; gap:5px;
}
.sp-card-meta {
  display:flex; align-items:center; gap:10px; flex-wrap:wrap;
  font-size:15px; color:var(--slate); margin-bottom:10px;
}
.sp-card-meta-dot { width:3px; height:3px; background:var(--border); border-radius:50%; flex-shrink:0; }
.sp-card-verified {
  display:inline-flex; align-items:center; gap:4px;
  font-size:13px; color:var(--green); font-weight:700;
  background:var(--green-bg); padding:2px 8px;
  border-radius:20px; border:1px solid var(--green-border);
}
.sp-card-tags { display:flex; gap:6px; flex-wrap:wrap; }
.sp-card-tag {
  font-size:14px; padding:3px 10px;
  background:var(--sky); border:1px solid var(--sky-mid);
  border-radius:20px; color:var(--blue); font-weight:600;
}

/* Slots */
.sp-card-slots { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:12px; padding-top:12px; border-top:1px solid var(--border); }
.sp-slots-label { font-size:13px; color:var(--slate-light); font-weight:600; margin-right:2px; }
.sp-slot {
  font-size:13px; font-weight:700; color:var(--blue);
  background:var(--sky); border:1.5px solid var(--sky-mid);
  border-radius:7px; padding:4px 10px; cursor:pointer; transition:all 0.12s;
}
.sp-slot:hover { background:var(--blue); color:#fff; border-color:var(--blue); }

/* Card right panel */
.sp-card-right {
  display:flex; flex-direction:column;
  align-items:flex-end; justify-content:space-between;
  min-width:220px; padding-left:20px;gap:16px;
  border-left:1px solid var(--border);
}
.sp-card-rating { display:flex; align-items:center; gap:5px; }
.sp-stars { color:#F59E0B; font-size:12px; letter-spacing:0.5px; }
.sp-stars-count { font-size:11px; color:var(--slate-light); font-weight:500; }
.sp-card-price-block { text-align:right; }
.sp-card-price { font-size:22px; font-weight:800; color:var(--text); line-height:1.1; }
.sp-card-price-sub { font-size:10.5px; color:var(--slate-light); margin-top:1px; }
.sp-rdv-btn {
  background:var(--blue); color:#fff; border:none;width:100%;
  border-radius:10px; padding:12px 24px;
  font-size:14px; font-weight:700; cursor:pointer;
  font-family:inherit; transition:all 0.15s; white-space:nowrap;
  letter-spacing:0.2px;
}
.sp-rdv-btn:hover { background:var(--navy-deep); transform:translateY(-1px); box-shadow:0 4px 12px rgba(11,29,110,0.3); }

/* ── LAB CARD ── */
.sp-lab-card {
  background: #f5f9ff; border-radius: var(--radius);
  border: 1.5px solid var(--border); padding: 20px 24px;
  margin-bottom: 10px; display:flex; gap: 18px; cursor: pointer;
  transition: all 0.18s; box-shadow: var(--shadow);
}
.sp-lab-card:hover { border-color:var(--accent); box-shadow:var(--shadow-hover); transform:translateY(-2px); }
.sp-lab-icon {
  width:56px; height:56px; border-radius:12px; flex-shrink:0;
  background:linear-gradient(135deg, var(--navy), var(--blue-mid));
  display:flex; align-items:center; justify-content:center; font-size:22px;
}
.sp-lab-name { font-size:15px; font-weight:700; color:var(--text); margin-bottom:4px; }
.sp-lab-addr { font-size:12px; color:var(--slate); margin-bottom:8px; display:flex; align-items:center; gap:5px; }
.sp-lab-tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:6px; }
.sp-lab-tag { font-size:11px; padding:3px 8px; background:var(--sky); border:1px solid var(--sky-mid); border-radius:20px; color:var(--blue); font-weight:600; }
.sp-lab-hours { font-size:12px; color:var(--slate); display:flex; align-items:center; gap:5px; }
.sp-lab-phone { font-size:13px; font-weight:700; color:var(--navy); }
.sp-contact-btn {
  background:var(--sky); color:var(--blue); border:1.5px solid var(--sky-mid);
  border-radius:9px; padding:9px 18px;
  font-size:13px; font-weight:700; cursor:pointer;
  font-family:inherit; transition:all 0.15s; white-space:nowrap;
}
.sp-contact-btn:hover { background:var(--blue); color:#fff; border-color:var(--blue); }

/* ── EMPTY STATE ── */
.sp-empty { text-align:center; padding:72px 20px; }
.sp-empty-icon { font-size:52px; margin-bottom:16px; opacity:0.3; }
.sp-empty h3 { font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px; }
.sp-empty p { font-size:14px; color:var(--slate); margin-bottom:24px; }
.sp-suggest-title { font-size:11px; color:var(--slate-light); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
.sp-suggest-chips { display:flex; gap:7px; flex-wrap:wrap; justify-content:center; }
.sp-suggest-chip {
  padding:7px 16px; background:#fff; border:1.5px solid var(--border);
  border-radius:20px; font-size:13px; font-weight:600; color:var(--text-mid);
  cursor:pointer; transition:all 0.12s; box-shadow:var(--shadow);
}
.sp-suggest-chip:hover { border-color:var(--blue); color:var(--blue); background:var(--sky); }

/* ── LOADING ── */
.sp-spinner {
  width:36px; height:36px; border:3px solid var(--sky-mid);
  border-top-color:var(--blue); border-radius:50%;
  animation:sp-spin 0.7s linear infinite; margin:72px auto;
}
@keyframes sp-spin { to { transform:rotate(360deg); } }

/* ── PAGINATION ── */
.sp-pager { display:flex; justify-content:center; align-items:center; gap:6px; margin-top:28px; flex-wrap:wrap; }
.sp-page-btn {
  min-width:38px; height:38px; border-radius:9px;
  border:1.5px solid var(--border); background:#fff;
  color:var(--text-mid); font-size:13px; font-weight:600;
  cursor:pointer; font-family:inherit; transition:all 0.12s;
  display:flex; align-items:center; justify-content:center; padding:0 10px;
  box-shadow:var(--shadow);
}
.sp-page-btn:hover { border-color:var(--blue); color:var(--blue); }
.sp-page-btn.active { background:var(--blue); color:#fff; border-color:var(--blue); box-shadow:none; }
.sp-page-btn:disabled { opacity:0.35; cursor:not-allowed; }

/* ── RESET ALL BTN ── */
.sp-reset-all-btn {
  width:100%; padding:9px; background:#FFF5F5;
  border:1px solid #FECACA; border-radius:9px;
  color:#DC2626; font-size:12.5px; font-weight:600;
  cursor:pointer; font-family:inherit; transition:all 0.12s; margin-top:4px;
}
.sp-reset-all-btn:hover { background:#FEE2E2; }
`;

/* ─── Composant ──────────────────────────────────────────── */
export default function DoctorSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── État ── */
  const [query,          setQuery]          = useState(searchParams.get('specialite') || '');
  const [wilaya,         setWilaya]         = useState(searchParams.get('wilaya') || '');
  const [tab,            setTab]            = useState('doctors');
  const [doctors,        setDoctors]        = useState([]);
  const [labs,           setLabs]           = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [total,          setTotal]          = useState(0);
  const [page,           setPage]           = useState(1);
  const PER_PAGE = 10;

  /* ── Filtres ── */
  const [selectedWilayas, setSelectedWilayas] = useState(searchParams.get('wilaya') ? [searchParams.get('wilaya')] : []);
  const [selectedSpecs,   setSelectedSpecs]   = useState(searchParams.get('specialite') ? [searchParams.get('specialite')] : []);
  const [priceRange,      setPriceRange]      = useState(0);
  const [sortBy,          setSortBy]          = useState('rating');
  const [specSearch,      setSpecSearch]      = useState('');
  const [wilayaSearch,    setWilayaSearch]    = useState('');
  const [openSections,    setOpenSections]    = useState({ wilaya: true, spec: true, price: true });

  const toggleSection = k => setOpenSections(p => ({ ...p, [k]: !p[k] }));

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'doctors') {
        const params = { page, limit: PER_PAGE };
        if (selectedWilayas.length === 1) params.wilaya = selectedWilayas[0];
        if (selectedSpecs.length > 0)     params.specialite = selectedSpecs[0];
        else if (query)                   params.specialite = query;
        if (priceRange > 0) {
          params.minPrice = PRICE_RANGES[priceRange].min;
          params.maxPrice = PRICE_RANGES[priceRange].max;
        }
        const r = await api.get('/doctors', { params });
        let list = r.data.doctors || r.data || [];
        list = sortDoctors(list, sortBy);
        setDoctors(list);
        setTotal(r.data.total || list.length);
      } else {
        const params = { page, limit: PER_PAGE };
        if (selectedWilayas.length === 1) params.wilaya = selectedWilayas[0];
        if (query) params.name = query;
        const r = await api.get('/laboratory', { params });
        setLabs(r.data.labs || r.data || []);
        setTotal(r.data.total || (r.data.labs || r.data || []).length);
      }
    } catch { setDoctors([]); setLabs([]); setTotal(0); }
    finally { setLoading(false); }
  }, [tab, page, selectedWilayas, selectedSpecs, query, priceRange, sortBy]);

  useEffect(() => { setPage(1); }, [selectedWilayas, selectedSpecs, query, priceRange, sortBy, tab]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const sortDoctors = (list, sort) => {
    const c = [...list];
    switch (sort) {
      case 'rating':     return c.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      case 'price_asc':  return c.sort((a, b) => (a.consultationPrice || 0) - (b.consultationPrice || 0));
      case 'price_desc': return c.sort((a, b) => (b.consultationPrice || 0) - (a.consultationPrice || 0));
      case 'experience': return c.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
      case 'name':       return c.sort((a, b) => `${a.user?.lastName}`.localeCompare(`${b.user?.lastName}`));
      default:           return c;
    }
  };

  const toggleWilaya = nom => {
    setSelectedWilayas(p => p.includes(nom) ? p.filter(w => w !== nom) : [...p, nom]);
  };
  const toggleSpec = s => {
    setSelectedSpecs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  };
  const doSearch = () => {
    if (query && !selectedSpecs.includes(query)) setSelectedSpecs([query]);
    fetchData();
  };
  const resetAll = () => {
    setSelectedWilayas([]); setSelectedSpecs([]); setQuery('');
    setWilaya(''); setPriceRange(0); setSortBy('rating'); setPage(1);
  };

  const activeFilters = [
    ...selectedWilayas.map(w => ({ label: w, remove: () => setSelectedWilayas(p => p.filter(x => x !== w)) })),
    ...selectedSpecs.map(s  => ({ label: s, remove: () => setSelectedSpecs(p => p.filter(x => x !== s)) })),
    ...(priceRange > 0 ? [{ label: PRICE_RANGES[priceRange].label, remove: () => setPriceRange(0) }] : []),
  ];

  const filteredWilayas = WILAYAS.filter(w =>
    !wilayaSearch || w.nom.toLowerCase().includes(wilayaSearch.toLowerCase()) || w.code.includes(wilayaSearch)
  );
  const filteredSpecs = specSearch
    ? ALL_SPECIALITES.filter(s => s.toLowerCase().includes(specSearch.toLowerCase()))
    : null;

  const fakeSlots = () => {
    const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
    const today = new Date().getDay();
    return [0,1,2].map(i => {
      const d = (today + i + 1) % 7;
      const h = [9,10,14,15,16][Math.floor(Math.random() * 5)];
      const m = ['00','30'][Math.floor(Math.random() * 2)];
      return { day: days[d], time: `${h}:${m}` };
    });
  };

  const initials = d => `${d.user?.firstName?.[0] || ''}${d.user?.lastName?.[0] || ''}`.toUpperCase();
  const starsStr = n => '★'.repeat(Math.round(Math.min(n || 0, 5)));
  const totalPages = Math.ceil(total / PER_PAGE);

  /* ── RENDER ── */
  return (
    <>
      <style>{css}</style>
      <div className="sp">

        {/* ── NAVBAR ── */}
        <nav className="sp-nav">
          <div className="sp-nav-inner">
            <Link to="/" className="sp-logo">Freya<em>.</em></Link>

            <div className="sp-searchbar">
              <div className="sp-sb-field">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  placeholder={tab === 'doctors' ? 'Spécialité, médecin...' : 'Nom du laboratoire...'}
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  list="sp-sl"
                />
                <datalist id="sp-sl">{ALL_SPECIALITES.map(s => <option key={s} value={s} />)}</datalist>
              </div>
              <div className="sp-sb-loc">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <select value={wilaya} onChange={e => { setWilaya(e.target.value); setSelectedWilayas(e.target.value ? [e.target.value] : []); }}>
                  <option value="">Toutes les wilayas</option>
                  {WILAYAS.map(w => <option key={w.code} value={w.nom}>{w.code} – {w.nom}</option>)}
                </select>
              </div>
              <button className="sp-sb-btn" onClick={doSearch}>Rechercher</button>
            </div>

            <div className="sp-nav-actions">
              <Link to="/login" className="sp-nav-btn">Se connecter</Link>
              <Link to="/register" className="sp-nav-btn">S'inscrire</Link>
            </div>
          </div>
        </nav>

        {/* ── ACTIVE FILTERS ── */}
        {activeFilters.length > 0 && (
          <div className="sp-filterbar">
            <div className="sp-filterbar-inner">
              <span className="sp-filterbar-label">Filtres actifs :</span>
              {activeFilters.map((f, i) => (
                <button key={i} className="sp-chip" onClick={f.remove}>
                  {f.label} <span className="sp-chip-x">×</span>
                </button>
              ))}
              <span className="sp-clear-all" onClick={resetAll}>Tout effacer</span>
            </div>
          </div>
        )}

        {/* ── LAYOUT ── */}
        <div className="sp-layout">

          {/* ── SIDEBAR ── */}
          <aside className="sp-sidebar">
            <div className="sp-sidebar-sticky">

              {/* Wilaya */}
              <div className="sp-filter-card">
                <div className="sp-filter-header" onClick={() => toggleSection('wilaya')}>
                  <span className="sp-filter-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sp-filter-title-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Wilaya
                    {selectedWilayas.length > 0 && <span className="sp-filter-badge">{selectedWilayas.length}</span>}
                  </span>
                  <span className={`sp-filter-arrow${openSections.wilaya ? ' open' : ''}`}>▾</span>
                </div>
                {openSections.wilaya && (
                  <>
                    <div className="sp-filter-divider" />
                    <div className="sp-filter-body">
                      <input
                        className="sp-filter-search-input"
                        placeholder="Rechercher une wilaya..."
                        value={wilayaSearch}
                        onChange={e => setWilayaSearch(e.target.value)}
                      />
                      <div className="sp-wilaya-grid">
                        {filteredWilayas.map(w => (
                          <div
                            key={w.code}
                            className={`sp-wilaya-opt${selectedWilayas.includes(w.nom) ? ' sel' : ''}`}
                            onClick={() => toggleWilaya(w.nom)}
                          >
                            <input type="checkbox" checked={selectedWilayas.includes(w.nom)} readOnly />
                            <span className="sp-wilaya-code">{w.code}</span>
                            <span className="sp-wilaya-name">{w.nom}</span>
                          </div>
                        ))}
                      </div>
                      {selectedWilayas.length > 0 && (
                        <button className="sp-filter-reset" onClick={() => setSelectedWilayas([])}>
                          Tout désélectionner
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Spécialité */}
              {tab === 'doctors' && (
                <div className="sp-filter-card">
                  <div className="sp-filter-header" onClick={() => toggleSection('spec')}>
                    <span className="sp-filter-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sp-filter-title-icon"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      Spécialité
                      {selectedSpecs.length > 0 && <span className="sp-filter-badge">{selectedSpecs.length}</span>}
                    </span>
                    <span className={`sp-filter-arrow${openSections.spec ? ' open' : ''}`}>▾</span>
                  </div>
                  {openSections.spec && (
                    <>
                      <div className="sp-filter-divider" />
                      <div className="sp-filter-body">
                        <input
                          className="sp-filter-search-input"
                          placeholder="Rechercher une spécialité..."
                          value={specSearch}
                          onChange={e => setSpecSearch(e.target.value)}
                        />
                        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                          {filteredSpecs ? (
                            filteredSpecs.length === 0
                              ? <p style={{ fontSize: 12, color: 'var(--slate-light)', textAlign: 'center', padding: '12px 0' }}>Aucun résultat</p>
                              : filteredSpecs.map(s => (
                                <div key={s} className={`sp-spec-opt${selectedSpecs.includes(s) ? ' sel' : ''}`} onClick={() => toggleSpec(s)}>
                                  <input type="checkbox" checked={selectedSpecs.includes(s)} readOnly />
                                  <span className="sp-spec-opt-label">{s}</span>
                                </div>
                              ))
                          ) : (
                            Object.entries(SPECIALITES_GROUPED).map(([group, specs]) => (
                              <div key={group}>
                                <div className="sp-spec-group-label">{group}</div>
                                {specs.map(s => (
                                  <div key={s} className={`sp-spec-opt${selectedSpecs.includes(s) ? ' sel' : ''}`} onClick={() => toggleSpec(s)}>
                                    <input type="checkbox" checked={selectedSpecs.includes(s)} readOnly />
                                    <span className="sp-spec-opt-label">{s}</span>
                                  </div>
                                ))}
                              </div>
                            ))
                          )}
                        </div>
                        {selectedSpecs.length > 0 && (
                          <button className="sp-filter-reset" onClick={() => setSelectedSpecs([])}>
                            Tout désélectionner
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tarif de consultation */}
              {tab === 'doctors' && (
                <div className="sp-filter-card">
                  <div className="sp-filter-header" onClick={() => toggleSection('price')}>
                    <span className="sp-filter-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sp-filter-title-icon"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      Tarif de consultation
                      {priceRange > 0 && <span className="sp-filter-badge">1</span>}
                    </span>
                    <span className={`sp-filter-arrow${openSections.price ? ' open' : ''}`}>▾</span>
                  </div>
                  {openSections.price && (
                    <>
                      <div className="sp-filter-divider" />
                      <div className="sp-filter-body">
                        {PRICE_RANGES.map((r, i) => (
                          <div key={i} className={`sp-price-opt${priceRange === i ? ' sel' : ''}`} onClick={() => setPriceRange(i)}>
                            <input type="radio" name="price" checked={priceRange === i} readOnly />
                            <span className="sp-price-opt-label">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Reset all */}
              {activeFilters.length > 0 && (
                <button className="sp-reset-all-btn" onClick={resetAll}>
                  Réinitialiser tous les filtres
                </button>
              )}

            </div>
          </aside>

          {/* ── RÉSULTATS ── */}
          <div className="sp-main">

            {/* Tabs */}
            <div className="sp-tabs">
              <button className={`sp-tab${tab === 'doctors' ? ' active' : ''}`} onClick={() => setTab('doctors')}>
                <span className="sp-tab-icon">🩺</span> Médecins
              </button>
              <button className={`sp-tab${tab === 'labs' ? ' active' : ''}`} onClick={() => setTab('labs')}>
                <span className="sp-tab-icon">🔬</span> Laboratoires
              </button>
            </div>

            {/* Header */}
            <div className="sp-results-head">
              <p className="sp-results-count">
                <strong>{total}</strong> {tab === 'doctors' ? 'médecin' : 'laboratoire'}{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
                {selectedSpecs.length > 0 && <> · {selectedSpecs.join(', ')}</>}
                {selectedWilayas.length > 0 && <> · {selectedWilayas.join(', ')}</>}
              </p>
              {tab === 'doctors' && (
                <div className="sp-sort-wrap">
                  <span className="sp-sort-label">Trier par :</span>
                  <select className="sp-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Content */}
            {loading ? (
              <div className="sp-spinner" />
            ) : tab === 'doctors' ? (
              doctors.length === 0 ? (
                <div className="sp-empty">
                  <div className="sp-empty-icon">🔍</div>
                  <h3>Aucun médecin trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                  <div className="sp-suggest-title">Spécialités populaires</div>
                  <div className="sp-suggest-chips">
                    {['Médecin généraliste','Cardiologue','Pédiatre','Gynécologue','Dentiste'].map(s => (
                      <button key={s} className="sp-suggest-chip" onClick={() => { setSelectedSpecs([s]); setQuery(s); }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                doctors.map(doc => {
                  const slots = fakeSlots();
                  return (
                    <div key={doc.id} className="sp-card" onClick={() => navigate(`/medecin/${doc.id}`)}>
                      <div className="sp-card-avatar">{initials(doc)}</div>
                      <div className="sp-card-body">
                        <div className="sp-card-name">Dr. {doc.user?.firstName} {doc.user?.lastName}</div>
                        <div className="sp-card-spec">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          {doc.specialite}
                        </div>
                        <div className="sp-card-meta">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {doc.city ? `${doc.city}, ` : ''}{doc.wilaya}
                          <span className="sp-card-meta-dot" />
                          {doc.experienceYears || 0} ans d'expérience
                          {doc.ordreVerified && (
                            <>
                              <span className="sp-card-meta-dot" />
                              <span className="sp-card-verified">✓ Vérifié</span>
                            </>
                          )}
                        </div>
                        <div className="sp-card-tags">
                          {doc.languages?.split(',').map(l => <span key={l} className="sp-card-tag">{l.trim()}</span>)}
                          <span className="sp-card-tag">Cabinet</span>
                        </div>
                        <div className="sp-card-slots">
                          <span className="sp-slots-label">Prochains créneaux :</span>
                          {slots.map((s, i) => (
                            <div key={i} className="sp-slot" onClick={e => { e.stopPropagation(); navigate(`/medecin/${doc.id}`); }}>
                              {s.day} {s.time}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="sp-card-right">
                        <div className="sp-card-rating">
                          <span className="sp-stars">{starsStr(doc.ratingAvg)}</span>
                          <span className="sp-stars-count">({doc.ratingCount || 0})</span>
                        </div>
                        <div className="sp-card-price-block">
                          <div className="sp-card-price">{doc.consultationPrice?.toLocaleString('fr-DZ') || '—'} DA</div>
                          <div className="sp-card-price-sub">/ consultation</div>
                        </div>
                        {/* ── Bouton Favori ── */}
                        <HeartButton doctor={{
                          id: doc.id,
                          nom: `${doc.user?.firstName} ${doc.user?.lastName}`,
                          specialty: doc.specialite,
                          wilaya: doc.wilaya,
                          avatar: initials(doc),
                          color: '#2563eb',
                          disponible: true,
                        }} />
                        <button className="sp-rdv-btn" onClick={e => { e.stopPropagation(); navigate(`/medecin/${doc.id}`); }}>
                          Prendre RDV
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              labs.length === 0 ? (
                <div className="sp-empty">
                  <div className="sp-empty-icon">🔬</div>
                  <h3>Aucun laboratoire trouvé</h3>
                  <p>Essayez une autre wilaya</p>
                </div>
              ) : labs.map(lab => (
                <div key={lab.id} className="sp-lab-card">
                  <div className="sp-lab-icon">🔬</div>
                  <div style={{ flex: 1 }}>
                    <div className="sp-lab-name">{lab.name}</div>
                    <div className="sp-lab-addr">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {lab.city ? `${lab.city}, ` : ''}{lab.wilaya}{lab.address ? ` — ${lab.address}` : ''}
                    </div>
                    {lab.analyses && (
                      <div className="sp-lab-tags">
                        {lab.analyses.split(',').slice(0, 5).map(a => <span key={a} className="sp-lab-tag">{a.trim()}</span>)}
                        {lab.analyses.split(',').length > 5 && <span className="sp-lab-tag">+{lab.analyses.split(',').length - 5}</span>}
                      </div>
                    )}
                    {lab.openingHours && (
                      <div className="sp-lab-hours">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {lab.openingHours}
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, paddingLeft:8, borderLeft:'1px solid var(--border)' }}>
                    {(lab.user?.phone || lab.phone) && (
                      <span className="sp-lab-phone">📞 {lab.user?.phone || lab.phone}</span>
                    )}
                    <button className="sp-contact-btn">Contacter</button>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="sp-pager">
                <button className="sp-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="sp-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : page + i - 3;
                  if (p < 1 || p > totalPages) return null;
                  return <button key={p} className={`sp-page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
                })}
                <button className="sp-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="sp-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
