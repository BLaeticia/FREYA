import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { doctorsAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const statusBadge = (s) => {
  const map = { pending: ['badge-yellow','En attente'], confirmed: ['badge-green','Confirmé'], completed: ['badge-blue','Terminé'], cancelled: ['badge-red','Annulé'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return <span className={`badge ${cls}`}>{label}</span>;
};

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorsAPI.getDashboardStats().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content"><div className="loading-page"><div className="spinner"/><p>Chargement...</p></div></div>
    </div>
  );

  const stats = data?.stats || {};
  const upcoming = data?.upcoming || [];

  return (
    <div className="dashboard-layout">
      <Sidebar unreadMessages={stats.unread_messages} />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Tableau de bord médecin</span>
          <div className="topbar-right">
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}</span>
          </div>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1>Bonjour, Dr. {user?.last_name} 👋</h1>
            <p>Voici un aperçu de votre activité aujourd'hui</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '📅', val: stats.today_appointments || 0, label: "RDV aujourd'hui" },
              { icon: '⏳', val: stats.pending_appointments || 0, label: 'En attente' },
              { icon: '👥', val: stats.total_patients || 0, label: 'Patients total' },
              { icon: '💬', val: stats.unread_messages || 0, label: 'Messages non lus' },
              { icon: '⭐', val: stats.rating_avg?.rating_avg ? `${stats.rating_avg.rating_avg}/5` : '—', label: 'Note moyenne' },
              { icon: '📊', val: stats.total_appointments || 0, label: 'RDV total' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming appointments */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Prochains rendez-vous</h3>
            {upcoming.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📅</div><h3>Aucun rendez-vous à venir</h3><p>Vos prochains créneaux apparaîtront ici</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Patient</th><th>Date</th><th>Heure</th><th>Motif</th><th>Statut</th></tr></thead>
                  <tbody>
                    {upcoming.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <div className="avatar avatar-sm">{a.first_name?.[0]}{a.last_name?.[0]}</div>
                            <span>{a.first_name} {a.last_name}</span>
                          </div>
                        </td>
                        <td>{new Date(a.appointment_date).toLocaleDateString('fr-FR')}</td>
                        <td><strong>{a.appointment_time}</strong></td>
                        <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{a.motif || '—'}</td>
                        <td>{statusBadge(a.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}