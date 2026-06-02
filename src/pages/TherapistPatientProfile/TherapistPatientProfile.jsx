import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TherapistPatientProfile.module.css';

export default function TherapistPatientProfile() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [historyCards, setHistoryCards] = useState([
    { id: 1, date: 'Oct 17, 2023', time: '10:00 AM • Completed' },
    { id: 2, date: 'Oct 10, 2023', time: '2:00 PM • Completed' },
    { id: 3, date: 'Oct 3, 2023', time: '11:30 AM • Completed' },
    { id: 4, date: 'Sep 28, 2023', time: '2:00 PM • Completed' },
  ]);

  // Show notification
  const showNotification = (message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // Logo click handler
  const handleLogoClick = () => {
    navigate('/therapist/agenda');
  };

  // Icon button handlers
  const handleIconBtnClick = (icon) => {
    if (icon === 'bell') {
      showNotification('🔔 No new notifications');
    } else if (icon === 'cog') {
      showNotification('⚙️ Settings page coming soon');
    }
  };

  // Profile button handler
  const handleProfileBtnClick = () => {
    showNotification('👤 Profile settings');
  };

  // History card click handler
  const handleHistoryCardClick = (date, time) => {
    showNotification(`📋 Session on ${date} - ${time}`);
  };

  // View All link handler
  const handleViewAllClick = (e) => {
    e.preventDefault();
    showNotification('📅 Loading all booking history...');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        showNotification('👤 Profile page');
      }
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showNotification('📅 Booking history');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.logoSection} onClick={handleLogoClick}>
            <span className={styles.logoText}>Eltherabito</span>
          </button>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={() => handleIconBtnClick('bell')}>
              <i className="fas fa-bell"></i>
            </button>
            <button className={styles.iconBtn} onClick={() => handleIconBtnClick('cog')}>
              <i className="fas fa-cog"></i>
            </button>
            <button className={styles.profileBtn} onClick={handleProfileBtnClick}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="Profile" className={styles.profileImg} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbSection}>
          <span className={styles.breadcrumbText}>Patients</span>
          <span className={styles.breadcrumbSeparator}>•</span>
          <span className={styles.breadcrumbCurrent}>Ahmed Ali</span>
        </div>

        {/* Profile Section */}
        <div className={styles.profileSection}>
          {/* Left Side - Patient Info */}
          <div className={styles.patientInfo}>
            {/* Patient Card */}
            <div className={styles.patientCard}>
              {/* Patient Image */}
              <div className={styles.patientImage}>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" alt="Ahmed Ali" className={styles.patientPhoto} />
                <div className={styles.onlineIndicator}></div>
              </div>

              {/* Patient Details */}
              <div className={styles.patientDetails}>
                <h1 className={styles.patientName}>Ahmed Ali</h1>
                <p className={styles.previousSessions}>
                  <i className="fas fa-history"></i>
                  <span>PREVIOUS SESSIONS: 4</span>
                </p>

                {/* Contact Info */}
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <p className={styles.contactLabel}>MOBILE NUMBER</p>
                    <p className={styles.contactValue}>+20 10 1234 5678</p>
                  </div>

                  <div className={styles.contactItem}>
                    <p className={styles.contactLabel}>EMAIL ADDRESS</p>
                    <p className={styles.contactValue}>ahmed.ali@example.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Booking History */}
            <div className={styles.bookingHistorySection}>
              <div className={styles.sectionHeader}>
                <i className="fas fa-calendar"></i>
                <h2>Previous Booking History</h2>
                <button className={styles.viewAllLink} onClick={handleViewAllClick}>
                  View All
                </button>
              </div>

              {/* History Grid */}
              <div className={styles.historyGrid}>
                {historyCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={styles.historyCard}
                    onClick={() => handleHistoryCardClick(card.date, card.time)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.historyIcon}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className={styles.historyDate}>{card.date}</p>
                    <p className={styles.historyTime}>{card.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Next Session */}
          <aside className={styles.nextSessionSidebar}>
            <div className={styles.nextSessionCard}>
              <p className={styles.sessionLabel}>NEXT SESSION</p>
              <div className={styles.sessionDate}>
                <span className={styles.dateDay}>24</span>
                <span className={styles.dateMonth}>Oct</span>
              </div>
              <p className={styles.sessionTime}>Thursday, 4:00 PM</p>
              <p className={styles.sessionType}>Video Consultation</p>
            </div>
          </aside>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {notification}
        </div>
      )}
    </div>
  );
}
