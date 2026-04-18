import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [mode, setMode] = useState('choice');
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const res = await authAPI.loginUser({
        email: form.identifier.includes('@') ? form.identifier : undefined,
        phone: !form.identifier.includes('@') ? form.identifier : undefined,
        password: form.password
      });
      
      console.log('✅ Réponse login:', res.data);
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
    if (role === 'patient') setForm({ identifier: 'patient@freya.dz', password: 'password123' });
    if (role === 'doctor') setForm({ identifier: 'dr.benali@freya.dz', password: 'password123' });
    if (role === 'admin') setForm({ identifier: 'admin@freya.dz', password: 'admin123' });
  };

  const s = {
    root: {
       minHeight: '100vh',
       fontFamily: "'DM Sans',sans-serif",
       background: 'linear-gradient(135deg, #0F172A 0%, #0E4D6E 50%, #065a50 100%)',
       display: 'flex', flexDirection: 'column'
    },

    // CHOICE
    // Styles pour le mode "Choice" (Image 8 style)
    choiceBody: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    choiceCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
    
    // Styles pour le formulaire
    loginCard: { backgroundColor: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 80px rgba(0,0,0,0.4)' },
    title: { fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', textAlign: 'center' },
    subTitle: { fontSize: '14px', color: '#64748B', marginBottom: '24px', textAlign: 'center' },
    
    label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '15px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#F8FAFC' },
    
    primaryBtn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0D9488, #065a50)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(13, 148, 136, 0.3)' },
    secondaryBtn: { width: '100%', padding: '14px', backgroundColor: '#fff', color: '#0D9488', border: '2px solid #0D9488', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '12px' },
    
    roleBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', backgroundColor: '#CCFBF1', color: '#0D9488' },
  };

  const Logo = () => (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <span style={{ fontSize: '32px', fontWeight: '800', color: '#fff' }}>
        Frey<span style={{ color: '#F97316' }}>a</span>
      </span>
    </div>
  );

  // --- VUE CHOIX (PATIENT OU PRO) ---
  if (mode === 'choice') {
    return (
      <div style={s.root}>
        <div style={s.choiceBody}>
          <div style={s.choiceCard}>
            <div style={{...s.title, color: '#0D9488'}}>Bienvenue sur Freya</div>
            <p style={s.subTitle}>Choisissez votre espace pour continuer</p>
            
            <div style={{ marginBottom: '30px' }}>
                <div style={{ fontWeight: '700', marginBottom: '10px' }}>🧑 Vous êtes un patient ?</div>
                <button style={s.primaryBtn} onClick={() => setMode('patient')}>Accéder à mon espace</button>
                <button style={s.secondaryBtn} onClick={() => navigate('/register')}>Créer un compte</button>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #E2E8F0', margin: '20px 0' }} />

            <div>
                <div style={{ fontWeight: '700', marginBottom: '10px', color: '#0F172A' }}>👨‍⚕️ Vous êtes un professionnel ?</div>
                <button style={{ ...s.primaryBtn, background: '#0F172A' }} onClick={() => setMode('doctor')}>Espace Praticien</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE FORMULAIRE DE CONNEXION ---
  return (
    <div style={s.root}>
      <div style={{ padding: '20px' }}>
        <button 
          onClick={() => setMode('choice')}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
        >
          ← Retour
        </button>
      </div>
      
      <div style={s.choiceBody}>
        <div style={s.loginCard}>
          <div style={s.roleBadge}>{mode === 'doctor' ? 'PRO' : 'PATIENT'}</div>
          <div style={s.title}>Connexion</div>
          <p style={s.subTitle}>Heureux de vous revoir !</p>

          <form onSubmit={handleSubmit}>
            <label style={s.label}>Email ou Téléphone</label>
            <input 
              style={s.input} 
              type="text" 
              placeholder="Ex: 0550... ou nom@mail.com"
              value={form.identifier}
              onChange={e => setForm({ ...form, identifier: e.target.value })}
              required
            />

            <label style={s.label}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input 
                style={s.input} 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>

            <button type="submit" style={s.primaryBtn} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748B' }}>
            Pas encore de compte ? <Link to="/register" style={{ color: '#0D9488', fontWeight: '700' }}>S'inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
