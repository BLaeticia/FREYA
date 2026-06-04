import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { recordsAPI } from '../../services/api';
import PatientNavbar from '../../components/PatientNavbar';

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const TYPE_INFO = {
  consultation: { label: 'Consultation', cls: 'bg-primary-100 text-primary-800', dot: 'bg-primary-500' },
  ordonnance:   { label: 'Ordonnance',   cls: 'bg-violet-100 text-violet-800',   dot: 'bg-violet-500'  },
  analyse:      { label: 'Analyse',      cls: 'bg-green-100  text-green-800',    dot: 'bg-green-500'   },
  radio:        { label: 'Imagerie',     cls: 'bg-amber-100  text-amber-800',    dot: 'bg-amber-500'   },
  autre:        { label: 'Autre',        cls: 'bg-slate-100  text-slate-600',    dot: 'bg-slate-400'   },
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const TABS = [
  { id: 'info',          label: 'Informations'  },
  { id: 'consultations', label: 'Consultations' },
  { id: 'ordonnances',   label: 'Ordonnances'   },
  { id: 'analyses',      label: 'Analyses'      },
];

export default function PatientDossier() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [records,   setRecords]   = useState([]);
  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [tempData,  setTempData]  = useState({
    phone: '', birthDate: '', bloodGroup: 'A+', insurance: 'CNAS',
    height: '', weight: '', allergies: '', chronicDiseases: ''
  });

  const firstName = user?.firstName || 'Patient';
  const lastName  = user?.lastName  || '';
  const initials  = `${firstName[0] || 'P'}${lastName[0] || ''}`.toUpperCase();

  const load = useCallback(async () => {
    try {
      const res = await recordsAPI.getRecords();
      const data = res.data;
      setRecords(Array.isArray(data.records) ? data.records : []);
      if (data.profile) {
        const p = data.profile;
        setProfile(p);
        setTempData({
          phone:           user?.phone || '',
          birthDate:       p.dateOfBirth  ? p.dateOfBirth.split('T')[0] : '',
          bloodGroup:      p.bloodType    || 'A+',
          insurance:       'CNAS',
          height:          p.height       ? String(p.height) : '',
          weight:          p.weight       ? String(p.weight) : '',
          allergies:       p.allergies    || '',
          chronicDiseases: p.chronicDiseases || '',
        });
      }
    } catch {
      toast.error('Erreur de chargement du dossier');
    } finally {
      setLoading(false);
    }
  }, [user?.phone]);

  useEffect(() => { load(); }, [load]);

  const consultations = records.filter(r => r.recordType === 'consultation');
  const ordonnances   = records.filter(r => r.recordType === 'ordonnance');
  const analyses      = records.filter(r => r.recordType === 'analyse' || r.recordType === 'radio');

  const handleSave = async () => {
    setSaving(true);
    try {
      await recordsAPI.updateProfile(tempData);
      updateUser({ ...user, phone: tempData.phone });
      setIsEditing(false);
      toast.success('Informations mises à jour');
      load();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 outline-none font-sans focus:border-primary-400 transition-colors";

  const RecordCard = ({ rec }) => {
    const ti = TYPE_INFO[rec.recordType] || TYPE_INFO.autre;
    const source = rec.doctor
      ? `Dr. ${rec.doctor.user?.firstName} ${rec.doctor.user?.lastName}`
      : rec.clinic?.name || '—';
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card hover:border-primary-200 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${ti.dot}`} />
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ti.cls}`}>{ti.label}</span>
          </div>
          <span className="text-[11px] text-slate-400">{fmtDate(rec.createdAt)}</span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">{rec.title}</h3>
        <p className="text-[12px] text-primary-600 font-semibold mb-2">{source}</p>
        {rec.description && (
          <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 rounded-lg px-3 py-2 mb-2">{rec.description}</p>
        )}
        {rec.diagnosis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2">
            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-0.5">Diagnostic</div>
            <p className="text-[13px] text-blue-800">{rec.diagnosis}</p>
          </div>
        )}
        {rec.prescription && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
            <div className="text-[10px] font-bold text-violet-500 uppercase tracking-wide mb-0.5">Ordonnance</div>
            <p className="text-[13px] text-violet-800 whitespace-pre-line">{rec.prescription}</p>
          </div>
        )}
      </div>
    );
  };

  const EmptyTab = ({ msg }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col items-center py-16 gap-3">
      <FolderIcon />
      <p className="text-slate-500 font-semibold text-sm">{msg}</p>
      <p className="text-slate-400 text-xs">Les documents apparaîtront ici automatiquement</p>
    </div>
  );

  if (loading) return (
    <div className="font-sans bg-slate-50 min-h-screen flex items-center justify-center flex-col gap-4">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-primary-600 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      <p className="text-slate-400 text-sm">Chargement du dossier...</p>
    </div>
  );

  const displayAge = tempData.birthDate
    ? new Date().getFullYear() - new Date(tempData.birthDate).getFullYear()
    : null;

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <PatientNavbar active="dossier" />

      <div className="max-w-5xl mx-auto px-6 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              <FolderIcon /> Dossier Médical
            </h1>
            <p className="text-sm text-slate-500">Consultez et gérez vos informations de santé</p>
          </div>
        </div>

        {/* Bannière patient */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 flex items-center gap-5 mb-5">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-xl font-extrabold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-slate-900">{firstName} {lastName}</div>
            <div className="text-sm text-slate-500 mt-0.5">
              {displayAge ? `${displayAge} ans · ` : ''}
              {tempData.bloodGroup ? `Groupe ${tempData.bloodGroup} · ` : ''}
              {tempData.insurance || 'CNAS'}
            </div>
          </div>
          <div className="flex gap-6 shrink-0 text-center">
            {[
              { val: consultations.length, label: 'Consultations' },
              { val: ordonnances.length,   label: 'Ordonnances'   },
              { val: analyses.length,      label: 'Analyses'      },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-extrabold text-primary-600">{s.val}</div>
                <div className="text-[11px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {TABS.map(tab => {
            const count = tab.id === 'consultations' ? consultations.length
              : tab.id === 'ordonnances' ? ordonnances.length
              : tab.id === 'analyses' ? analyses.length : null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0 font-sans ${
                  activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300'
                }`}
              >
                {tab.label}
                {count !== null && count > 0 && (
                  <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-primary-100 text-primary-600'
                  }`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Onglet INFO ─── */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Informations personnelles</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-primary-600 border border-primary-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-primary-50 transition-colors cursor-pointer bg-transparent font-sans">
                    <EditIcon /> Modifier
                  </button>
                ) : (
                  <div className="flex gap-1.5">
                    <button onClick={() => setIsEditing(false)} className="text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 cursor-pointer bg-transparent font-sans">
                      Annuler
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 bg-primary-600 text-white border-0 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-primary-700 cursor-pointer font-sans disabled:opacity-50">
                      <SaveIcon /> {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Date de naissance', field: 'birthDate', type: 'date'   },
                  { label: 'Email',             value: user?.email, readonly: true  },
                  { label: 'Téléphone',         field: 'phone',     type: 'tel'    },
                  { label: 'Groupe sanguin',    field: 'bloodGroup', type: 'select', opts: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
                  { label: 'Mutuelle',          field: 'insurance',  type: 'select', opts: ['CNAS','CASNOS','Privée','Aucune'] },
                  { label: 'Poids (kg)',        field: 'weight',     type: 'number' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 px-3 py-2.5 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1">{item.label}</div>
                    {isEditing && !item.readonly ? (
                      item.type === 'select' ? (
                        <select value={tempData[item.field]} onChange={e => setTempData(d => ({ ...d, [item.field]: e.target.value }))} className={inputCls}>
                          {item.opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={item.type} value={tempData[item.field]} onChange={e => setTempData(d => ({ ...d, [item.field]: e.target.value }))} className={inputCls} />
                      )
                    ) : (
                      <div className="text-sm font-semibold text-slate-900">{item.readonly ? item.value : (tempData[item.field] || '—')}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Santé & Antécédents</h3>
              <div className="space-y-3">
                {[
                  { label: 'Allergies connues',   field: 'allergies',       placeholder: 'Ex: Pénicilline...' },
                  { label: 'Maladies chroniques', field: 'chronicDiseases', placeholder: 'Ex: Diabète, Hypertension...' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">{item.label}</div>
                    {isEditing ? (
                      <input type="text" placeholder={item.placeholder} value={tempData[item.field]} onChange={e => setTempData(d => ({ ...d, [item.field]: e.target.value }))} className={inputCls} />
                    ) : (
                      <div className="bg-slate-50 px-3 py-2.5 rounded-lg text-sm text-slate-700">
                        {tempData[item.field] || <span className="text-slate-400 italic">Non renseigné</span>}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-2">Données vitales</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: tempData.bloodGroup || '—', label: 'Groupe',  cls: 'bg-red-50 text-red-800'      },
                      { val: tempData.weight ? `${tempData.weight} kg` : '—', label: 'Poids',  cls: 'bg-primary-50 text-primary-800' },
                      { val: tempData.height ? `${tempData.height} cm` : '—', label: 'Taille', cls: 'bg-green-50 text-green-800'     },
                    ].map((v, i) => (
                      <div key={i} className={`${v.cls} rounded-xl p-3 text-center`}>
                        <div className="text-lg font-extrabold tracking-tight">{v.val}</div>
                        <div className="text-[10px] mt-0.5">{v.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Onglet CONSULTATIONS ─── */}
        {activeTab === 'consultations' && (
          consultations.length === 0
            ? <EmptyTab msg="Aucune consultation enregistrée" />
            : <div className="grid grid-cols-2 gap-4">{consultations.map(r => <RecordCard key={r.id} rec={r} />)}</div>
        )}

        {/* ─── Onglet ORDONNANCES ─── */}
        {activeTab === 'ordonnances' && (
          ordonnances.length === 0
            ? <EmptyTab msg="Aucune ordonnance disponible" />
            : <div className="grid grid-cols-2 gap-4">{ordonnances.map(r => <RecordCard key={r.id} rec={r} />)}</div>
        )}

        {/* ─── Onglet ANALYSES ─── */}
        {activeTab === 'analyses' && (
          analyses.length === 0
            ? <EmptyTab msg="Aucun résultat d'analyse disponible" />
            : <div className="grid grid-cols-2 gap-4">{analyses.map(r => <RecordCard key={r.id} rec={r} />)}</div>
        )}
      </div>
    </div>
  );
}
