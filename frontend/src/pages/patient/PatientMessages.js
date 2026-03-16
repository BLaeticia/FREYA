import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

/* ─── Static demo conversations (replace with API calls if available) ─── */
const DEMO_CONVERSATIONS = [
  {
    id: 0,
    doctor: 'Dr. Amira Benali',
    specialty: 'Cardiologue',
    avatar: 'AB',
    color: '#0D9488',
    unread: 2,
    online: true,
    lastMessage: 'Bonjour, vos résultats sont bons.',
    lastTime: '10:24',
    messages: [
      { from: 'doctor', text: 'Bonjour, comment vous sentez-vous après la dernière consultation ?', time: '09:10' },
      { from: 'patient', text: 'Bonjour Docteur, je me sens beaucoup mieux merci !', time: '09:35' },
      { from: 'doctor', text: "Parfait. J'ai reçu vos analyses. Tout est normal.", time: '10:00' },
      { from: 'doctor', text: 'Bonjour, vos résultats sont bons. Continuez le traitement.', time: '10:24' },
    ],
  },
  {
    id: 1,
    doctor: 'Dr. Karim Meziane',
    specialty: 'Médecin généraliste',
    avatar: 'KM',
    color: '#2563EB',
    unread: 0,
    online: false,
    lastMessage: 'RDV confirmé pour jeudi.',
    lastTime: 'Hier',
    messages: [
      { from: 'patient', text: 'Bonjour Dr. Meziane, puis-je avoir un RDV cette semaine ?', time: 'Hier 14:00' },
      { from: 'doctor', text: 'Bien sûr ! RDV confirmé pour jeudi 20 Mars à 14h00.', time: 'Hier 15:30' },
    ],
  },
  {
    id: 2,
    doctor: 'Dr. Sonia Hadj',
    specialty: 'Dermatologue',
    avatar: 'SH',
    color: '#7C3AED',
    unread: 0,
    online: false,
    lastMessage: 'Merci pour votre visite.',
    lastTime: '5 Fév',
    messages: [
      { from: 'doctor', text: 'Bonjour, suite à votre consultation, je vous prescris une crème.', time: '5 Fév 11:00' },
      { from: 'patient', text: 'Merci beaucoup Docteur !', time: '5 Fév 11:30' },
      { from: 'doctor', text: "Merci pour votre visite. N'hésitez pas si vous avez des questions.", time: '5 Fév 12:00' },
    ],
  },
];

