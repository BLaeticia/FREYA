import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const specialties = [
  { icon: '🫀', name: 'Cardiologue' },
  { icon: '🧠', name: 'Neurologue' },
  { icon: '👶', name: 'Pédiatre' },
  { icon: '👁️', name: 'Ophtalmologue' },
  { icon: '🦷', name: 'Dentiste' },
  { icon: '🩺', name: 'Généraliste' },
  { icon: '🦴', name: 'Orthopédiste' },
  { icon: '🧬', name: 'Dermatologue' },
  { icon: '🤰', name: 'Gynécologue' },
  { icon: '👂', name: 'ORL' },
];

const wilayas = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tlemcen', 'Sétif', 'Batna', 'Béjaïa', 'Tizi Ouzou'];

const features = [
  {
    icon: '📅',
    title: 'Prenez RDV en ligne',
    desc: 'Réservez une consultation en quelques clics, 24h/24 et 7j/7, sans attente téléphonique.',
    color: '#0D9488',
    bg: '#CCFBF1',
  },
  {
    icon: '💬',
    title: 'Messagerie sécurisée',
    desc: 'Échangez directement avec votre médecin et recevez des conseils personnalisés.',
    color: '#10B981',
    bg: '#DCFCE7',
  },
  {
    icon: '📄',
    title: 'Dossier médical',
    desc: 'Accédez à vos ordonnances, résultats et historique médical en un seul endroit.',
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  {
    icon: '🔔',
    title: 'Rappels automatiques',
    desc: 'Recevez des rappels pour ne jamais manquer un rendez-vous important.',
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
];

const stats = [
  { number: '500+', label: 'Médecins inscrits' },
  { number: '48', label: 'Wilayas couvertes' },
  { number: '10K+', label: 'Patients satisfaits' },
  { number: '24/7', label: 'Disponible' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [wilaya, setWilaya] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/doctors');
  };

  return (
    <div style={s.root}>
      {/* NAVBAR */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
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
            <Link to="/register" style={s.registerBtn}>S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroShape1} />
        <div style={s.heroShape2} />
        <div style={s.heroContent}>
          <div style={s.heroBadge}>🇩🇿 La plateforme médicale algérienne</div>
          <h1 style={s.heroTitle}>
            Vivez en<br />
            <span style={s.heroAccent}>meilleure santé</span>
          </h1>
          <p style={s.heroSubtitle}>
            Trouvez un médecin, prenez rendez-vous en ligne et gérez<br />
            votre santé — partout en Algérie.
          </p>

          {/* Search Bar */}
          <div style={s.searchBar}>
            <div style={s.searchField}>
              <span style={s.searchIcon}>🔍</span>
              <input
                style={s.searchInput}
                placeholder="Nom, spécialité, établissement..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={s.searchDivider} />
            <div style={s.searchField}>
              <span style={s.searchIcon}>📍</span>
              <select
                style={s.searchSelect}
                value={wilaya}
                onChange={e => setWilaya(e.target.value)}
              >
                <option value="">Wilaya ?</option>
                {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <button style={s.searchBtn} onClick={handleSearch}>
              Rechercher →
            </button>
          </div>

          {/* Quick searches */}
          <div style={s.quickSearch}>
            <span style={s.quickLabel}>Recherches fréquentes :</span>
            {['Généraliste', 'Cardiologue', 'Pédiatre', 'Dentiste'].map(sp => (
              <button key={sp} style={s.quickBtn} onClick={handleSearch}>{sp}</button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={s.statsSection}>
        <div style={s.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} style={s.statItem}>
              <div style={s.statNumber}>{stat.number}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALTIES */}
      <section id="specialties" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Consultez par spécialité</h2>
            <p style={s.sectionSub}>Trouvez le spécialiste qu'il vous faut parmi nos médecins qualifiés</p>
          </div>
          <div style={s.specialtiesGrid}>
            {specialties.map((sp, i) => (
              <button key={i} style={s.specialtyCard} onClick={handleSearch}>
                <span style={s.specialtyIcon}>{sp.icon}</span>
                <span style={s.specialtyName}>{sp.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ ...s.section, backgroundColor: '#F8FAFC' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Votre compagnon de santé au quotidien</h2>
            <p style={s.sectionSub}>Tout ce dont vous avez besoin pour gérer votre santé en un seul endroit</p>
          </div>
          <div style={s.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} style={s.featureCard}>
                <div style={{ ...s.featureIconBox, backgroundColor: f.bg }}>
                  <span style={s.featureEmoji}>{f.icon}</span>
                </div>
                <h3 style={{ ...s.featureTitle, color: f.color }}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaShape} />
        <div style={s.ctaContent}>
          <h2 style={s.ctaTitle}>Prêt à prendre soin de votre santé ?</h2>
          <p style={s.ctaSub}>Rejoignez des milliers de patients et médecins qui font confiance à Freya</p>
          <div style={s.ctaButtons}>
            <Link to="/register" style={s.ctaBtnPrimary}>Créer un compte gratuit →</Link>
            <Link to="/login" style={s.ctaBtnSecondary}>Se connecter</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerLogo}>
            Frey<span style={{ color: '#0D9488' }}>a</span>
            <p style={s.footerTagline}>Plateforme médicale Algérie</p>
          </div>
          <div style={s.footerLinks}>
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Plateforme</div>
              <a style={s.footerLink} href="#features">Fonctionnalités</a>
              <a style={s.footerLink} href="#specialties">Spécialités</a>
              <Link style={s.footerLink} to="/login">Connexion</Link>
              <Link style={s.footerLink} to="/register">Inscription</Link>
            </div>
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Médecins</div>
              <a style={s.footerLink} href="#">Rejoindre Freya</a>
              <a style={s.footerLink} href="#">Gestion agenda</a>
              <a style={s.footerLink} href="#">Téléconsultation</a>
            </div>
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Support</div>
              <a style={s.footerLink} href="#">Centre d'aide</a>
              <a style={s.footerLink} href="#">Nous contacter</a>
              <a style={s.footerLink} href="#">CGU</a>
            </div>
          </div>
        </div>
        <div style={s.footerBottom}>
          <span>© 2026 Freya — Plateforme médicale Algérie. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
}

const s = {
  root: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", backgroundColor: '#fff' },

  // NAVBAR
  navbar: {
    position: 'sticky', top: 0, zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #E2E8F0',
    padding: '0 40px',
  },
  navInner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', alignItems: 'center', height: '64px', gap: '32px',
  },
  logo: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', flexShrink: 0 },
  navLinks: { display: 'flex', gap: '28px', flex: 1 },
  navLink: { fontSize: '14px', color: '#64748B', textDecoration: 'none', fontWeight: '500' },
  navActions: { display: 'flex', gap: '10px', flexShrink: 0 },
  loginBtn: {
    padding: '8px 18px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', color: '#0D9488', textDecoration: 'none',
    border: '1.5px solid #0D9488',
  },
  registerBtn: {
    padding: '8px 18px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', color: '#fff', textDecoration: 'none',
    backgroundColor: '#0D9488',
  },

  // HERO
  hero: {
    background: 'linear-gradient(160deg, #065a50 0%, #0D9488 40%, #2DD4BF 100%)',
    padding: '80px 40px 100px',
    position: 'relative', overflow: 'hidden',
  },
  heroShape1: {
    position: 'absolute', top: '-60px', right: '-60px',
    width: '400px', height: '400px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroShape2: {
    position: 'absolute', bottom: '-80px', left: '20%',
    width: '500px', height: '300px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroContent: { maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },
  heroBadge: {
    display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff', padding: '6px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600', marginBottom: '20px',
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    fontSize: '56px', fontWeight: '800', color: '#fff',
    letterSpacing: '-2px', lineHeight: '1.1', marginBottom: '20px',
  },
  heroAccent: { color: '#FCD34D' },
  heroSubtitle: {
    fontSize: '18px', color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.6', marginBottom: '36px',
  },

  // SEARCH
  searchBar: {
    backgroundColor: '#fff', borderRadius: '16px',
    display: 'flex', alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    overflow: 'hidden', maxWidth: '700px',
  },
  searchField: { display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px' },
  searchIcon: { fontSize: '18px', marginRight: '10px', flexShrink: 0 },
  searchInput: {
    border: 'none', outline: 'none', fontSize: '15px',
    color: '#0F172A', width: '100%', padding: '18px 0', backgroundColor: 'transparent',
  },
  searchSelect: {
    border: 'none', outline: 'none', fontSize: '15px',
    color: '#0F172A', width: '100%', padding: '18px 0', backgroundColor: 'transparent', cursor: 'pointer',
  },
  searchDivider: { width: '1px', height: '40px', backgroundColor: '#E2E8F0', flexShrink: 0 },
  searchBtn: {
    backgroundColor: '#0F172A', color: '#fff', border: 'none',
    padding: '18px 28px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
  },
  quickSearch: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' },
  quickLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.7)' },
  quickBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px',
    padding: '5px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '500',
  },

  // STATS
  statsSection: {
    backgroundColor: '#0F172A', padding: '32px 40px',
  },
  statsGrid: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
  },
  statItem: { textAlign: 'center', padding: '16px' },
  statNumber: { fontSize: '36px', fontWeight: '800', color: '#2DD4BF', letterSpacing: '-1px' },
  statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' },

  // SECTIONS
  section: { padding: '80px 40px' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '48px' },
  sectionTitle: { fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1px', marginBottom: '12px' },
  sectionSub: { fontSize: '16px', color: '#64748B' },

  // SPECIALTIES
  specialtiesGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px',
  },
  specialtyCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
    padding: '20px 16px', borderRadius: '16px', border: '1.5px solid #E2E8F0',
    cursor: 'pointer', backgroundColor: '#fff', transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  specialtyIcon: { fontSize: '32px' },
  specialtyName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },

  // FEATURES
  featuresGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
  },
  featureCard: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '28px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0',
  },
  featureIconBox: {
    width: '56px', height: '56px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '16px',
  },
  featureEmoji: { fontSize: '26px' },
  featureTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '10px' },
  featureDesc: { fontSize: '14px', color: '#64748B', lineHeight: '1.6' },

  // CTA
  ctaSection: {
    background: 'linear-gradient(135deg, #0D9488 0%, #065a50 100%)',
    padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  ctaShape: {
    position: 'absolute', top: '-80px', right: '-80px',
    width: '300px', height: '300px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ctaContent: { position: 'relative', zIndex: 1 },
  ctaTitle: { fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-1px', marginBottom: '12px' },
  ctaSub: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' },
  ctaButtons: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnPrimary: {
    backgroundColor: '#fff', color: '#0D9488', padding: '14px 28px',
    borderRadius: '12px', fontSize: '15px', fontWeight: '700', textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
  },
  ctaBtnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
    padding: '14px 28px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '600', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)',
  },

  // FOOTER
  footer: { backgroundColor: '#0F172A', padding: '60px 40px 0' },
  footerInner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', gap: '60px', paddingBottom: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  footerLogo: { fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' },
  footerTagline: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontWeight: '400' },
  footerLinks: { display: 'flex', gap: '60px', flex: 1, justifyContent: 'flex-end' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerColTitle: { fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' },
  footerLink: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' },
  footerBottom: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '20px 0', fontSize: '13px', color: 'rgba(255,255,255,0.3)',
  },
};
