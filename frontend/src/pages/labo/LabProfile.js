import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { laboAPI } from '../../services/api';
import LabNavbar from '../../components/LabNavbar';

export default function LabProfile() {
  const [form,    setForm]    = useState({ name: '', address: '', wilaya: '', city: '', phone: '', email: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    laboAPI.getProfile()
      .then(res => setForm({ name: res.data.name || '', address: res.data.address || '', wilaya: res.data.wilaya || '', city: res.data.city || '', phone: res.data.phone || '', email: res.data.email || '', description: res.data.description || '' }))
      .catch(() => toast.error('Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await laboAPI.updateProfile(form);
      toast.success('Profil mis à jour');
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm text-slate-900 bg-slate-50 font-sans transition-all outline-none focus:border-primary-400 focus:bg-white';
  const F = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          rows={3}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  );

  if (loading) return (
    <div className="font-sans bg-slate-50 min-h-screen flex items-center justify-center">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="w-8 h-8 border-[3px] border-slate-200 border-t-primary-600 rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div className="font-sans bg-slate-50 min-h-screen">
      <LabNavbar active="profile" />
      <div className="max-w-3xl mx-auto px-6 py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profil du laboratoire</h1>
          <p className="text-sm text-slate-500 mt-1">Informations visibles par les patients</p>
        </div>

        <form onSubmit={save} className="bg-white rounded-2xl border border-slate-200 shadow-card p-7 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <F label="Nom du laboratoire" field="name" placeholder="Laboratoire Pasteur Alger" />
            </div>
            <F label="Adresse"  field="address"  placeholder="14 Rue Pasteur, Alger-Centre" />
            <F label="Wilaya"   field="wilaya"   placeholder="Alger" />
            <F label="Ville"    field="city"     placeholder="Alger-Centre" />
            <F label="Téléphone" field="phone"   placeholder="021 63 12 45" />
            <div className="col-span-2">
              <F label="Email"  field="email"    type="email" placeholder="contact@labo.dz" />
            </div>
            <div className="col-span-2">
              <F label="Horaires d'ouverture" field="description" type="textarea" placeholder="Sam-Jeu: 07h30 – 19h00 | Ven: Fermé" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white border-0 rounded-xl px-7 py-2.5 text-sm font-bold cursor-pointer font-sans transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