export default function PatientMessages() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState(0);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const firstName = user?.first_name || 'Patient';
  const initials = `${user?.first_name?.[0] || 'P'}${user?.last_name?.[0] || ''}`.toUpperCase();
  const conv = conversations[activeConv];
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  const filteredConvs = conversations.filter(c =>
    c.doctor.toLowerCase().includes(search.toLowerCase()) ||
    c.specialty.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, conversations]);

  const handleSelectConv = (id) => {
    setActiveConv(id);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = { from: 'patient', text: message.trim(), time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    setConversations(prev => prev.map(c =>
      c.id === activeConv
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: message.trim(), lastTime: newMsg.time }
        : c
    ));
    setMessage('');
    toast.success('Message envoyé !', { duration: 1500 });
    inputRef.current?.focus();
  };

  const handleLogout = () => { logout(); navigate('/login'); toast.success('Déconnecté !'); };

  const navLinks = [
    { id: 'accueil', label: 'Accueil', path: '/patient' },
    { id: 'rdv', label: 'Mes rendez-vous', path: '/patient/appointments' },
    { id: 'medecins', label: 'Trouver un médecin', path: '/doctors' },
    { id: 'messages', label: 'Messages', path: '/patient/messages' },
    { id: 'dossier', label: 'Dossier médical', path: '/patient/dossier' },
  ];

  return (
    <div style={css.root} onClick={() => setShowUserMenu(false)}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .conv-item:hover { background-color: #F8FAFC !important; }
        .nav-link:hover { background-color: #F1F5F9 !important; color: #0F172A !important; }
        .action-btn:hover { background-color: #E2E8F0 !important; }
        .send-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .send-btn { transition: all 0.15s ease; }
        .dropdown-item:hover { background-color: #F8FAFC; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .msg-animate { animation: fadeUp 0.2s ease; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={css.navbar}>
        <div style={css.navInner}>
          <Link to="/" style={css.logo}>Frey<span style={css.logoAccent}>a</span></Link>

          <div style={css.navLinks}>
            {navLinks.map(link => (
              <Link
                key={link.id}
                to={link.path}
                className="nav-link"
                style={css.navLink(link.id === 'messages')}
              >
                {link.label}
                {link.id === 'messages' && totalUnread > 0 && (
                  <span style={css.navBadge}>{totalUnread}</span>
                )}
              </Link>
            ))}
          </div>

          <div style={css.navRight}>
            <button style={css.rdvBtn} onClick={() => navigate('/doctors')}>+ Prendre RDV</button>
            <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
              <div style={css.userBtn} onClick={() => setShowUserMenu(v => !v)}>
                <div style={css.userAvatar}>{initials}</div>
                <span style={css.userName}>{firstName}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8' }}>▼</span>
              </div>
              {showUserMenu && (
                <div style={css.dropdown}>
                  <div style={css.dropdownHeader}>
                    <div style={css.dropdownName}>{firstName} {user?.last_name}</div>
                    <div style={css.dropdownEmail}>{user?.email}</div>
                  </div>
                  {[
                    { icon: '👤', label: 'Mon profil', path: '/patient/profile' },
                    { icon: '📅', label: 'Mes rendez-vous', path: '/patient/appointments' },
                  ].map((item, i) => (
                    <div key={i} className="dropdown-item" style={css.dropdownItem} onClick={() => navigate(item.path)}>
                      <span>{item.icon}</span>{item.label}
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #F1F5F9' }}>
                    <div className="dropdown-item" style={{ ...css.dropdownItem, color: '#EF4444' }} onClick={handleLogout}>
                      <span>🚪</span> Déconnexion
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MAIN LAYOUT ── */}
      <div style={css.main}>

        {/* ── LEFT: Conversation List ── */}
        <aside style={css.sidebar}>
          {/* Header */}
          <div style={css.sidebarHeader}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={css.sidebarTitle}>💬 Messages</h2>
              {totalUnread > 0 && (
                <span style={css.unreadChip}>{totalUnread} non lu{totalUnread > 1 ? 's' : ''}</span>
              )}
            </div>
            {/* Search */}
            <div style={css.searchWrap}>
              <span style={css.searchIcon}>🔍</span>
              <input
                style={css.searchInput}
                placeholder="Rechercher un médecin..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div style={css.convScroll}>
            {filteredConvs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94A3B8', fontSize: '13px' }}>
                Aucun résultat
              </div>
            ) : filteredConvs.map(c => (
              <div
                key={c.id}
                className="conv-item"
                style={css.convItem(activeConv === c.id)}
                onClick={() => handleSelectConv(c.id)}
              >
                <div style={css.convAvatarWrap}>
                  <div style={css.convAvatar(c.color)}>{c.avatar}</div>
                  {c.online && <div style={css.onlineDot} />}
                </div>
                <div style={css.convInfo}>
                  <div style={css.convName}>{c.doctor}</div>
                  <div style={css.convSpec}>{c.specialty}</div>
                  <div style={css.convLast}>{c.lastMessage}</div>
                </div>
                <div style={css.convMeta}>
                  <span style={css.convTime}>{c.lastTime}</span>
                  {c.unread > 0 && <div style={css.unreadDot}>{c.unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── RIGHT: Chat Area ── */}
        <section style={css.chatArea}>
          {/* Chat Header */}
          <div style={css.chatHeader}>
            <div style={css.chatAvatar(conv.color)}>{conv.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={css.chatDoctorName}>{conv.doctor}</div>
              <div style={css.chatDoctorSpec}>
                {conv.specialty}
                {conv.online
                  ? <span style={css.onlineLabel}>● En ligne</span>
                  : <span style={css.offlineLabel}>● Hors ligne</span>}
              </div>
            </div>
            <button className="action-btn" style={css.headerBtn} onClick={() => navigate('/patient/appointments')} title="Prendre RDV">
              📅
            </button>
            <button className="action-btn" style={css.headerBtn} title="Appeler">
              📞
            </button>
          </div>

          {/* Messages */}
          <div style={css.messagesArea}>
            <div style={css.dateSep}>Aujourd'hui</div>
            {conv.messages.map((msg, i) => {
              const isPatient = msg.from === 'patient';
              return (
                <div key={i} className="msg-animate" style={{ marginBottom: '12px' }}>
                  <div style={css.msgRow(isPatient)}>
                    {!isPatient && (
                      <div style={css.msgAvatar(conv.color)}>{conv.avatar}</div>
                    )}
                    <div style={css.msgBubble(isPatient)}>{msg.text}</div>
                  </div>
                  <div style={css.msgTime(isPatient)}>{msg.time}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={css.inputArea}>
            <button className="action-btn" style={css.attachBtn} title="Joindre un fichier">📎</button>
            <input
              ref={inputRef}
              style={css.textInput}
              placeholder={`Écrire à ${conv.doctor}...`}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            />
            <button
              className="send-btn"
              style={{ ...css.sendBtn, opacity: message.trim() ? 1 : 0.5 }}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              Envoyer ↗
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────────── STYLES ─────────────────────── */
const css = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    backgroundColor: '#F0F9F8',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  /* Navbar */
  navbar: { backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexShrink: 0 },
  navInner: { maxWidth: '1400px', margin: '0 auto', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', textDecoration: 'none', flexShrink: 0 },
  logoAccent: { color: '#F97316' },
  navLinks: { display: 'flex', gap: '2px', flex: 1 },
  navLink: (active) => ({
    padding: '7px 13px', borderRadius: '8px', fontSize: '13.5px',
    fontWeight: active ? '700' : '500',
    color: active ? '#0D9488' : '#64748B',
    backgroundColor: active ? '#CCFBF1' : 'transparent',
    textDecoration: 'none', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.15s',
  }),
  navBadge: { backgroundColor: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '10px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  rdvBtn: { background: 'linear-gradient(135deg, #0D9488, #065F52)', color: '#fff', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  userBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 11px 5px 5px', borderRadius: '10px', border: '1.5px solid #E2E8F0', cursor: 'pointer', backgroundColor: '#fff' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #065F52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
  dropdown: { position: 'absolute', top: '50px', right: 0, backgroundColor: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.10)', minWidth: '210px', zIndex: 300, overflow: 'hidden' },
  dropdownHeader: { padding: '14px 16px', borderBottom: '1px solid #F1F5F9' },
  dropdownName: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  dropdownEmail: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  dropdownItem: { padding: '11px 16px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#0F172A', transition: 'background 0.1s' },

  /* Layout */
  main: { flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '20px 32px', display: 'flex', gap: '18px', overflow: 'hidden', boxSizing: 'border-box' },

  /* Sidebar */
  sidebar: { width: '310px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' },
  sidebarHeader: { padding: '18px 16px 12px', borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '10px' },
  sidebarTitle: { fontSize: '16px', fontWeight: '800', color: '#0F172A' },
  unreadChip: { fontSize: '11px', fontWeight: '700', backgroundColor: '#CCFBF1', color: '#0D9488', padding: '3px 9px', borderRadius: '20px' },
  searchWrap: { position: 'relative' },
  searchIcon: { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' },
  searchInput: { width: '100%', padding: '9px 12px 9px 32px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'inherit' },
  convScroll: { overflowY: 'auto', flex: 1 },
  convItem: (active) => ({
    padding: '13px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '11px',
    backgroundColor: active ? '#F0FDF9' : 'transparent',
    borderLeft: active ? '3px solid #0D9488' : '3px solid transparent',
    transition: 'all 0.15s',
  }),
  convAvatarWrap: { position: 'relative', flexShrink: 0 },
  convAvatar: (color) => ({ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }),
  onlineDot: { position: 'absolute', bottom: '-1px', right: '-1px', width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#22C55E', border: '2px solid #fff' },
  convInfo: { flex: 1, minWidth: 0 },
  convName: { fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '1px' },
  convSpec: { fontSize: '11px', color: '#94A3B8', marginBottom: '3px' },
  convLast: { fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  convMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', flexShrink: 0 },
  convTime: { fontSize: '11px', color: '#94A3B8' },
  unreadDot: { backgroundColor: '#0D9488', color: '#fff', fontSize: '10px', fontWeight: '700', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' },

  /* Chat */
  chatArea: { flex: 1, backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { padding: '16px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '13px', flexShrink: 0, backgroundColor: '#FAFFFE' },
  chatAvatar: (color) => ({ width: '46px', height: '46px', borderRadius: '13px', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', flexShrink: 0 }),
  chatDoctorName: { fontSize: '15px', fontWeight: '800', color: '#0F172A' },
  chatDoctorSpec: { fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' },
  onlineLabel: { color: '#16A34A', fontWeight: '600', fontSize: '11px' },
  offlineLabel: { color: '#94A3B8', fontWeight: '500', fontSize: '11px' },
  headerBtn: { backgroundColor: '#F1F5F9', border: 'none', borderRadius: '9px', padding: '9px 12px', fontSize: '16px', cursor: 'pointer', transition: 'background 0.15s' },

  messagesArea: { flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#FAFFFE' },
  dateSep: { textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginBottom: '16px', fontWeight: '600', letterSpacing: '0.3px' },
  msgRow: (isPatient) => ({ display: 'flex', justifyContent: isPatient ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }),
  msgAvatar: (color) => ({ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: color + '18', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', flexShrink: 0, marginBottom: '2px' }),
  msgBubble: (isPatient) => ({
    maxWidth: '58%', padding: '10px 15px', lineHeight: '1.55', fontSize: '14px',
    borderRadius: isPatient ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: isPatient ? '#0D9488' : '#fff',
    color: isPatient ? '#fff' : '#0F172A',
    boxShadow: isPatient ? '0 2px 8px rgba(13,148,136,0.25)' : '0 1px 3px rgba(0,0,0,0.07)',
    border: isPatient ? 'none' : '1px solid #E2E8F0',
  }),
  msgTime: (isPatient) => ({ fontSize: '10px', color: '#94A3B8', marginTop: '4px', textAlign: isPatient ? 'right' : 'left', paddingLeft: isPatient ? 0 : '34px' }),

  inputArea: { padding: '14px 18px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, backgroundColor: '#fff' },
  attachBtn: { backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '10px', padding: '10px 13px', fontSize: '16px', cursor: 'pointer', flexShrink: 0 },
  textInput: { flex: 1, padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC', fontFamily: 'inherit', color: '#0F172A', transition: 'border-color 0.15s' },
  sendBtn: { background: 'linear-gradient(135deg, #0D9488, #065F52)', color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 22px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', flexShrink: 0, letterSpacing: '0.2px' },
};