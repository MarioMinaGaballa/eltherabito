import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaBook, FaCog, FaComments, FaSignOutAlt, FaArrowUp } from 'react-icons/fa';
import styles from './Chat.module.css';
import aiService from '../../services/aiService';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmptyChat, setShowEmptyChat] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    const message = input.trim();
    
    if (!message) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', content: message }]);
    setShowEmptyChat(false);
    
    // Clear input
    setInput('');
    
    try {
      // Call AI recommendation API
      const response = await aiService.getAIRecommendation(message);
      
      // Add bot response with answer and sources
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: response.answer,
        sources: response.sources || []
      }]);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: 'Sorry, I encountered an error. Please try again later.',
        sources: []
      }]);
      console.error('AI Recommendation error:', error);
    }
  }

  function handleBackToHome() {
    if (confirm('Are you sure you want to go back to home?')) {
      navigate('/patient/dashboard');
    }
  }

  function handleSettings() {
    navigate('/patient/settings');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return (
    <div className={styles.chatWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <FaShieldAlt />
            <span>Eltherabito</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <div 
            className={`${styles.navItem} ${styles.navItemActive}`}
            onClick={() => window.open('https://healthunlocked.com/', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <FaBook />
            <span >Resources</span>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.settingsBtn} onClick={handleSettings} title="Settings">
            <FaCog />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.chatMain}>
        {/* Header */}
        <header className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.supportAssistant}>
              <div className={styles.supportDot}></div>
              <div>
                <h1 className={styles.headerTitle}>Support Assistant</h1>
                <p className={styles.headerSubtitle}>Always available</p>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerBtn} onClick={() => navigate('/patient/dashboard')} title="Back to Home">
              <FaSignOutAlt />
              <span>Back to Home</span>
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {/* Empty Chat */}
          {showEmptyChat && (
            <div className={styles.emptyChat}>
              <div className={styles.emptyIcon}>
                <FaComments />
              </div>
              <p className={styles.emptyText}>Start a conversation</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[`message${msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)}`]}`}>
              <div className={styles.messageContent}>
                <p>{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sources}>
                    <p className={styles.sourcesTitle}>Sources:</p>
                    {msg.sources.map((source, sourceIndex) => (
                      <div key={sourceIndex} className={styles.sourceItem}>
                        <p className={styles.sourceConcern}>{source.concern}</p>
                        <p className={styles.sourceTitle}>{source.title}</p>
                        {source.suggestions && source.suggestions.length > 0 && (
                          <div className={styles.sourceSuggestions}>
                            {source.suggestions.map((suggestion, suggestionIndex) => (
                              <span key={suggestionIndex} className={styles.suggestionTag}>{suggestion}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <footer className={styles.chatFooter}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className={styles.inputBtn} onClick={sendMessage} title="Send">
              <FaArrowUp />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}