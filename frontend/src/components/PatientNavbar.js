import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { id: 'accueil',  label: 'Accueil',           path: '/patient' },
  { id: 'rdv',      label: 'Mes rendez-vous',    path: '/patient/appointments' },
  { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
  { id: 'messages', label: 'Messages',           path: '/patient/messages' },
  { id: 'dossier',  label: 'Dossier médical',    path: '/patient/dossier' },
  { id: 'favoris',  label: 'Favoris',            path: '/patient/favoris' },
];

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function PatientNavbar({ active }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const firstName = user?.firstName || user?.first_name || 'Patient';
  const lastName  = user?.lastName  || user?.last_name  || '';
  const initials  = `${firstName[0] || 'P'}${lastName[0] || ''}`.toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Déconnecté !');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/patient" className="text-2xl font-extrabold text-primary-600 tracking-tight shrink-0 no-underline">
          Freya
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {NAV_LINKS.map(link => (
            <Link
              key={link.id}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap no-underline transition-colors ${
                active === link.id
                  ? 'font-semibold text-primary-600 bg-primary-50'
                  : 'font-medium text-slate-500 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/doctors')}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors border-0 cursor-pointer font-sans"
          >
            + Prendre RDV
          </button>

          {/* User menu */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">{firstName}</div>
                <div className="text-[10px] text-slate-400">Patient</div>
              </div>
            </button>

            {open && (
              <div
                className="absolute top-12 right-0 w-56 bg-white rounded-2xl border border-slate-200 shadow-dropdown z-50 overflow-hidden"
                onClick={() => setOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{firstName} {lastName}</div>
                    <div className="text-xs text-slate-400">{user?.email}</div>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent font-sans"
                  >
                    <LogoutIcon /> Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
