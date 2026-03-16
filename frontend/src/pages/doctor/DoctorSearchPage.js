import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartButton } from '../../components/FavorisWidget';

const doctors = [
  { id: 1, name: 'Dr. Amira Benali', specialty: 'Cardiologue', address: '12 Rue Didouche Mourad, Alger Centre', wilaya: 'Alger', rating: 4.9, reviews: 128, avatar: 'AB', color: '#0D9488', sector: 'Conventionné', video: true, nextSlots: ["Aujourd'hui 14h00", 'Demain 09h30', 'Demain 11h00'], available: true },
  { id: 2, name: 'Dr. Karim Meziane', specialty: 'Médecin généraliste', address: '5 Bd Krim Belkacem, Alger', wilaya: 'Alger', rating: 4.7, reviews: 245, avatar: 'KM', color: '#10B981', sector: 'Conventionné', video: true, nextSlots: ['Demain 10h00', 'Jeudi 14h30'], available: true },
  { id: 3, name: 'Dr. Sonia Hadj', specialty: 'Dermatologue', address: '8 Rue Ben Mehidi, Alger', wilaya: 'Alger', rating: 4.8, reviews: 89, avatar: 'SH', color: '#8B5CF6', sector: 'Non conventionné', video: false, nextSlots: ['Jeudi 09h00', 'Vendredi 15h00'], available: true },
  { id: 4, name: 'Dr. Yacine Bouali', specialty: 'Pédiatre', address: '3 Rue Hassiba Ben Bouali, Alger', wilaya: 'Alger', rating: 4.9, reviews: 312, avatar: 'YB', color: '#F59E0B', sector: 'Conventionné', video: true, nextSlots: ["Aujourd'hui 16h00", 'Demain 08h30'], available: true },
  { id: 5, name: 'Dr. Nadia Ferhat', specialty: 'Gynécologue', address: "22 Avenue de l'ALN, Alger", wilaya: 'Alger', rating: 4.6, reviews: 176, avatar: 'NF', color: '#EC4899', sector: 'Conventionné', video: false, nextSlots: ['Lundi 10h00', 'Lundi 14h00'], available: false },
  { id: 6, name: 'Dr. Omar Bensalem', specialty: 'Ophtalmologue', address: '7 Rue Pasteur, Oran', wilaya: 'Oran', rating: 4.8, reviews: 203, avatar: 'OB', color: '#06B6D4', sector: 'Conventionné', video: false, nextSlots: ['Mercredi 09h00', 'Jeudi 11h30'], available: true },
];

const specialties = ['Toutes', 'Généraliste', 'Cardiologue', 'Dermatologue', 'Pédiatre', 'Gynécologue', 'Ophtalmologue'];
const wilayas = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tlemcen'];

