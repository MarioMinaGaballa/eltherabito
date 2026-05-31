import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendar, FaEdit, FaSignOutAlt, FaBirthdayCake,
  FaBriefcase, FaCreditCard, FaVenus, FaClock,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import { getDisplaySchedule } from '../../utils/scheduleStorage';
import {
  loadTherapistProfile,
  formatExperience,
  formatSessionRate,
} from '../../utils/therapistProfileStorage';
import styles from './TherapistProfile.module.css';

const THERAPIST = {
  name: 'Dr. Sarah Miller',
  age: '38 Years',
  gender: 'Female',
  about:
    'I specialize in cognitive behavioral therapy (CBT) for adults facing anxiety, depression, and significant life transitions. My approach is collaborative and evidence-based, focusing on practical strategies to help you navigate challenges and build resilience. Over the past 12 years, I have worked in both clinical hospital settings and private practice.',
  tags: ['Anxiety', 'Depression', 'CBT', 'Stress Management'],
};

function useNotification() {
  const [message, setMessage] = useState(null);
  const show = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);
  return { message, show };
}

export default function TherapistProfile() {
  const navigate = useNavigate();
  const { message, show } = useNotification();
  const schedule = getDisplaySchedule();
  const profile = loadTherapistProfile();

  const infoItems = [
    { icon: FaBirthdayCake, label: 'Age', value: THERAPIST.age },
    { icon: FaBriefcase, label: 'Experience', value: formatExperience(profile.yearsExperience) },
    { icon: FaCreditCard, label: 'Session Rate', value: formatSessionRate(profile.sessionRate) },
    { icon: FaVenus, label: 'Gender', value: THERAPIST.gender },
  ];

  function handleLogout() {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate(ROUTES.login);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTop}>
          <h1 className={styles.pageTitle}>Therapist Profile</h1>
          <p className={styles.pageSubtitle}>Manage your professional details and availability.</p>
        </div>

        <div className={styles.actionButtons}>
          <button type="button" className={`${styles.btn} ${styles.btnBookings}`} onClick={() => navigate(ROUTES.therapist.agenda)}>
            <FaCalendar aria-hidden="true" />
            My Bookings
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnUpdate}`}
            onClick={() => navigate(ROUTES.therapist.editProfile)}
          >
            <FaEdit aria-hidden="true" />
            Update Profile
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnLogout}`} onClick={handleLogout}>
            <FaSignOutAlt aria-hidden="true" />
            Log Out
          </button>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.profileImageSection}>
              <img src={profile.photo} alt={THERAPIST.name} className={styles.profileImage} />
            </div>

            <h2 className={styles.therapistName}>{THERAPIST.name}</h2>
            <p className={styles.therapistTitle}>{profile.specialization}</p>

            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className={styles.infoItem}>
                <Icon className={styles.infoIcon} aria-hidden="true" />
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoValue}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About Me</h3>
            <p className={styles.aboutText}>{THERAPIST.about}</p>
            <div className={styles.tagsContainer}>
              {THERAPIST.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <FaClock aria-hidden="true" />
                Consultation Hours
              </h3>
              <button
                type="button"
                className={styles.editLink}
                onClick={() => navigate(ROUTES.therapist.editSchedule)}
              >
                Edit Schedule
              </button>
            </div>

            <div className={styles.scheduleTableWrapper}>
              <table className={styles.scheduleTable}>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={row.day}>
                      <td className={styles.dayCell}>{row.day}</td>
                      {row.closed ? (
                        <td colSpan={6} className={styles.closedCell}>Closed</td>
                      ) : row.slots.length === 0 ? (
                        <td colSpan={6} className={styles.closedCell}>No slots</td>
                      ) : (
                        row.slots.map((slot) => (
                          <td key={slot} className={styles.timeCell}>{slot}</td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {message && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}
