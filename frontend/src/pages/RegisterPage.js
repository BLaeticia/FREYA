import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Identifiant', 'Nom', 'Profil', 'Mot de passe', 'Téléphone'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showExistModal, setShowExistModal] = useState(false);
  const [form, setForm] = useState({
    identifier: '',
    first_name: '',
    last_name: '',
    birthDate: '',
    gender: '',
    password: '',
    phone: '',
  });
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 1) {
      if (form.identifier === 'test@gmail.com' || form.identifier === '0555555555') {
        setShowExistModal(true);
      } else {
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      email: form.identifier.includes('@') ? form.identifier : '',
      phone: form.phone || (form.identifier.includes('@') ? '' : form.identifier),
      firstName: form.first_name,
      lastName: form.last_name,
      password: form.password,
      birthDate: form.birthDate,
      gender: form.gender === 'F' ? 'female' : 'male',
      role: 'patient',
    };
    setLoading(true);
    try {
      await authAPI.registerPatient(dataToSend);
      toast.success('Inscription réussie ! Bienvenue sur Freya.');
      navigate('/login');
    } catch (err) {
      const errorDetail = err.response?.data?.error || err.response?.data?.message;
      toast.error(errorDetail || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'transparent', width: '0%' };
    if (password.length < 6) return { label: 'Faible', color: '#EF4444', width: '33%' };
    if (password.length < 10) return { label: 'Moyen', color: '#F59E0B', width: '66%' };
    return { label: 'Fort', color: '#10B981', width: '100%' };
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div style={s.root}>
      <style>{`
        * { box-sizing: border-box; }
        input:focus, select:focus { border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important; outline: none; background: #fff !important; }
        .btn-blue:hover { background: #1D4ED8 !important; }
        .btn-outline:hover { border-color: #2563EB !important; color: #2563EB !important; background: #EFF6FF !important; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <Link to="/" style={s.logo}>Freya</Link>
        <div style={s.headerRight}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={s.headerLink}>Se connecter</Link>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.card}>

          {/* Step indicator */}
          <div style={s.stepBar}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <React.Fragment key={n}>
                  <div style={s.stepItem}>
                    <div style={{
                      ...s.stepCircle,
                      backgroundColor: done ? '#2563EB' : active ? '#EFF6FF' : '#F1F5F9',
                      border: (done || active) ? '2px solid #2563EB' : '2px solid #E2E8F0',
                      color: done ? '#fff' : active ? '#2563EB' : '#94A3B8',
                    }}>
                      {done ? <CheckIcon /> : n}
                    </div>
                    <div style={{
                      ...s.stepLabel,
                      color: active ? '#2563EB' : done ? '#374151' : '#94A3B8',
                      fontWeight: active ? '600' : '400',
                    }}>{label}</div>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div style={{ ...s.stepLine, backgroundColor: n < step ? '#2563EB' : '#E2E8F0' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>

          {/* Back */}
          {step > 1 && (
            <button style={s.backBtn} onClick={() => setStep(step - 1)}>
              <ChevronLeft /> Étape précédente
            </button>
          )}

          {/* Step 1 — Identifiant */}
          {step === 1 && (
            <div>
              <div style={s.stepTitle}>Créer votre compte</div>
              <p style={s.stepSub}>Entrez votre email ou numéro de téléphone pour commencer</p>
              <div style={s.fieldGroup}>
                <label style={s.label}>Email ou numéro de téléphone</label>
                <input
                  style={s.input}
                  placeholder="votre@email.com ou 06XXXXXXXX"
                  value={form.identifier}
                  onChange={e => setForm({ ...form, identifier: e.target.value })}
                />
              </div>
              <button
                className="btn-blue"
                style={{ ...s.nextBtn, opacity: !form.identifier.trim() ? 0.6 : 1 }}
                onClick={handleNextStep}
                disabled={!form.identifier.trim()}
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 2 — Nom & Prénom */}
          {step === 2 && (
            <div>
              <div style={s.stepTitle}>Comment vous appelez-vous ?</div>
              <p style={s.stepSub}>Votre nom sera visible par vos médecins</p>
              <div style={s.row2}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Prénom</label>
                  <input style={s.input} placeholder="Sara" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Nom</label>
                  <input style={s.input} placeholder="Benali" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                </div>
              </div>
              <button
                className="btn-blue"
                style={{ ...s.nextBtn, opacity: !form.first_name || !form.last_name ? 0.6 : 1 }}
                onClick={() => setStep(3)}
                disabled={!form.first_name || !form.last_name}
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 3 — Profil */}
          {step === 3 && (
            <div>
              <div style={s.stepTitle}>Informations de profil</div>
              <p style={s.stepSub}>Ces informations aident vos soignants à mieux vous connaître</p>
              <div style={s.fieldGroup}>
                <label style={s.label}>Date de naissance</label>
                <input style={s.input} type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Sexe</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ val: 'F', label: 'Féminin' }, { val: 'M', label: 'Masculin' }].map(({ val, label }) => (
                    <button
                      key={val}
                      style={{
                        ...s.genderBtn,
                        borderColor: form.gender === val ? '#2563EB' : '#E2E8F0',
                        backgroundColor: form.gender === val ? '#EFF6FF' : '#fff',
                        color: form.gender === val ? '#2563EB' : '#374151',
                        fontWeight: form.gender === val ? '600' : '400',
                      }}
                      onClick={() => setForm({ ...form, gender: val })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="btn-blue"
                style={{ ...s.nextBtn, opacity: !form.gender ? 0.6 : 1 }}
                onClick={() => setStep(4)}
                disabled={!form.gender}
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 4 — Mot de passe */}
          {step === 4 && (
            <div>
              <div style={s.stepTitle}>Créez un mot de passe</div>
              <p style={s.stepSub}>Minimum 6 caractères, idéalement plus de 10 pour plus de sécurité</p>
              <div style={s.fieldGroup}>
                <label style={s.label}>Mot de passe</label>
                <input
                  style={s.input}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                {form.password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={s.strengthTrack}>
                      <div style={{ ...s.strengthFill, width: strength.width, backgroundColor: strength.color }} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: strength.color, marginTop: '5px' }}>
                      Sécurité : {strength.label}
                    </div>
                  </div>
                )}
              </div>
              <button
                className="btn-blue"
                style={{ ...s.nextBtn, opacity: form.password.length < 6 ? 0.6 : 1 }}
                onClick={() => setStep(5)}
                disabled={form.password.length < 6}
              >
                Continuer
              </button>
            </div>
          )}

          {/* Step 5 — Téléphone */}
          {step === 5 && (
            <div>
              <div style={s.stepTitle}>Numéro de téléphone</div>
              <p style={s.stepSub}>Optionnel — pour être contacté par votre médecin en cas de besoin</p>
              <div style={s.fieldGroup}>
                <label style={s.label}>Téléphone (optionnel)</label>
                <input style={s.input} placeholder="06XXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button className="btn-blue" style={s.nextBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? "Inscription en cours..." : "Terminer l'inscription"}
              </button>
              <button style={s.skipBtn} onClick={handleSubmit} disabled={loading}>
                Ignorer cette étape
              </button>
            </div>
          )}

          <div style={s.footerNote}>
            En vous inscrivant, vous acceptez nos{' '}
            <span style={{ color: '#2563EB', cursor: 'pointer' }}>Conditions d'utilisation</span>
            {' '}et notre{' '}
            <span style={{ color: '#2563EB', cursor: 'pointer' }}>Politique de confidentialité</span>.
          </div>
        </div>
      </div>

      {/* Exist modal */}
      {showExistModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalTitle}>Compte existant</div>
            <p style={s.modalText}>
              L'identifiant <strong>{form.identifier}</strong> est déjà associé à un compte Freya.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" style={s.modalBtnOutline} onClick={() => setShowExistModal(false)}>
                Utiliser un autre
              </button>
              <button className="btn-blue" style={s.modalBtnPrimary} onClick={() => navigate('/login')}>
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#F0F5FF',
    fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
    padding: '0 40px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  logo: { fontSize: '22px', fontWeight: '800', color: '#2563EB', textDecoration: 'none', letterSpacing: '-0.5px' },
  headerRight: { fontSize: '13px', color: '#64748B' },
  headerLink: { color: '#2563EB', fontWeight: '600', textDecoration: 'none' },
  body: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '540px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    border: '1px solid #E2E8F0',
  },
  stepBar: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 },
  stepCircle: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700', transition: 'all 0.2s',
  },
  stepLabel: { fontSize: '10px', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  stepLine: { flex: 1, height: '2px', marginBottom: '18px', transition: 'background 0.2s', minWidth: '16px' },
  progressTrack: {
    height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px',
    marginBottom: '28px', overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: '2px', transition: 'width 0.3s ease' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'none', border: 'none', color: '#64748B', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', padding: 0, marginBottom: '20px', fontFamily: 'inherit',
  },
  stepTitle: { fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.4px' },
  stepSub: { fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.55 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: '9px',
    border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A',
    backgroundColor: '#F8FAFC', transition: 'all 0.15s', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  genderBtn: {
    flex: 1, padding: '12px', borderRadius: '9px', border: '1.5px solid #E2E8F0',
    backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  },
  strengthTrack: { height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: '2px', transition: 'all 0.3s' },
  nextBtn: {
    width: '100%', padding: '13px', backgroundColor: '#2563EB', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', marginTop: '4px',
  },
  skipBtn: {
    width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#64748B',
    border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px',
  },
  footerNote: { marginTop: '24px', fontSize: '12px', color: '#94A3B8', textAlign: 'center', lineHeight: 1.6 },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
    maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' },
  modalText: { fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 },
  modalBtnOutline: {
    flex: 1, padding: '12px', border: '1.5px solid #E2E8F0', borderRadius: '9px',
    backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  },
  modalBtnPrimary: {
    flex: 1, padding: '12px', border: 'none', borderRadius: '9px',
    backgroundColor: '#2563EB', color: '#fff', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
  },
};
