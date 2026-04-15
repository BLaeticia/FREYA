import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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

  useEffect(() => {
    api.get(`/laboratory/${id}`)
      .then(r => setLab(r.data))
      .catch(() => setLab(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={s.loader}>Chargement...</div>;
  if (!lab) return <div style={s.loader}>Laboratoire introuvable</div>;

  const currentCat = ANALYSES[tab];

  return (
    <div style={s.root}>
      <nav style={s.navbar}>
        <div style={s.navInner}>
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
          </div>
        </div>
      </section>

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
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}