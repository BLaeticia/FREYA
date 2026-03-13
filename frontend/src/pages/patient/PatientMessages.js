import React, { useState } from 'react';

const PatientMessages = () => {
  const [activeConv, setActiveConv] = useState(0);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 0,
      doctor: 'Dr. Amira Benali',
      specialty: 'Cardiologue',
      avatar: 'AB',
      color: '#0EA5E9',
      unread: 2,
      lastMessage: 'Bonjour, vos résultats sont bons.',
      lastTime: '10:24',
      messages: [
        { from: 'doctor', text: 'Bonjour Sara, comment vous sentez-vous après la dernière consultation ?', time: '09:10' },
        { from: 'patient', text: 'Bonjour Docteur, je me sens beaucoup mieux merci !', time: '09:35' },
        { from: 'doctor', text: 'Parfait. J\'ai reçu vos analyses. Tout est normal.', time: '10:00' },
        { from: 'doctor', text: 'Bonjour, vos résultats sont bons. Continuez le traitement.', time: '10:24' },
      ],
    },
    {
      id: 1,
      doctor: 'Dr. Karim Meziane',
      specialty: 'Généraliste',
      avatar: 'KM',
      color: '#10B981',
      unread: 0,
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
      color: '#8B5CF6',
      unread: 0,
      lastMessage: 'Merci pour votre visite.',
      lastTime: '5 Fév',
      messages: [
        { from: 'doctor', text: 'Bonjour Sara, suite à votre consultation, je vous prescris une crème.', time: '5 Fév 11:00' },
        { from: 'patient', text: 'Merci beaucoup Docteur !', time: '5 Fév 11:30' },
        { from: 'doctor', text: 'Merci pour votre visite. N\'hésitez pas si vous avez des questions.', time: '5 Fév 12:00' },
      ],
    },
  ];

  const conv = conversations[activeConv];

  const styles = {
    root: {
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      backgroundColor: '#F0F4F8',
      minHeight: '100vh',
      display: 'flex',
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
    },
    logo: { padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    logoText: { fontSize: '26px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' },
    logoAccent: { color: '#38BDF8' },
    logoSub: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', letterSpacing: '0.5px', textTransform: 'uppercase' },
    nav: { padding: '16px 12px', flex: 1 },
    navSection: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '12px 12px 8px' },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '2px',
      backgroundColor: active ? 'rgba(56,189,248,0.15)' : 'transparent',
      color: active ? '#38BDF8' : 'rgba(255,255,255,0.6)',
      fontSize: '14px', fontWeight: active ? '600' : '400',
      border: active ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
    }),
    notifDot: { width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%', marginLeft: 'auto' },
    userCard: {
      margin: '12px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
    },
    userAvatar: {
      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#38BDF8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', fontWeight: '700', color: '#0F172A',
    },
    main: { marginLeft: '260px', flex: 1, padding: '32px', display: 'flex', gap: '20px', height: '100vh', boxSizing: 'border-box' },
    convList: {
      width: '320px', backgroundColor: '#fff', borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flexShrink: 0,
    },
    convListHeader: {
      padding: '20px', borderBottom: '1px solid #E2E8F0',
      fontSize: '16px', fontWeight: '700', color: '#0F172A',
    },
    convSearch: {
      padding: '12px 16px', borderBottom: '1px solid #E2E8F0',
    },
    convSearchInput: {
      width: '100%', padding: '8px 12px', borderRadius: '10px',
      border: '1.5px solid #E2E8F0', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
    },
    convItem: (active) => ({
      padding: '14px 16px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center',
      backgroundColor: active ? '#EFF6FF' : 'transparent',
      borderLeft: active ? '3px solid #0EA5E9' : '3px solid transparent',
      transition: 'all 0.15s',
    }),
    convAvatar: (color) => ({
      width: '44px', height: '44px', borderRadius: '12px',
      backgroundColor: color + '20', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: '700', flexShrink: 0,
    }),
    convInfo: { flex: 1, minWidth: 0 },
    convName: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
    convSpec: { fontSize: '11px', color: '#94A3B8', marginBottom: '3px' },
    convLast: { fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    convMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 },
    convTime: { fontSize: '11px', color: '#94A3B8' },
    unreadBadge: {
      backgroundColor: '#0EA5E9', color: '#fff',
      fontSize: '10px', fontWeight: '700',
      width: '18px', height: '18px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    chatArea: {
      flex: 1, backgroundColor: '#fff', borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
    },
    chatHeader: {
      padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', gap: '12px',
    },
    chatAvatar: (color) => ({
      width: '44px', height: '44px', borderRadius: '12px',
      backgroundColor: color + '20', color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', fontWeight: '700',
    }),
    chatDoctorName: { fontSize: '15px', fontWeight: '700', color: '#0F172A' },
    chatDoctorSpec: { fontSize: '12px', color: '#64748B' },
    onlineBadge: {
      marginLeft: 'auto', fontSize: '11px', fontWeight: '600',
      color: '#16A34A', backgroundColor: '#DCFCE7', padding: '4px 10px', borderRadius: '20px',
    },
    messages: {
      flex: 1, padding: '20px', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '12px',
    },
    msgRow: (fromPatient) => ({
      display: 'flex', justifyContent: fromPatient ? 'flex-end' : 'flex-start',
    }),
    msgBubble: (fromPatient) => ({
      maxWidth: '65%', padding: '10px 14px', borderRadius: fromPatient ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      backgroundColor: fromPatient ? '#0EA5E9' : '#F1F5F9',
      color: fromPatient ? '#fff' : '#0F172A',
      fontSize: '13px', lineHeight: '1.5',
    }),
    msgTime: (fromPatient) => ({
      fontSize: '10px', marginTop: '4px', textAlign: fromPatient ? 'right' : 'left',
      color: '#94A3B8',
    }),
    inputArea: {
      padding: '16px 20px', borderTop: '1px solid #E2E8F0',
      display: 'flex', gap: '10px', alignItems: 'center',
    },
    textInput: {
      flex: 1, padding: '12px 16px', borderRadius: '12px',
      border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none',
      backgroundColor: '#F8FAFC',
    },
    sendBtn: {
      backgroundColor: '#0EA5E9', color: '#fff', border: 'none',
      borderRadius: '12px', padding: '12px 20px', fontSize: '14px',
      fontWeight: '600', cursor: 'pointer',
    },
    attachBtn: {
      backgroundColor: '#F1F5F9', color: '#64748B', border: 'none',
      borderRadius: '12px', padding: '12px', fontSize: '16px', cursor: 'pointer',
    },
  };

  const navItems = [
    { id: 'accueil', icon: '🏠', label: 'Accueil' },
    { id: 'rdv', icon: '📅', label: 'Mes rendez-vous' },
    { id: 'medecins', icon: '👨‍⚕️', label: 'Mes médecins' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'profil', icon: '👤', label: 'Mon profil' },
  ];

  const handleSend = () => {
    if (message.trim()) setMessage('');
  };

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>Frey<span style={styles.logoAccent}>a</span></div>
          <div style={styles.logoSub}>Plateforme médicale Algérie</div>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navSection}>Navigation</div>
          {navItems.map((item) => (
            <div key={item.id} style={styles.navItem(item.id === 'messages')}>
              <span>{item.icon}</span>{item.label}
              {item.id === 'messages' && <span style={styles.notifDot} />}
            </div>
          ))}
        </nav>
        <div style={styles.userCard}>
          <div style={styles.userAvatar}>SA</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Sara Amine</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Patient</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Conversation List */}
        <div style={styles.convList}>
          <div style={styles.convListHeader}>
            💬 Messages
            <span style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: '500', marginLeft: '8px' }}>
              {conversations.reduce((a, c) => a + c.unread, 0)} non lus
            </span>
          </div>
          <div style={styles.convSearch}>
            <input style={styles.convSearchInput} placeholder="🔍 Rechercher un médecin..." />
          </div>
          {conversations.map((c) => (
            <div key={c.id} style={styles.convItem(activeConv === c.id)} onClick={() => setActiveConv(c.id)}>
              <div style={styles.convAvatar(c.color)}>{c.avatar}</div>
              <div style={styles.convInfo}>
                <div style={styles.convName}>{c.doctor}</div>
                <div style={styles.convSpec}>{c.specialty}</div>
                <div style={styles.convLast}>{c.lastMessage}</div>
              </div>
              <div style={styles.convMeta}>
                <span style={styles.convTime}>{c.lastTime}</span>
                {c.unread > 0 && <span style={styles.unreadBadge}>{c.unread}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          <div style={styles.chatHeader}>
            <div style={styles.chatAvatar(conv.color)}>{conv.avatar}</div>
            <div>
              <div style={styles.chatDoctorName}>{conv.doctor}</div>
              <div style={styles.chatDoctorSpec}>{conv.specialty}</div>
            </div>
            <span style={styles.onlineBadge}>🟢 En ligne</span>
          </div>

          <div style={styles.messages}>
            {conv.messages.map((msg, i) => (
              <div key={i}>
                <div style={styles.msgRow(msg.from === 'patient')}>
                  <div style={styles.msgBubble(msg.from === 'patient')}>{msg.text}</div>
                </div>
                <div style={styles.msgTime(msg.from === 'patient')}>{msg.time}</div>
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <button style={styles.attachBtn}>📎</button>
            <input
              style={styles.textInput}
              placeholder="Écrire un message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button style={styles.sendBtn} onClick={handleSend}>Envoyer →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMessages;