import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaPlus, FaCommentAlt, FaHistory,
  FaFileAlt, FaSquare, FaCog, FaRobot, FaSignOutAlt,
  FaInfoCircle, FaSmile, FaMicrophone, FaPaperclip, FaPaperPlane,
} from 'react-icons/fa';
import AppHeader from '../../components/layout/AppHeader';
import { BRAND } from '../../components/layout/navConfig';
import { ROUTES } from '../../routes/paths';
import styles from './Chat.module.css';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "I'm here to listen and support you. How are you feeling today? Sometimes sharing what's on your mind can help ease the weight of the day.",
    time: '2:45 PM',
  },
  {
    id: 2,
    sender: 'user',
    text: "I've been feeling a bit overwhelmed with work lately. There just doesn't seem to be enough hours in the day to catch up.",
    time: '2:46 PM',
  },
  {
    id: 3,
    sender: 'ai',
    text: "That sounds really challenging. When work piles up, it's natural to feel that pressure. Have you had a chance to take even a five-minute break for yourself today? Sometimes a small reset can help clarify your next step.",
    time: 'Just now',
  },
];

const SUGGESTIONS = [
  "I haven't taken a break yet",
  "Can we talk about stress management?",
  "How do I prioritize tasks?",
];

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages]   = useState(INITIAL_MESSAGES);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [activeMenu, setActiveMenu] = useState('chat');
  const containerRef              = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text) {
    const msg = text.trim();
    if (!msg) return;

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: msg, time: getTime() }]);
    setInput('');

    // Simulate AI typing then response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: "I understand. Let's talk more about that.", time: getTime() },
        ]);
      }, 1500);
    }, 500);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && input.trim()) sendMessage(input);
  }

  function handleSuggestion(text) {
    setInput(text.replace(/"/g, ''));
  }

  const menuItems = [
    { id: 'chat',     icon: <FaCommentAlt />, label: 'Current Chat' },
    { id: 'history',  icon: <FaHistory />,    label: 'Chat History' },
    { id: 'resources',icon: <FaFileAlt />,    label: 'Resources' },
  ];

  const recentTopics = ['Managing Stress', 'Work-Life Balance'];

  return (
    <div className={styles.layout}>
      <AppHeader
        variant="patient"
        onAvatarClick={() => navigate(ROUTES.patient.profile)}
      />

      <div className={styles.layoutBody}>
        <aside className={styles.sidebar}>
        <button type="button" className={styles.logo} onClick={() => navigate(ROUTES.patient.dashboard)}>
          <FaRobot className={styles.logoIcon} />
          <span>{BRAND.name}</span>
        </button>

        <button type="button" className={styles.newSessionBtn}>
          <FaPlus /> New Session
        </button>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuItemActive : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuLabel}>Recent Topics</div>
          {recentTopics.map((topic) => (
            <button key={topic} className={styles.menuItem}>
              <FaSquare /> {topic}
            </button>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.menuItem}><FaCog /> Settings</button>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <img src="https://i.pravatar.cc/150?u=alex" alt="User" />
            </div>
            <div className={styles.userInfo}>
              <span>Alex Johnson</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <h2>Support Assistant</h2>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              Always available
            </div>
          </div>
          <Link to={ROUTES.patient.dashboard} className={styles.endSessionBtn}>
            <FaSignOutAlt /> End Session
          </Link>
        </header>

        {/* Chat area */}
        <div className={styles.chatContainer} ref={containerRef}>

          {/* Safety notice */}
          <div className={styles.safetyNotice}>
            <FaInfoCircle className={styles.safetyIcon} />
            <div>
              <strong>Safety Notice:</strong> Eltherabito is a 24/7 support tool designed for emotional support
              and wellness guidance. It is not a clinical service and cannot provide medical diagnoses.
              If you are in crisis or immediate danger, please contact professional emergency services immediately.
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${msg.sender === 'user' ? styles.messageUser : styles.messageAi}`}>
              <div className={`${styles.msgAvatar} ${msg.sender === 'user' ? styles.msgAvatarUser : ''}`}>
                {msg.sender === 'ai'
                  ? <FaRobot style={{ color: '#0055D4' }} />
                  : <img src="https://i.pravatar.cc/150?u=alex" alt="User" />
                }
              </div>
              <div className={styles.msgContent}>
                <div className={styles.msgAuthor}>{msg.sender === 'ai' ? 'Eltherabito AI' : 'You'}</div>
                <div className={`${styles.bubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
                  {msg.text}
                </div>
                <div className={styles.msgTime}>{msg.time}</div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.dots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
              <span>Eltherabito AI is typing...</span>
            </div>
          )}
        </div>

        {/* Footer / input */}
        <div className={styles.footer}>
          <div className={styles.voiceMode}>Voice Mode Ready</div>

          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button key={s} className={styles.pill} onClick={() => handleSuggestion(s)}>
                "{s}"
              </button>
            ))}
          </div>

          <div className={styles.inputWrapper}>
            <FaSmile className={styles.inputIcon} />
            <FaMicrophone className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.input}
            />
            <div className={styles.inputActions}>
              <FaPaperclip className={styles.inputIcon} />
              <button className={styles.sendBtn} onClick={() => sendMessage(input)}>
                <FaPaperPlane />
              </button>
            </div>
          </div>

          <div className={styles.pressEnter}>Press Enter to send message</div>
        </div>

      </main>
      </div>
    </div>
  );
}