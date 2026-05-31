import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaMapPin, FaClock, FaVideo, FaEllipsisH,
  FaCalendarCheck, FaPlus, FaUserMd,
  FaCalendar, FaPhone, FaTimes,
} from 'react-icons/fa';
import styles from './MyBooking.module.css';

/* ── Data ── */
const UPCOMING = {
  label:    'PSYCHOLOGIST',
  name:     'Dr. Elena Sterling',
  time:     '10:00 AM - 11:00 AM',
  location: 'Online Video Call',
  img:      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
};

const HISTORY = [
  { id: 1, doctor: 'Dr. Elena Sterling',  specialty: 'Psychologist',   date: 'Tuesday, Oct 10, 2023' },
  { id: 2, doctor: 'Dr. Marcus Thorne',   specialty: 'Dermatologist',  date: 'Thursday, Sep 28, 2023' },
];

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

export default function MyBookings() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast]       = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleMenuAction(action) {
    setMenuOpen(false);
    if (action === 'cancel') {
      if (window.confirm('Are you sure you want to cancel this session?')) {
        showToast('❌ Session cancelled');
      }
    } else if (action === 'reschedule') {
      showToast('📅 Rescheduling session...');
    } else if (action === 'contact') {
      showToast('📞 Opening contact options...');
    }
  }

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/dashboard" className={styles.logo}>
            <FaMapPin className={styles.logoIcon} />
            <span>Eltherabito</span>
          </Link>

          <nav className={styles.navMenu}>
            <Link to="/dashboard" className={styles.navLink}>Home</Link>
            <Link to="/my-booking" className={`${styles.navLink} ${styles.navLinkActive}`}>Bookings</Link>
          </nav>

          <button type="button" className={styles.profileBtn} onClick={() => navigate('/patient-profile')}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
              alt="Profile"
              className={styles.profileImg}
            />
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className={styles.main}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>{today}</h1>
            <p className={styles.pageSubtitle}>1 session scheduled for today</p>
          </div>
        </div>

        {/* ── UPCOMING SESSION ── */}
        <section className={styles.upcomingSection}>
          <div className={styles.sessionCard}>

            {/* Doctor image */}
            <div className={styles.sessionImage}>
              <img src={UPCOMING.img} alt={UPCOMING.name} className={styles.doctorImg} />
            </div>

            {/* Session details */}
            <div className={styles.sessionDetails}>
              <div className={styles.sessionHeader}>
                <div>
                  <p className={styles.sessionLabel}>{UPCOMING.label}</p>
                  <h2 className={styles.doctorName}>{UPCOMING.name}</h2>
                </div>

                {/* Menu button */}
                <div className={styles.menuWrap}>
                  <button className={styles.menuBtn} onClick={() => setMenuOpen(v => !v)}>
                    <FaEllipsisH />
                  </button>
                  {menuOpen && (
                    <div className={styles.menuDropdown}>
                      <button onClick={() => handleMenuAction('reschedule')}>
                        <FaCalendar /> Reschedule
                      </button>
                      <button onClick={() => handleMenuAction('cancel')}>
                        <FaTimes /> Cancel Session
                      </button>
                      <button onClick={() => handleMenuAction('contact')}>
                        <FaPhone /> Contact Doctor
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.sessionInfo}>
                <div className={styles.infoItem}>
                  <FaClock className={styles.infoIcon} />
                  <div>
                    <p className={styles.infoLabel}>SESSION TIME</p>
                    <p className={styles.infoValue}>{UPCOMING.time}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <FaVideo className={styles.infoIcon} />
                  <div>
                    <p className={styles.infoLabel}>CLINIC LOCATION</p>
                    <p className={styles.infoValue}>{UPCOMING.location}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* No other appointments */}
          <div className={styles.noAppointments}>
            <FaCalendarCheck className={styles.noAppIcon} />
            <p>No other appointments for this day.</p>
          </div>

          {/* Book another */}
          <button
            type="button"
            className={styles.bookAnotherLink}
            onClick={() => navigate('/book-appointment')}
          >
            <FaPlus /> Book another session
          </button>
        </section>

        {/* ── BOOKING HISTORY ── */}
        <section className={styles.historySection}>
          <h2 className={styles.sectionTitle}>Booking History</h2>

          {HISTORY.map((h, i) => (
            <div
              key={h.id}
              className={styles.historyItem}
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => showToast(`📋 ${h.doctor} - Session details`)}
            >
              <div className={styles.historyIcon}><FaUserMd /></div>
              <div className={styles.historyContent}>
                <p className={styles.historyDoctor}>{h.doctor}</p>
                <p className={styles.historyDate}>{h.specialty} • {h.date}</p>
              </div>
              <span className={styles.statusBadge}>COMPLETED</span>
            </div>
          ))}
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        © 2026 Eltherabito Mental Health Services. Your privacy is our priority.
      </footer>

      {/* Overlay to close menu */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

    </div>
  );
}