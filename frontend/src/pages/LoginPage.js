import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const EyeIcon = ({ show }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

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
      const identifier = form.identifier.trim();
      const payload = {
        email: identifier.includes('@') ? identifier : undefined,
        phone: !identifier.includes('@') ? identifier : undefined,
        password: form.password,
      };
      const res = await authAPI.loginUser(payload);
      login(res.data.token, res.data.user);
      toast.success(`Bienvenue ${res.data.user.firstName} !`);
      const role = res.data.user.role;
      if (role === 'doctor')     navigate('/doctor');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'laboratory') navigate('/labo');
      else                       navigate('/patient');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'patient') setForm({ identifier: 'patient@freya.dz', password: 'password123' });
    if (role === 'doctor')  setForm({ identifier: 'dr.benali@freya.dz', password: 'password123' });
    if (role === 'admin')   setForm({ identifier: 'admin@freya.dz', password: 'admin123' });
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-[9px] border-[1.5px] border-slate-200 text-sm text-slate-900 bg-slate-50 font-sans transition-all focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 focus:bg-white';

  return (
    <div className="font-sans flex min-h-screen">
      {/* Left — branding */}
      <div className="hidden md:flex w-[44%] bg-gradient-to-br from-blue-900 via-primary-700 to-primary-600 items-center justify-center px-14 py-16 shrink-0 relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <div className="text-3xl font-extrabold text-white mb-12 tracking-tight">Freya</div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
            Votre santé,<br />simplifiée.
          </h1>
          <p className="text-[15px] text-white/70 leading-relaxed mb-11">
            Prenez rendez-vous chez un médecin en quelques clics et consultez vos résultats depuis votre espace sécurisé.
          </p>
          <div className="flex flex-col gap-3.5">
            {['Rendez-vous médicaux en ligne', "Résultats d'analyses accessibles", 'Messagerie avec votre médecin', 'Dossier médical centralisé'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white/85 text-sm font-medium">
                <div className="w-[7px] h-[7px] rounded-full bg-blue-300 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-[400px]">

          {mode === 'choice' ? (
            <>
              <div className="text-[28px] font-extrabold text-slate-900 mb-1.5 tracking-tight">Connexion</div>
              <p className="text-sm text-slate-500 mb-7">Choisissez votre espace pour continuer</p>

              <div className="flex flex-col gap-3 mb-7">
                {[
                  { title: 'Espace Patient', sub: 'Prenez rendez-vous, consultez vos résultats', onClick: () => setMode('patient') },
                  { title: 'Espace Professionnel', sub: 'Gérez vos rendez-vous et patients', onClick: () => setMode('doctor') },
                ].map(({ title, sub, onClick }) => (
                  <button
                    key={title}
                    onClick={onClick}
                    className="w-full flex items-center justify-between p-4 rounded-xl border-[1.5px] border-slate-200 bg-white text-left transition-all cursor-pointer hover:border-primary-600 hover:bg-primary-50 font-sans"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-sm mb-0.5">{title}</div>
                      <div className="text-[13px] text-slate-500">{sub}</div>
                    </div>
                    <ChevronRight />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium px-2">ou</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="mt-5 text-center text-[13px] text-slate-500">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary-600 font-semibold no-underline hover:underline">Créer un compte</Link>
              </div>
            </>
          ) : (
            <>
              <button
                className="flex items-center gap-1.5 bg-transparent border-0 text-slate-500 text-[13px] font-semibold cursor-pointer p-0 mb-6 hover:text-slate-900 transition-colors font-sans"
                onClick={() => setMode('choice')}
              >
                <ChevronLeft /> Retour
              </button>

              <div className="text-[28px] font-extrabold text-slate-900 mb-1.5 tracking-tight">
                {mode === 'doctor' ? 'Espace Professionnel' : 'Espace Patient'}
              </div>
              <p className="text-sm text-slate-500 mb-7">Heureux de vous revoir</p>

              {/* Demo credentials */}
              <div className="bg-primary-50 border border-primary-200 rounded-[10px] p-3 mb-5">
                <div className="text-[10px] font-bold text-primary-700 mb-2 uppercase tracking-wider">Identifiants de démonstration</div>
                <div className="flex gap-2 flex-wrap">
                  {mode === 'patient' && (
                    <button
                      className="text-xs px-2.5 py-1 rounded-md border border-primary-200 bg-primary-100 text-primary-800 cursor-pointer font-medium hover:bg-primary-200 transition-colors font-sans"
                      onClick={() => fillDemo('patient')}
                    >
                      patient@freya.dz / password123
                    </button>
                  )}
                  {mode === 'doctor' && (
                    <>
                      <button
                        className="text-xs px-2.5 py-1 rounded-md border border-primary-200 bg-primary-100 text-primary-800 cursor-pointer font-medium hover:bg-primary-200 transition-colors font-sans"
                        onClick={() => fillDemo('doctor')}
                      >
                        dr.benali@freya.dz / password123
                      </button>
                      <button
                        className="text-xs px-2.5 py-1 rounded-md border border-primary-200 bg-primary-100 text-primary-800 cursor-pointer font-medium hover:bg-primary-200 transition-colors font-sans"
                        onClick={() => setForm({ identifier: 'labo.pasteur@freya.dz', password: 'labo123' })}
                      >
                        labo.pasteur@freya.dz / labo123
                      </button>
                    </>
                  )}
                  <button
                    className="text-xs px-2.5 py-1 rounded-md border border-primary-200 bg-primary-100 text-primary-800 cursor-pointer font-medium hover:bg-primary-200 transition-colors font-sans"
                    onClick={() => fillDemo('admin')}
                  >
                    admin@freya.dz / admin123
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email ou téléphone</label>
                  <input
                    type="text"
                    placeholder="votre@email.com ou 06XXXXXXXX"
                    value={form.identifier}
                    onChange={e => setForm({ ...form, identifier: e.target.value })}
                    required
                    className={inputCls}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-slate-400 flex items-center p-1"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-primary-600 text-white border-0 rounded-[10px] text-[15px] font-bold cursor-pointer mt-2 hover:bg-primary-700 transition-colors font-sans disabled:opacity-60"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-5 text-center text-[13px] text-slate-500">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary-600 font-semibold no-underline hover:underline">S'inscrire</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
