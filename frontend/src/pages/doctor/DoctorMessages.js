import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import { messagesAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function DoctorMessages() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesAPI.getConversations().then(r => {
      setConversations(r.data.conversations || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (activeConv) {
      messagesAPI.getMessages(activeConv.id).then(r => {
        setMessages(r.data.messages || []);
        scrollToBottom();
      });
    }
  }, [activeConv]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50); };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      const res = await messagesAPI.sendMessage(activeConv.id, newMsg);
      setMessages(prev => [...prev, res.data]);
      setNewMsg('');
      setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, last_message: newMsg, unread_count: 0 } : c));
    } catch { toast.error('Erreur envoi message'); }
    finally { setSending(false); }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar unreadMessages={totalUnread} />
      <div className="main-content">
        <div className="topbar">
          <span className="topbar-title">Messagerie</span>
        </div>
        <div className="page-content" style={{ padding: 0, display: 'flex', height: 'calc(100vh - 64px)' }}>
          {/* Conversations list */}
          <div style={{ width: '300px', borderRight: '1.5px solid var(--sand)', overflowY: 'auto', background: 'white' }}>
            <div style={{ padding: '20px 16px 12px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Conversations {totalUnread > 0 && <span className="badge badge-teal" style={{ marginLeft: '8px' }}>{totalUnread}</span>}
            </div>
            {loading && <div className="loading-page"><div className="spinner"/></div>}
            {conversations.length === 0 && !loading && (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-icon">💬</div>
                <h3>Aucune conversation</h3>
              </div>
            )}
            {conversations.map(conv => (
              <div key={conv.id} onClick={() => setActiveConv(conv)}
                style={{ padding: '16px', borderBottom: '1px solid var(--sand)', cursor: 'pointer', background: activeConv?.id === conv.id ? 'var(--teal-bg)' : 'white', display: 'flex', gap: '12px', alignItems: 'center', transition: 'background 0.15s' }}>
                <div className="avatar avatar-md" style={{ background: `hsl(${conv.other_first?.charCodeAt(0) * 10 || 160}, 60%, 40%)` }}>
                  {conv.other_first?.[0]}{conv.other_last?.[0]}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{conv.other_first} {conv.other_last}</span>
                    {conv.unread_count > 0 && <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{conv.unread_count}</span>}
                  </div>
                  {conv.last_message && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{conv.last_message}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Chat area */}
          {activeConv ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Chat header */}
              <div style={{ padding: '16px 24px', borderBottom: '1.5px solid var(--sand)', display: 'flex', alignItems: 'center', gap: '12px', background: 'white' }}>
                <div className="avatar avatar-md">{activeConv.other_first?.[0]}{activeConv.other_last?.[0]}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{activeConv.other_first} {activeConv.other_last}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Patient</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--cream)' }}>
                {messages.map(msg => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      {!isMine && <div className="avatar avatar-sm" style={{ marginRight: '8px', marginTop: '4px' }}>{msg.first_name?.[0]}</div>}
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{
                          padding: '12px 16px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          background: isMine ? 'var(--teal)' : 'white',
                          color: isMine ? 'white' : 'var(--text)',
                          fontSize: '0.9rem', lineHeight: '1.5',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '4px', textAlign: isMine ? 'right' : 'left' }}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={{ padding: '16px 24px', background: 'white', borderTop: '1.5px solid var(--sand)', display: 'flex', gap: '12px' }}>
                <input
                  value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  placeholder="Écrire un message..."
                  style={{ flex: 1, padding: '12px 18px', border: '1.5px solid var(--sand)', borderRadius: '50px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--sand)'}
                />
                <button type="submit" disabled={sending || !newMsg.trim()} className="btn btn-primary" style={{ borderRadius: '50px', paddingInline: '24px' }}>
                  {sending ? '...' : '➤'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Sélectionnez une conversation</h3>
                <p>Choisissez un patient dans la liste pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
