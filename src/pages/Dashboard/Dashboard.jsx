import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar, FaCommentDots, FaBriefcaseMedical, FaCalendarCheck,
  FaCircle, FaEdit, FaPen, FaShieldAlt, FaLock, FaArrowRight,
  FaSearch, FaCalendar,
} from 'react-icons/fa';
import AppLayout from '../../components/layout/AppLayout';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [journal, setJournal] = useState('');

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <AppLayout variant="patient" showSidebar showSearch>

      <section className={styles.welcome}>
        <div>
          <h2 className={styles.welcomeTitle}>Hello, Alex.</h2>
          <p className={styles.welcomeSubtitle}>Your journey to wellness continues today.</p>
        </div>
        <span className={styles.dateBadge}><FaCalendar /> {today}</span>
      </section>

      <div className={styles.cardGrid}>

        <div className={styles.aiCard}>
          <div className={styles.aiContent}>
            <p className={styles.aiLabel}><FaStar /> ALWAYS AVAILABLE</p>
            <h3 className={styles.aiTitle}>AI Support</h3>
            <p className={styles.aiDesc}>
              Need a safe space to talk? Your AI companion is ready to listen and help you ground yourself.
            </p>
            <Link to="/chat" className={styles.btnPrimary}>
              <span>Start Chat</span> <FaCommentDots />
            </Link>
          </div>
          <div className={styles.aiImage}>
            <svg viewBox="0 0 200 350" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1a1a" />
                  <stop offset="100%" stopColor="#2d2d2d" />
                </linearGradient>
              </defs>
              <rect width="200" height="350" fill="url(#grad1)" rx="20"/>
              <path d="M 50 150 Q 100 100, 150 150 T 250 150" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M 40 200 Q 100 150, 160 200 T 280 200" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.4"/>
              <text x="100" y="320" textAnchor="middle" fill="#00d4ff" fontSize="10" fontWeight="bold" opacity="0.5">HEALING WORDS</text>
            </svg>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}><FaBriefcaseMedical /></div>
          <h4 className={styles.cardTitle}>Booking Doctor</h4>
          <p className={styles.cardDesc}>Connect with licensed professionals across multiple specialties.</p>
          <div className={styles.avatarGroup}>
            <span className={styles.avatar}>👩</span>
            <span className={styles.avatar}>👨</span>
            <span className={styles.avatar}>👩</span>
            <span className={styles.avatarCount}>+12</span>
          </div>
          <button type="button" className={styles.btnOutline}><FaSearch /> Find Doctor</button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}><FaCalendarCheck /></div>
          <h4 className={styles.cardTitle}>My Booking</h4>
          <p className={styles.cardDesc}>Manage your upcoming therapeutic sessions and history.</p>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingTime}><FaCircle className={styles.dot} /> Oct 24, 2:00 PM</p>
            <p className={styles.doctorName}>Dr. Sarah</p>
            <p className={styles.doctorRole}>Johnson</p>
          </div>
          <button type="button" className={styles.btnPrimary}><FaEdit /> Manage</button>
        </div>

      </div>

      <section className={styles.journal}>
        <div className={styles.journalHeader}>
          <div>
            <h3 className={styles.journalTitle}>Daily Journal</h3>
            <p className={styles.journalSubtitle}>Take a moment to reflect and write down your thoughts.</p>
          </div>
          <button type="button" className={styles.penBtn} aria-label="Edit journal"><FaPen /></button>
        </div>
        <textarea
          className={styles.journalInput}
          placeholder="How are you feeling right now?..."
          rows={8}
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
      </section>

      <section className={styles.privacy}>
        <div className={styles.privacyContent}>
          <div>
            <p className={styles.privacyLabel}><FaShieldAlt /> SECURE ENVIRONMENT</p>
            <h3 className={styles.privacyTitle}>Your Privacy is Our Priority</h3>
            <p className={styles.privacyDesc}>
              Military-grade encryption ensures your sessions and data stay private.
              Your health record is your own, always anonymized and protected.
            </p>
            <a href="#" className={styles.privacyLink}>Security Whitepaper <FaArrowRight /></a>
          </div>
          <div className={styles.privacyIconWrap}>
            <div className={styles.privacyIcon}><FaLock /></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerUser}>
            <div className={styles.footerAvatar}>👤</div>
            <div>
              <p className={styles.footerName}>Alex Johnson</p>
              <p className={styles.footerRole}>Premium Member</p>
            </div>
          </div>
          <div className={styles.footerCenter}>
            <Link to="/" className={styles.footerBrand}>Eltherabito</Link>
            <p className={styles.footerCopy}>© 2026 Mental Wellness Ecosystem</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Support</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>

    </AppLayout>
  );
}
