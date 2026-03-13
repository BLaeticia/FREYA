import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Administration Freya</span>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1>Tableau de bord Admin</h1>
            <p>Vue globale de la plateforme</p>
          </div>
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: '👤', val: stats.total_users, label: 'Patients inscrits' },
                { icon: '👨‍⚕️', val: stats.approved_doctors, label: 'Médecins actifs' },
                { icon: '⏳', val: stats.pending_doctors, label: 'En attente validation', highlight: stats.pending_doctors > 0 },
                { icon: '📅', val: stats.total_appointments, label: 'RDV total' },
                { icon: '🏥', val: stats.total_clinics, label: 'Cliniques' },
                { icon: '📊', val: stats.appointments_today, label: "RDV aujourd'hui" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ borderColor: s.highlight ? 'var(--accent)' : undefined }}>
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value" style={{ color: s.highlight ? 'var(--accent)' : undefined }}>{s.val ?? '—'}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>⚡ Actions rapides</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/admin/doctors" className="btn btn-primary">👨‍⚕️ Valider les médecins</a>
              <a href="/admin/clinics" className="btn btn-outline">🏥 Gérer les cliniques</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}