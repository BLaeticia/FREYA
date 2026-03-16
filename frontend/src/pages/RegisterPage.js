import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    password: '', confirm_password: '', phone: '',
    wilaya: '', gender: '',
  });
  const navigate = useNavigate();

  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tlemcen',
    'Sétif', 'Batna', 'Béjaïa', 'Tizi Ouzou', 'Bordj Bou Arréridj',
    'Médéa', 'Mostaganem', 'Chlef', 'Skikda', 'Biskra', 'Djelfa',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await authAPI.registerPatient({ ...form, role });
      toast.success('Compte créé avec succès !');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #0E4D6E 50%, #065a50 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: '20px', position: 'relative', overflow: 'hidden',
    },
    shape1: {
      position: 'absolute', top: '-100px', right: '-100px',
      width: '400px', height: '400px', borderRadius: '50%',
      background: 'rgba(56,189,248,0.08)', pointerEvents: 'none',
    },
    shape2: {
      position: 'absolute', bottom: '-80px', left: '-80px',
      width: '300px', height: '300px', borderRadius: '50%',
      background: 'rgba(16,185,129,0.08)', pointerEvents: 'none',
    },
    container: {
      width: '100%', maxWidth: '480px',
      position: 'relative', zIndex: 1,
    },
    logoArea: { textAlign: 'center', marginBottom: '28px' },
    logo: { fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-1px' },
    logoAccent: { color: '#2DD4BF' },
    logoSub: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' },
    card: {
      backgroundColor: '#fff', borderRadius: '24px', padding: '36px',
      boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
    },

    // Step indicator
    steps: { display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '8px' },
    stepDot: (active, done) => ({
      width: '32px', height: '32px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: '700', flexShrink: 0,
      backgroundColor: done ? '#10B981' : active ? '#0D9488' : '#F1F5F9',
      color: done || active ? '#fff' : '#94A3B8',
    }),
    stepLine: (done) => ({
      flex: 1, height: '2px',
      backgroundColor: done ? '#10B981' : '#E2E8F0',
    }),
    stepLabel: (active) => ({
      fontSize: '11px', color: active ? '#0D9488' : '#94A3B8',
      fontWeight: active ? '600' : '400', textAlign: 'center',
    }),

    title: { fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' },
    subtitle: { fontSize: '14px', color: '#64748B', marginBottom: '24px' },

    // Role cards
    roleCards: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
    roleCard: (selected) => ({
      padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
      border: `2px solid ${selected ? '#0D9488' : '#E2E8F0'}`,
      backgroundColor: selected ? '#F0F9F8' : '#fff',
      display: 'flex', alignItems: 'center', gap: '14px',
      transition: 'all 0.2s',
    }),
    roleIcon: {
      width: '44px', height: '44px', borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22px', flexShrink: 0,
    },
    roleName: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
    roleDesc: { fontSize: '13px', color: '#64748B' },
    roleCheck: (selected) => ({
      marginLeft: 'auto', width: '22px', height: '22px', borderRadius: '50%',
      border: `2px solid ${selected ? '#0D9488' : '#E2E8F0'}`,
      backgroundColor: selected ? '#0D9488' : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '12px', flexShrink: 0,
    }),

    // Form
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
    formGroup: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '6px' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '14px', fontSize: '15px', pointerEvents: 'none' },
    input: {
      width: '100%', padding: '11px 14px 11px 40px',
      borderRadius: '10px', border: '1.5px solid #E2E8F0',
      fontSize: '14px', color: '#0F172A', outline: 'none',
      backgroundColor: '#F8FAFC', boxSizing: 'border-box',
    },
    select: {
      width: '100%', padding: '11px 14px 11px 40px',
      borderRadius: '10px', border: '1.5px solid #E2E8F0',
      fontSize: '14px', color: '#0F172A', outline: 'none',
      backgroundColor: '#F8FAFC', boxSizing: 'border-box', cursor: 'pointer',
    },

    // Buttons
    nextBtn: {
      width: '100%', padding: '13px',
      background: 'linear-gradient(135deg, #0D9488, #065a50)',
      color: '#fff', border: 'none', borderRadius: '12px',
      fontSize: '15px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(14,165,233,0.35)',
      marginTop: '8px',
    },
    backBtn: {
      width: '100%', padding: '11px',
      backgroundColor: '#F1F5F9', color: '#64748B',
      border: 'none', borderRadius: '12px',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      marginTop: '8px',
    },
    benefits: {
      backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '14px 16px',
      marginBottom: '20px', border: '1px solid #DCFCE7',
    },
    benefitItem: { fontSize: '13px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
    loginText: { textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '16px' },
    loginLink: { color: '#0D9488', fontWeight: '700', textDecoration: 'none' },
  };

  const roles = [
    { id: 'patient', icon: '🧑', label: 'Patient', desc: 'Je cherche un médecin et prends des RDV', bg: '#F0F9F8' },
    { id: 'doctor', icon: '👨‍⚕️', label: 'Médecin', desc: 'Je gère mon cabinet et mes patients', bg: '#F0FDF4' },
  ];

  return (
    <div style={s.root}>
      <div style={s.shape1} />
      <div style={s.shape2} />

      <div style={s.container}>
        <div style={s.logoArea}>
          <div style={s.logo}>Frey<span style={s.logoAccent}>a</span></div>
          <div style={s.logoSub}>Plateforme médicale Algérie</div>
        </div>

        <div style={s.card}>
          {/* Step indicator */}
          <div style={s.steps}>
            <div style={s.stepDot(step === 1, step > 1)}>{step > 1 ? '✓' : '1'}</div>
            <div style={s.stepLine(step > 1)} />
            <div style={s.stepDot(step === 2, step > 2)}>{step > 2 ? '✓' : '2'}</div>
            <div style={s.stepLine(step > 2)} />
            <div style={s.stepDot(step === 3, false)}>3</div>
          </div>

          {/* STEP 1 — Choose role */}
          {step === 1 && (
            <>
              <div style={s.title}>Bienvenue sur Freya 👋</div>
              <div style={s.subtitle}>Inscrivez-vous ou connectez-vous pour continuer</div>

              <div style={s.benefits}>
                {[
                  '📅 Prenez des rendez-vous facilement',
                  '💬 Envoyez des messages à vos soignants',
                  '❤️ Suivez l\'évolution de votre santé',
                ].map((b, i) => (
                  <div key={i} style={s.benefitItem}><span>✅</span> {b}</div>
                ))}
              </div>

              <div style={s.roleCards}>
                {roles.map(r => (
                  <div key={r.id} style={s.roleCard(role === r.id)} onClick={() => setRole(r.id)}>
                    <div style={{ ...s.roleIcon, backgroundColor: r.bg }}>{r.icon}</div>
                    <div>
                      <div style={s.roleName}>{r.label}</div>
                      <div style={s.roleDesc}>{r.desc}</div>
                    </div>
                    <div style={s.roleCheck(role === r.id)}>{role === r.id ? '✓' : ''}</div>
                  </div>
                ))}
              </div>

              <button
                style={{ ...s.nextBtn, opacity: role ? 1 : 0.5 }}
                disabled={!role}
                onClick={() => setStep(2)}
              >
                S'INSCRIRE →
              </button>

              <div style={s.loginText}>
                Vous avez déjà un compte ?{' '}
                <Link to="/login" style={s.loginLink}>SE CONNECTER</Link>
              </div>
            </>
          )}

          {/* STEP 2 — Personal info */}
          {step === 2 && (
            <>
              <div style={s.title}>Informations personnelles</div>
              <div style={s.subtitle}>Dites-nous en plus sur vous</div>

              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>PRÉNOM</label>
                  <div style={s.inputWrap}>
                    <span style={s.icon}>👤</span>
                    <input style={s.input} placeholder="Sara" value={form.first_name}
                      onChange={e => setForm({ ...form, first_name: e.target.value })} required />
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>NOM</label>
                  <div style={s.inputWrap}>
                    <span style={s.icon}>👤</span>
                    <input style={s.input} placeholder="Amine" value={form.last_name}
                      onChange={e => setForm({ ...form, last_name: e.target.value })} required />
                  </div>
                </div>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>TÉLÉPHONE</label>
                <div style={s.inputWrap}>
                  <span style={s.icon}>📱</span>
                  <input style={s.input} placeholder="0555 123 456" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>WILAYA</label>
                  <div style={s.inputWrap}>
                    <span style={s.icon}>📍</span>
                    <select style={s.select} value={form.wilaya}
                      onChange={e => setForm({ ...form, wilaya: e.target.value })}>
                      <option value="">Choisir...</option>
                      {wilayas.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>GENRE</label>
                  <div style={s.inputWrap}>
                    <span style={s.icon}>⚧</span>
                    <select style={s.select} value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Choisir...</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>
                </div>
              </div>

              <button style={s.nextBtn} onClick={() => setStep(3)}>
                Continuer →
              </button>
              <button style={s.backBtn} onClick={() => setStep(1)}>
                ← Retour
              </button>
            </>
          )}

          {/* STEP 3 — Email & password */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={s.title}>Créer votre compte</div>
              <div style={s.subtitle}>Choisissez vos identifiants de connexion</div>

              <div style={s.formGroup}>
                <label style={s.label}>EMAIL</label>
                <div style={s.inputWrap}>
                  <span style={s.icon}>✉️</span>
                  <input style={s.input} type="email" placeholder="votre@email.dz"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>MOT DE PASSE</label>
                <div style={s.inputWrap}>
                  <span style={s.icon}>🔒</span>
                  <input style={s.input} type="password" placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>CONFIRMER LE MOT DE PASSE</label>
                <div style={s.inputWrap}>
                  <span style={s.icon}>🔒</span>
                  <input style={s.input} type="password" placeholder="••••••••"
                    value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })} required />
                </div>
              </div>

              <button type="submit" style={{ ...s.nextBtn, opacity: loading ? 0.8 : 1 }} disabled={loading}>
                {loading ? '⏳ Création...' : '🎉 Créer mon compte'}
              </button>
              <button type="button" style={s.backBtn} onClick={() => setStep(2)}>
                ← Retour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
