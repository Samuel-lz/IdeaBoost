import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ 
  conversations, 
  currentConversationId, 
  onNewChat, 
  onSelectConversation, 
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggle 
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartEdit = (conv) => {
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveEdit = (id) => {
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  return (
    <>
      {/* Overlay para cerrar en móvil */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="logo-icon">⚡</span>
              <h2 className="logo-text">IdeaBoost</h2>
            </div>
            <button 
              className="sidebar-toggle-btn"
              onClick={onToggle}
              aria-label="Cerrar menú"
            >
              <span className="toggle-icon">✕</span>
            </button>
          </div>

          {/* Nuevo Chat Button */}
          <button className="new-chat-btn" onClick={onNewChat}>
            <span className="btn-icon">✨</span>
            <span className="btn-text">Nueva conversación</span>
          </button>

          {/* Conversaciones */}
          <div className="conversations-container">
            <div className="conversations-header">
              <h3 className="conversations-title">Historial</h3>
              <span className="conversations-count">{conversations.length}</span>
            </div>

            <div className="conversations-list">
              {conversations.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">💭</span>
                  <p className="empty-text">Aún no tienes conversaciones</p>
                  <p className="empty-hint">Genera tu primera idea para comenzar</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`conversation-item ${
                      conv.id === currentConversationId ? 'active' : ''
                    }`}
                  >
                    {editingId === conv.id ? (
                      <div className="editing-container">
                        <input
                          type="text"
                          className="edit-input"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(conv.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            className="edit-btn save"
                            onClick={() => handleSaveEdit(conv.id)}
                            title="Guardar"
                          >
                            ✓
                          </button>
                          <button
                            className="edit-btn cancel"
                            onClick={handleCancelEdit}
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          className="conversation-btn"
                          onClick={() => onSelectConversation(conv.id)}
                        >
                          <span className="conv-icon">💡</span>
                          <div className="conv-info">
                            <span className="conv-title">{conv.title}</span>
                            <span className="conv-date">{conv.date}</span>
                          </div>
                        </button>
                        
                        <div className="conversation-actions">
                          <button
                            className="action-btn edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(conv);
                            }}
                            title="Renombrar"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Eliminar esta conversación?')) {
                                onDeleteConversation(conv.id);
                              }
                            }}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="footer-info">
              <span className="footer-icon">📚</span>
              <div className="footer-text">
                <p className="footer-title">UX Writing Aplicado</p>
                <p className="footer-subtitle">v2.0 con historial</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button para abrir (cuando está cerrado) */}
      {!isOpen && (
        <button 
          className="sidebar-open-btn"
          onClick={onToggle}
          aria-label="Abrir menú"
        >
          <span className="hamburger-icon">☰</span>
        </button>
      )}
    </>
  );
}

export default Sidebar;
