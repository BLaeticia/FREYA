import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [mode, setMode] = useState('choice');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.loginUser(form);
      login(res.data.token, res.data.user);
      toast.success(`Bienvenue ${res.data.user.first_name} !`);
      const role = res.data.user.role;
      navigate(role === 'doctor' ? '/doctor' : role === 'admin' ? '/admin' : '/patient');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'patient') setForm({ email: 'patient@freya.dz', password: 'password123' });
    if (role === 'doctor') setForm({ email: 'dr.benali@freya.dz', password: 'password123' });
    if (role === 'admin') setForm({ email: 'admin@freya.dz', password: 'admin123' });
  };

  const s = {
    root: { minHeight: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' },

    // CHOICE
    choiceNav: { padding: '16px 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #E2E8F0', backgroundColor: '#fff' },
    choiceBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9F8', padding: '40px 20px', minHeight: 'calc(100vh - 65px)' },
    choiceContainer: { width: '100%', maxWidth: '520px' },
    choiceTitle: { fontSize: '13px', color: '#64748B', textAlign: 'center', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '28px' },
    patientCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '14px' },
    patientCardTitle: { fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '16px' },
    benefitRow: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#475569', marginBottom: '10px' },
    benefitIcon: { width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
    inscribeBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px', boxShadow: '0 4px 15px rgba(13,148,136,0.3)' },
    connectBtn: { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: '#fff', color: '#0D9488', border: '2px solid #0D9488', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    doctorCard: { backgroundColor: '#0F172A', borderRadius: '16px', padding: '28px' },
    doctorBadge: { fontSize: '11px', fontWeight: '700', color: '#2DD4BF', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
    doctorCardTitle: { fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '20px', letterSpacing: '-0.5px' },
    doctorAccent: { color: '#F97316' },
    doctorBtn: { width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' },
    doctorBtnSecondary: { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

    // LOGIN FORM
    loginPage: { flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0F172A 0%, #065a50 60%, #0D9488 100%)' },
    loginNav: { padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '16px' },
    backBtn: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    loginBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    loginCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 80px rgba(0,0,0,0.4)' },
    roleBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', backgroundColor: '#CCFBF1', color: '#0D9488' },
    loginTitle: { fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' },
    loginSub: { fontSize: '14px', color: '#64748B', marginBottom: '20px' },
    demoBox: { backgroundColor: '#F0F9F8', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px', border: '1.5px solid #CCFBF1' },
    demoLabel: { fontSize: '10px', fontWeight: '700', color: '#94A3B8', letterSpacing: '1.5px', marginBottom: '8px' },
    demoBtns: { display: 'flex', gap: '8px' },
    demoBtn: (color, bg) => ({ flex: 1, padding: '7px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', color, backgroundColor: bg, border: `1.5px solid ${color}30` }),
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', marginBottom: '6px' },
    inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '14px', fontSize: '15px', pointerEvents: 'none' },
    input: { width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', backgroundColor: '#F8FAFC', boxSizing: 'border-box' },
    eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
    forgotLink: { display: 'block', textAlign: 'right', fontSize: '13px', color: '#0D9488', fontWeight: '500', textDecoration: 'none', marginBottom: '18px', marginTop: '-6px' },
    submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(13,148,136,0.35)' },
    registerText: { textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '16px' },
    registerLink: { color: '#0D9488', fontWeight: '700', textDecoration: 'none' },
  };

  const Logo = ({ dark }) => (
    <span style={{ fontSize: '26px', fontWeight: '800', color: dark ? '#0F172A' : '#fff', letterSpacing: '-0.5px' }}>
      Frey<span style={{ color: '#F97316' }}>a</span>
    </span>
  );

  if (mode === 'choice') {
    return (
      <div style={s.root}>
        <nav style={s.choiceNav}><Logo dark /></nav>
        <div style={s.choiceBody}>
          <div style={s.choiceContainer}>
            <div style={s.choiceTitle}>Inscrivez-vous ou connectez-vous pour continuer</div>

            {/* Patient Card */}
            <div style={s.patientCard}>
              <div style={s.patientCardTitle}>Nouveau sur Freya ?</div>
              {[
                { icon: '📅', text: 'Prenez des rendez-vous facilement' },
                { icon: '💬', text: 'Envoyez des messages à vos soignants' },
                { icon: '❤️', text: "Suivez l'évolution de votre santé" },
              ].map((b, i) => (
                <div key={i} style={s.benefitRow}>
                  <div style={s.benefitIcon}>{b.icon}</div>{b.text}
                </div>
              ))}
              <div style={{ marginTop: '16px' }}>
                <button style={s.inscribeBtn} onClick={() => navigate('/register')}>S'INSCRIRE</button>
                <button style={s.connectBtn} onClick={() => setMode('patient')}>VOUS AVEZ DÉJÀ UN COMPTE ? SE CONNECTER</button>
              </div>
            </div>

            {/* Doctor Card */}
            <div style={s.doctorCard}>
              <div style={s.doctorBadge}>Freya Pro</div>
              <div style={s.doctorCardTitle}>
                Une nouvelle manière <span style={s.doctorAccent}>d'exercer</span>
              </div>
              <button style={s.doctorBtn} onClick={() => setMode('doctor')}>ÉCHANGER AVEC UN CONSEILLER</button>
              <button style={s.doctorBtnSecondary} onClick={() => setMode('doctor')}>COMMENCER AVEC LA VERSION GRATUITE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.loginPage}>
        <nav style={s.loginNav}>
          <button style={s.backBtn} onClick={() => setMode('choice')}>← Étape précédente</button>
          <Logo />
        </nav>
        <div style={s.loginBody}>
          <div style={s.loginCard}>
            <span style={s.roleBadge}>{mode === 'doctor' ? '👨‍⚕️ Espace Médecin' : '🧑 Espace Patient'}</span>
            <div style={s.loginTitle}>Connexion</div>
            <div style={s.loginSub}>Accédez à votre espace personnel</div>

            <div style={s.demoBox}>
              <div style={s.demoLabel}>COMPTES DÉMO :</div>
              <div style={s.demoBtns}>
                <button style={s.demoBtn('#0D9488', '#CCFBF1')} onClick={() => fillDemo('patient')}>🧑 Patient</button>
                <button style={s.demoBtn('#16A34A', '#DCFCE7')} onClick={() => fillDemo('doctor')}>👨‍⚕️ Docteur</button>
                <button style={s.demoBtn('#7C3AED', '#EDE9FE')} onClick={() => fillDemo('admin')}>⚙️ Admin</button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
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
                  <input style={s.input} type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <a href="#" style={s.forgotLink}>Mot de passe oublié ?</a>
              <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.8 : 1 }} disabled={loading}>
                {loading ? '⏳ Connexion...' : 'SE CONNECTER →'}
              </button>
            </form>

            <div style={s.registerText}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={s.registerLink}>S'inscrire gratuitement</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