export default function DoctorSearchPage() {
  const [search, setSearch] = useState('Médecin généraliste');
  const [wilaya, setWilaya] = useState('Alger');
  const [specialty, setSpecialty] = useState('Toutes');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const filtered = doctors.filter(d => {
    if (!d.name) return false; // sécurité
    if (specialty !== 'Toutes' && !d.specialty.includes(specialty)) return false;
    if (wilaya !== 'Toutes' && d.wilaya !== wilaya) return false;
    if (onlyAvailable && !d.available) return false;
    if (onlyVideo && !d.video) return false;
    return true;
  });

  const styles = {
    root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", backgroundColor: '#F0F4F8', minHeight: '100vh' },
    navbar: { backgroundColor: '#0D9488', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 },
    navInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '64px', gap: '24px' },
    logo: { fontSize: '24px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', flexShrink: 0, textDecoration: 'none' },
    logoAccent: { color: '#FCD34D' },
    navSearch: { flex: 1, display: 'flex', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', maxWidth: '600px' },
    navSearchField: { display: 'flex', alignItems: 'center', flex: 1, padding: '0 14px' },
    navSearchIcon: { fontSize: '16px', marginRight: '8px', flexShrink: 0 },
    navSearchInput: { border: 'none', outline: 'none', fontSize: '14px', color: '#0F172A', width: '100%', padding: '10px 0', backgroundColor: 'transparent' },
    navSearchDivider: { width: '1px', height: '30px', backgroundColor: '#E2E8F0' },
    navSearchSelect: { border: 'none', outline: 'none', fontSize: '14px', color: '#0F172A', padding: '10px 12px', backgroundColor: 'transparent', cursor: 'pointer' },
    navSearchBtn: { backgroundColor: '#0F172A', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    navActions: { display: 'flex', gap: '10px', flexShrink: 0, marginLeft: 'auto' },
    navBtn: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff', backgroundColor: 'transparent', textDecoration: 'none' },
    navBtnPrimary: { padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', color: '#0D9488', backgroundColor: '#fff', textDecoration: 'none' },
    filtersBar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', padding: '12px 40px' },
    filtersInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
    filterBtn: (active) => ({ padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: `1.5px solid ${active ? '#0D9488' : '#E2E8F0'}`, color: active ? '#0D9488' : '#64748B', backgroundColor: active ? '#F0F9F8' : '#fff', display: 'flex', alignItems: 'center', gap: '6px' }),
    mapBtn: { marginLeft: 'auto', padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1.5px solid #0D9488', color: '#0D9488', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '6px' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '24px 40px' },
    resultsHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
    resultsCount: { fontSize: '20px', fontWeight: '700', color: '#0F172A' },
    resultsDesc: { fontSize: '14px', color: '#64748B', marginBottom: '20px' },
    specialtyPills: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
    pill: (active) => ({ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: `1.5px solid ${active ? '#0D9488' : '#E2E8F0'}`, color: active ? '#fff' : '#64748B', backgroundColor: active ? '#0D9488' : '#fff' }),
    doctorCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'flex', gap: '20px' },
    doctorAvatar: (color) => ({ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: color + '20', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0, border: `2px solid ${color}30` }),
    doctorInfo: { flex: 1 },
    doctorName: { fontSize: '17px', fontWeight: '700', color: '#0D9488', marginBottom: '2px' },
    doctorSpec: { fontSize: '14px', color: '#0F172A', fontWeight: '500', marginBottom: '8px' },
    doctorMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' },
    metaItem: { fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' },
    badges: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
    badge: (color, bg) => ({ fontSize: '11px', fontWeight: '600', color, backgroundColor: bg, padding: '3px 10px', borderRadius: '20px' }),
    rating: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#F59E0B', fontWeight: '600' },
    slotsSection: { borderLeft: '1px solid #E2E8F0', paddingLeft: '20px', minWidth: '240px', flexShrink: 0 },
    slotsTitle: { fontSize: '12px', color: '#64748B', marginBottom: '10px', fontWeight: '600' },
    slotsGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
    slotBtn: { padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', backgroundColor: '#F0F9F8', color: '#0D9488', textAlign: 'center' },
    rdvBtn: { width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none', backgroundColor: '#0D9488', color: '#fff', marginTop: '8px' },
    noSlots: { padding: '12px', backgroundColor: '#FEF3C7', borderRadius: '10px', fontSize: '13px', color: '#D97706', fontWeight: '500', textAlign: 'center' },
  };

  return (
    <div style={styles.root}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <Link to="/" style={styles.logo}>Frey<span style={styles.logoAccent}>a</span></Link>
          <div style={styles.navSearch}>
            <div style={styles.navSearchField}>
              <span style={styles.navSearchIcon}>🔍</span>
              <input style={styles.navSearchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Spécialité, médecin..." />
            </div>
            <div style={styles.navSearchDivider} />
            <div style={styles.navSearchField}>
              <span style={styles.navSearchIcon}>📍</span>
              <select style={styles.navSearchSelect} value={wilaya} onChange={e => setWilaya(e.target.value)}>
                {wilayas.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
            <button style={styles.navSearchBtn}>Rechercher</button>
          </div>
          <div style={styles.navActions}>
            <Link to="/login" style={styles.navBtn}>Se connecter</Link>
            <Link to="/register" style={styles.navBtnPrimary}>S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* FILTERS BAR */}
      <div style={styles.filtersBar}>
        <div style={styles.filtersInner}>
          <button style={styles.filterBtn(onlyAvailable)} onClick={() => setOnlyAvailable(!onlyAvailable)}>📅 Disponibilités</button>
          <button style={styles.filterBtn(onlyVideo)} onClick={() => setOnlyVideo(!onlyVideo)}>📹 Téléconsultation</button>
          <button style={styles.filterBtn(false)}>💰 Secteur</button>
          <button style={styles.filterBtn(false)}>⚙️ Plus de filtres</button>
          <button style={styles.mapBtn} onClick={() => setShowMap(!showMap)}>🗺️ {showMap ? 'Masquer' : 'Afficher'} la carte</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* Specialty pills */}
        <div style={styles.specialtyPills}>
          {specialties.map(sp => (
            <button key={sp} style={styles.pill(specialty === sp)} onClick={() => setSpecialty(sp)}>{sp}</button>
          ))}
        </div>

        <div style={styles.resultsHeader}>
          <div style={styles.resultsCount}>{filtered.length} résultats</div>
        </div>
        <div style={styles.resultsDesc}>
          Prenez rendez-vous en ligne avec un médecin disponible à {wilaya === 'Toutes' ? "travers l'Algérie" : wilaya}
        </div>

        {/* Doctor Cards */}
        {filtered.map(doc => (
          <div key={doc.id} style={styles.doctorCard}>
            <div style={styles.doctorAvatar(doc.color)}>{doc.avatar}</div>
            <div style={styles.doctorInfo}>
              <div style={styles.doctorName}>{doc.name}</div>
              <div style={styles.doctorSpec}>{doc.specialty}</div>
              <div style={styles.doctorMeta}>
                <span style={styles.metaItem}>📍 {doc.address}</span>
                <span style={styles.rating}>⭐ {doc.rating} <span style={{ color: '#64748B', fontWeight: '400' }}>({doc.reviews} avis)</span></span>
              </div>
              <div style={styles.badges}>
                <span style={styles.badge('#16A34A', '#DCFCE7')}>💶 {doc.sector}</span>
                {doc.video && <span style={styles.badge('#0D9488', '#CCFBF1')}>📹 Téléconsultation</span>}
                <span style={styles.badge('#8B5CF6', '#EDE9FE')}>📍 {doc.wilaya}</span>
                {/* ── Bouton Favori ── */}
                <HeartButton doctor={{
                  id: doc.id,
                  nom: doc.name,
                  specialty: doc.specialty,
                  wilaya: doc.wilaya,
                  avatar: doc.avatar,
                  color: doc.color,
                  disponible: doc.available,
                }} />
              </div>
            </div>

            {/* Slots */}
            <div style={styles.slotsSection}>
              {doc.available ? (
                <>
                  <div style={styles.slotsTitle}>Prochaine disponibilité</div>
                  <div style={styles.slotsGrid}>
                    {doc.nextSlots.slice(0, 2).map((slot, i) => (
                      <button key={i} style={styles.slotBtn} onClick={() => navigate('/login')}>🕐 {slot}</button>
                    ))}
                  </div>
                  <button style={styles.rdvBtn} onClick={() => navigate('/login')}>Prendre rendez-vous →</button>
                </>
              ) : (
                <div style={styles.noSlots}>⏳ Pas de disponibilité<br />prochainement</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}