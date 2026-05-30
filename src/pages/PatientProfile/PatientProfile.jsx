import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell, FaCog, FaHistory, FaCalendar, FaCheckCircle,
} from 'react-icons/fa';
import styles from './PatientProfile.module.css';

const PATIENT = {
  name: 'Ahmed Ali',
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  previousSessions: 4,
  mobile: '+20 10 1234 5678',
  email: 'ahmed.ali@example.com',
};

const BOOKING_HISTORY = [
  { id: 1, date: 'Oct 17, 2023', time: '10:00 AM • Completed' },
  { id: 2, date: 'Oct 10, 2023', time: '2:00 PM • Completed' },
  { id: 3, date: 'Oct 3, 2023', time: '11:30 AM • Completed' },
  { id: 4, date: 'Sep 28, 2023', time: '2:00 PM • Completed' },
];

const NEXT_SESSION = {
  day: '24',
  month: 'Oct',
  time: 'Thursday, 4:00 PM',
  type: 'Video Consultation',
};

const PROFILE_IMG =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop';

function useNotification() {
  const [message, setMessage] = useState(null);

  const show = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  return { message, show };
}

export default function PatientProfile() {
  const navigate = useNavigate();
  const { message, show } = useNotification();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        show('👤 Profile page');
      }
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        show('📅 Booking history');
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [show]);

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.logoSection}
            onClick={() => navigate('/')}
          >
            <span className={styles.logoText}>Eltherabito</span>
          </button>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              title="Notifications"
              aria-label="Notifications"
              onClick={() => show('🔔 No new notifications')}
            >
              <FaBell />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              title="Settings"
              aria-label="Settings"
              onClick={() => show('⚙️ Settings page coming soon')}
            >
              <FaCog />
            </button>
            <button
              type="button"
              className={styles.profileBtn}
              aria-label="Profile settings"
              onClick={() => show('👤 Profile settings')}
            >
              <img src={PROFILE_IMG} alt="Profile" className={styles.profileImg} />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContainer}>
        <div className={styles.container}>

          <div className={styles.breadcrumbSection}>
            <span>Patients</span>
            <span className={styles.breadcrumbSeparator}>•</span>
            <span className={styles.breadcrumbCurrent}>{PATIENT.name}</span>
          </div>

          <div className={styles.profileSection}>

            <div className={styles.patientInfo}>

              <div className={styles.patientCard}>
                <div className={styles.patientImage}>
                  <img
                    src={PATIENT.photo}
                    alt={PATIENT.name}
                    className={styles.patientPhoto}
                  />
                  <div className={styles.onlineIndicator} aria-hidden="true" />
                </div>

                <div className={styles.patientDetails}>
                  <h1 className={styles.patientName}>{PATIENT.name}</h1>
                  <p className={styles.previousSessions}>
                    <FaHistory className={styles.sessionIcon} aria-hidden="true" />
                    <span>PREVIOUS SESSIONS: {PATIENT.previousSessions}</span>
                  </p>

                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <p className={styles.contactLabel}>MOBILE NUMBER</p>
                      <p className={styles.contactValue}>{PATIENT.mobile}</p>
                    </div>
                    <div className={styles.contactItem}>
                      <p className={styles.contactLabel}>EMAIL ADDRESS</p>
                      <p className={styles.contactValue}>{PATIENT.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.bookingHistorySection}>
                <div className={styles.sectionHeader}>
                  <FaCalendar className={styles.sectionIcon} aria-hidden="true" />
                  <h2>Previous Booking History</h2>
                  <button
                    type="button"
                    className={styles.viewAllLink}
                    onClick={() => show('📅 Loading all booking history...')}
                  >
                    View All
                  </button>
                </div>

                <div className={styles.historyGrid}>
                  {BOOKING_HISTORY.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.historyCard}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() =>
                        show(`📋 Session on ${item.date} - ${item.time}`)
                      }
                    >
                      <FaCheckCircle className={styles.historyIcon} aria-hidden="true" />
                      <p className={styles.historyDate}>{item.date}</p>
                      <p className={styles.historyTime}>{item.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.nextSessionSidebar}>
              <div className={styles.nextSessionCard}>
                <p className={styles.sessionLabel}>NEXT SESSION</p>
                <div className={styles.sessionDate}>
                  <span className={styles.dateDay}>{NEXT_SESSION.day}</span>
                  <span className={styles.dateMonth}>{NEXT_SESSION.month}</span>
                </div>
                <p className={styles.sessionTime}>{NEXT_SESSION.time}</p>
                <p className={styles.sessionType}>{NEXT_SESSION.type}</p>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {message && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}
