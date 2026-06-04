import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import DoctorNavbar from '../../components/DoctorNavbar';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const UsersIcon = ({ size = 40, color = '#CBD5E1' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const MsgIcon = ({ size = 13, color = '#64748B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CLS = {
  confirmed: 'bg-green-100 text-green-800',
  pending:   'bg-amber-100 text-amber-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LBL = { confirmed: 'Confirmé', pending: 'En attente', completed: 'Terminé', cancelled: 'Annulé' };

export default function DoctorPatients() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [selectedPat,  setSelectedPat]  = useState(null);

  useEffect(() => {
    appointmentsAPI.getMyAppointments({ limit: 500 })
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  /* ─── Regrouper par patient ─── */
  const patients = useMemo(() => {
    const map = {};
    appointments.forEach(a => {
      const pid = a.patientId;
      if (!map[pid]) {
        map[pid] = {
          id:        pid,
          firstName: a.patient?.firstName || '—',
          lastName:  a.patient?.lastName  || '',
          phone:     a.patient?.phone     || null,
          rdvs:      [],
        };
      }
      map[pid].rdvs.push(a);
    });
    return Object.values(map).sort((a, b) =>
      `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
    );
  }, [appointments]);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || (p.phone && p.phone.includes(q));
  });

  const patDetails = selectedPat ? patients.find(p => p.id === selectedPat) : null;

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <DoctorNavbar active="patients" />

      <div className="max-w-6xl mx-auto px-6 py-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mes patients</h1>
            <p className="text-sm text-slate-500 mt-1">{patients.length} patient{patients.length !== 1 ? 's' : ''} au total</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3.5 mb-6">
          {[
            { val: patients.length,                                                     label: 'Patients total',    cls: 'border-t-primary-500 text-primary-600' },
            { val: appointments.filter(a => a.status === 'confirmed').length,           label: 'RDV confirmés',     cls: 'border-t-green-500  text-green-600'   },
            { val: appointments.filter(a => ['pending','confirmed'].includes(a.status)).length, label: 'À venir', cls: 'border-t-amber-500  text-amber-600'   },
          ].map((st, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-slate-200 border-t-[3px] shadow-card p-5 ${st.cls.split(' ')[0]}`}>
              <div className={`text-3xl font-extrabold tracking-tight mb-1 ${st.cls.split(' ')[1]}`}>{st.val}</div>
              <div className="text-xs text-slate-500 font-medium">{st.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-4 items-start">
          {/* Liste patients */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <SearchIcon />
                <input
                  className="flex-1 border-none outline-none text-[13px] bg-transparent text-slate-900 placeholder-slate-400"
                  placeholder="Rechercher par nom ou téléphone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-primary-600 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <UsersIcon />
                <p className="text-slate-600 font-semibold">Aucun patient trouvé</p>
                <p className="text-sm text-slate-400">Vos patients apparaîtront ici après leur premier rendez-vous</p>
              </div>
            ) : (
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                {filtered.map(p => {
                  const isActive  = selectedPat === p.id;
                  const lastRdv   = p.rdvs.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];
                  const totalRdvs = p.rdvs.length;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPat(isActive ? null : p.id)}
                      className={`flex items-center gap-3.5 px-4 py-3.5 border-b border-slate-100 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary-50 border-l-[3px] border-l-primary-600' : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900">{p.firstName} {p.lastName}</div>
                        {p.phone && <div className="text-[11px] text-slate-400">{p.phone}</div>}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-semibold text-slate-500">{totalRdvs} RDV</span>
                        {lastRdv && (
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLS[lastRdv.status] || 'bg-slate-100 text-slate-600'}`}>
                            {STATUS_LBL[lastRdv.status] || lastRdv.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Détail patient */}
          <div className="sticky top-24">
            {patDetails ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
                {/* Header patient */}
                <div className="px-5 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {patDetails.firstName[0]}{patDetails.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-slate-900">{patDetails.firstName} {patDetails.lastName}</div>
                      {patDetails.phone && <div className="text-[12px] text-slate-500 mt-0.5">{patDetails.phone}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate('/doctor/messages')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-xl py-2 text-[12px] font-semibold cursor-pointer hover:bg-primary-100 transition-colors"
                    >
                      <MsgIcon color="#2563EB" /> Envoyer un message
                    </button>
                    <button
                      onClick={() => navigate('/doctor/appointments')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl py-2 text-[12px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      Voir RDV
                    </button>
                  </div>
                </div>

                {/* Historique RDV */}
                <div className="px-5 py-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-3">
                    Historique ({patDetails.rdvs.length})
                  </div>
                  <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '380px' }}>
                    {patDetails.rdvs
                      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                      .map(rdv => (
                        <div key={rdv.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900">{fmtDate(rdv.appointmentDate)}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{rdv.appointmentTime} · {rdv.motif || 'Sans motif'}</div>
                          </div>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${STATUS_CLS[rdv.status] || 'bg-slate-100 text-slate-600'}`}>
                            {STATUS_LBL[rdv.status] || rdv.status}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col items-center justify-center py-16 gap-3">
                <UsersIcon size={36} />
                <p className="text-slate-500 font-semibold text-sm">Sélectionnez un patient</p>
                <p className="text-slate-400 text-[12px]">pour voir son historique</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
