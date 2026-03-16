import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { useFavoris } from '../../store/useFavoris';

export default function PatientFavoris() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { favoris, removeFavori } = useFavoris();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState('');

  const firstName = user?.first_name || 'Patient';
  const initials = `${user?.first_name?.[0] || 'P'}${user?.last_name?.[0] || ''}`.toUpperCase();

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const handleRemove = (doc) => {
    removeFavori(doc.id);
    toast.success(`${doc.nom} retiré des favoris`);
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  const filtered = favoris.filter(f =>
    f.nom.toLowerCase().includes(search.toLowerCase()) ||
    f.specialty.toLowerCase().includes(search.toLowerCase()) ||
    f.wilaya.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .nav-link:hover { background-color: #F1F5F9 !important; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        .favori-row:hover { background-color: #F8FAFC !important; }
        .heart-btn:hover { transform: scale(1.15); }
        .heart-btn { transition: transform 0.15s; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.2s ease; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <div style={s.navInner}>
          <Link to="/" style={s.logo}>Frey<span style={s.logoAccent}>a</span></Link>
          <div style={s.navLinks}>
            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className="nav-link" style={s.navLink(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={s.navRight}>
            <button style={s.rdvBtn} onClick={() => navigate('/doctors')}>+ Prendre RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={s.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                <div style={s.userAvatar}>{initials}</div>
                <span style={s.userName}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={s.dropdown}>
                  <div style={s.dropdownHeader}>
                    <div style={s.dropdownName}>{firstName} {user?.last_name}</div>
                    <div style={s.dropdownEmail}>{user?.email}</div>
                  </div>
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/patient/profile' },
                    { icon: '📅', label: 'Mes rendez-vous', path: '/patient/appointments' },
                    { icon: '💬', label: 'Messages', path: '/patient/messages' },
                  ].map((item, i) => (
                    <div key={i} className="dropdown-item" style={s.dropdownItem} onClick={() => navigate(item.path)}>
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #F1F5F9' }}>
                    <div className="dropdown-item" style={{ ...s.dropdownItem, color: '#EF4444' }} onClick={handleLogout}>
                      <span>🚪</span> Déconnexion
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <div style={s.main}>
        {/* Header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>❤️ Mes médecins favoris</h1>
            <p style={s.pageSubtitle}>{favoris.length} médecin{favoris.length > 1 ? 's' : ''} sauvegardé{favoris.length > 1 ? 's' : ''}</p>
          </div>
          <button style={s.searchDoctorBtn} onClick={() => navigate('/doctors')}>
            🔍 Trouver un médecin
          </button>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Rechercher parmi vos favoris..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div style={s.card} className="fade-up">
          <div style={s.listHeader}>
            <span style={s.listHeaderTitle}>Mes soignants</span>
            <span style={s.listHeaderSub}>Favoris</span>
          </div>

          {filtered.length === 0 ? (
            <div style={s.emptyState}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>💔</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                {search ? 'Aucun résultat' : 'Aucun favori pour le moment'}
              </h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
                {search ? 'Essayez un autre terme de recherche' : 'Ajoutez des médecins en cliquant sur le ❤️ lors de vos recherches'}
              </p>
              {!search && (
                <button style={s.rdvBtn} onClick={() => navigate('/doctors')}>
                  🔍 Trouver un médecin
                </button>
              )}
            </div>
          ) : (
            filtered.map((doc, i) => (
              <div
                key={doc.id}
                className="favori-row"
                style={{ ...s.favoriRow, borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
              >
                {/* Avatar */}
                <div style={s.docAvatar(doc.color)}>{doc.avatar}</div>

                {/* Info */}
                <div style={s.docInfo}>
                  <div style={s.docName}>{doc.nom}</div>
                  <div style={s.docSpec}>{doc.specialty}</div>
                  <div style={s.docWilaya}>📍 {doc.wilaya}</div>
                </div>

                {/* Dispo */}
                <div style={s.dispoWrap}>
                  {doc.disponible
                    ? <span style={s.dispoOn}>● Disponible</span>
                    : <span style={s.dispoOff}>● Indisponible</span>
                  }
                </div>

                {/* Actions */}
                <div style={s.actions}>
                  <button
                    style={s.actionBtn}
                    onClick={() => navigate('/doctors')}
                    title="Prendre RDV"
                  >
                    📅 RDV
                  </button>
                  <button
                    style={s.actionBtn}
                    onClick={() => navigate('/patient/messages')}
                    title="Envoyer un message"
                  >
                    💬
                  </button>
                  <button
                    className="heart-btn"
                    style={s.heartBtn}
                    onClick={() => handleRemove(doc)}
                    title="Retirer des favoris"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── STYLES ─── */
const s = {
  root: { fontFamily: "'DM Sans','Segoe UI',sans-serif", backgroundColor: '#F0F9F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexShrink: 0 },
  navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', textDecoration: 'none', flexShrink: 0 },
  logoAccent: { color: '#F97316' },
  navLinks: { display: 'flex', gap: '2px', flex: 1 },
  navLink: () => ({ padding: '7px 13px', borderRadius: '8px', fontSize: '13.5px', fontWeight: '500', color: '#64748B', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s' }),
  navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  rdvBtn: { background: 'linear-gradient(135deg,#0D9488,#065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 11px 5px 5px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#0D9488,#065F52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
  dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.10)', minWidth: '210px', zIndex: 300, overflow: 'hidden' },
  dropdownHeader: { padding: '14px 16px', borderBottom: '1px solid #F1F5F9' },
  dropdownName: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  dropdownEmail: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  dropdownItem: { padding: '11px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A' },

  main: { flex: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '28px 32px', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  searchDoctorBtn: { background: '#fff', border: '1.5px solid #0D9488', color: '#0D9488', borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  searchWrap: { position: 'relative', marginBottom: '16px' },
  searchIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' },
  searchInput: { width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#fff', fontFamily: 'inherit', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },

  card: { backgroundColor: '#fff', borderRadius: '18px', border: '1.5px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' },
  listHeader: { padding: '18px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  listHeaderTitle: { fontSize: '15px', fontWeight: '800', color: '#0F172A' },
  listHeaderSub: { fontSize: '12px', fontWeight: '600', color: '#0D9488', backgroundColor: '#CCFBF1', padding: '3px 10px', borderRadius: '20px' },

  favoriRow: { padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'default', transition: 'background 0.15s' },
  docAvatar: (color) => ({ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }),
  docInfo: { flex: 1, minWidth: 0 },
  docName: { fontSize: '15px', fontWeight: '700', color: '#0D9488', cursor: 'pointer' },
  docSpec: { fontSize: '13px', color: '#64748B', marginTop: '2px' },
  docWilaya: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  dispoWrap: { flexShrink: 0 },
  dispoOn: { fontSize: '12px', fontWeight: '600', color: '#16A34A' },
  dispoOff: { fontSize: '12px', fontWeight: '600', color: '#94A3B8' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 },
  actionBtn: { backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '7px 12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#0F172A' },
  heartBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' },

  emptyState: { padding: '60px 20px', textAlign: 'center' },
};