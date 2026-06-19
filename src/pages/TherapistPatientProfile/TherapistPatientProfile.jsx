import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import bookingService from '../../services/bookingService';
import { imageUrl } from '../../utils/imageUrl';
import styles from './TherapistPatientProfile.module.css';

const FALLBACK_PATIENT_PHOTO = 'https://randomuser.me/api/portraits/lego/1.jpg';

const STATUS_LABELS = {
  0: 'Pending',
  1: 'Completed',
  2: 'Cancelled',
  3: 'Missed',
};

function statusLabel(status) {
  return STATUS_LABELS[status] ?? 'Scheduled';
}

/** "2026-06-14" -> "Jun 14, 2026" */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** "10:00:00" / "10:00" -> "10:00 AM" */
function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hRaw, mRaw] = timeStr.split(':');
  const hour = parseInt(hRaw, 10);
  if (Number.isNaN(hour)) return timeStr;
  const minutes = (mRaw ?? '00').padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function weekday(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function dayNumber(isoDate) {
  if (!isoDate) return '--';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '--';
  return d.getDate();
}

function monthShort(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short' });
}

export default function TherapistPatientProfile() {
  const location = useLocation();
  const patientId = location.state?.patientId;

  // No patient id in navigation state — send back to the agenda.
  if (patientId === undefined || patientId === null) {
    return <Navigate to={ROUTES.therapist.agenda} replace />;
  }

  return <PatientProfileContent patientId={patientId} navState={location.state} />;
}

function PatientProfileContent({ patientId, navState }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingService.getPatientProfile(patientId);
        if (active) setProfile(data);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load patient profile');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchProfile();
    return () => { active = false; };
  }, [patientId]);

  const handleLogoClick = () => navigate(ROUTES.therapist.agenda);

  const history = profile?.previousbookinghistory ?? [];
  const nextSession = profile?.nextSession ?? null;
  const patientName = profile?.patientName ?? navState?.name ?? 'Patient';
  const photo = profile?.pictureUrl
    ? imageUrl(profile.pictureUrl, 'patients', FALLBACK_PATIENT_PHOTO)
    : (navState?.photo || FALLBACK_PATIENT_PHOTO);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.logoSection} onClick={handleLogoClick}>
            <span className={styles.logoText}>Eltherabito</span>
          </button>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={handleLogoClick} aria-label="Back to agenda">
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbSection}>
          <button
            type="button"
            className={styles.breadcrumbText}
            onClick={handleLogoClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Patients
          </button>
          <span className={styles.breadcrumbSeparator}>•</span>
          <span className={styles.breadcrumbCurrent}>{patientName}</span>
        </div>

        {loading && (
          <div className={styles.profileSection}>
            <p style={{ padding: '2rem', color: '#64748b' }}>Loading patient profile…</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.profileSection}>
            <div style={{ padding: '2rem' }}>
              <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
              <button
                type="button"
                className={styles.viewAllLink}
                onClick={() => navigate(ROUTES.therapist.agenda)}
              >
                Back to agenda
              </button>
            </div>
          </div>
        )}

        {!loading && !error && profile && (
          <div className={styles.profileSection}>
            {/* Left Side - Patient Info */}
            <div className={styles.patientInfo}>
              {/* Patient Card */}
              <div className={styles.patientCard}>
                <div className={styles.patientImage}>
                  <img src={photo} alt={patientName} className={styles.patientPhoto} />
                  <div className={styles.onlineIndicator}></div>
                </div>

                <div className={styles.patientDetails}>
                  <h1 className={styles.patientName}>{patientName}</h1>
                  <p className={styles.previousSessions}>
                    <i className="fas fa-history"></i>
                    <span>PREVIOUS SESSIONS: {history.length}</span>
                  </p>

                  <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                      <p className={styles.contactLabel}>MOBILE NUMBER</p>
                      <p className={styles.contactValue}>{profile.patientPhone || '—'}</p>
                    </div>

                    <div className={styles.contactItem}>
                      <p className={styles.contactLabel}>EMAIL ADDRESS</p>
                      <p className={styles.contactValue}>{profile.patientEmail || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Booking History */}
              <div className={styles.bookingHistorySection}>
                <div className={styles.sectionHeader}>
                  <i className="fas fa-calendar"></i>
                  <h2>Previous Booking History</h2>
                </div>

                {history.length === 0 ? (
                  <p style={{ color: '#64748b', padding: '0.5rem 0' }}>No previous sessions.</p>
                ) : (
                  <div className={styles.historyGrid}>
                    {history.map((card, index) => (
                      <div
                        key={index}
                        className={styles.historyCard}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={styles.historyIcon}>
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <p className={styles.historyDate}>{formatDate(card.appointmentDate)}</p>
                        <p className={styles.historyTime}>
                          {formatTime(card.startTime)} • {statusLabel(card.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Next Session */}
            <aside className={styles.nextSessionSidebar}>
              <div className={styles.nextSessionCard}>
                <p className={styles.sessionLabel}>NEXT SESSION</p>
                {nextSession ? (
                  <>
                    <div className={styles.sessionDate}>
                      <span className={styles.dateDay}>{dayNumber(nextSession.appointmentDate)}</span>
                      <span className={styles.dateMonth}>{monthShort(nextSession.appointmentDate)}</span>
                    </div>
                    <p className={styles.sessionTime}>
                      {weekday(nextSession.appointmentDate)}, {formatTime(nextSession.startTime)}
                    </p>
                    <p className={styles.sessionType}>{statusLabel(nextSession.status)}</p>
                  </>
                ) : (
                  <p className={styles.sessionTime}>No upcoming session</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
