import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #065a50, #0a7c6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>
            Frey<span style={{ color: '#e8734a' }}>a</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>Plateforme médicale Algérie</p>
        </div>

        <div className="card" style={{ borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Connexion</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Accédez à votre espace personnel</p>

          {/* Demo buttons */}
          <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Comptes démo :</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['patient', 'doctor', 'admin'].map(r => (
                <button key={r} onClick={() => fillDemo(r)} className="btn btn-ghost btn-sm" style={{ textTransform: 'capitalize', borderRadius: '8px' }}>{r}</button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="votre@email.com" required />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input className="form-control" type="password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px', borderRadius: '12px' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--muted)' }}>
            Pas encore de compte ? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600 }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}