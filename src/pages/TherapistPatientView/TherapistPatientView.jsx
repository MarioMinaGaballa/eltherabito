import { useState, useCallback } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  FaArrowLeft, FaEdit, FaPhone, FaVenusMars, FaEnvelope,
  FaFileAlt, FaHistory,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import { getPatientFromState } from '../../utils/patientRecords';
import { loadClinicalNotes, addClinicalNote } from '../../utils/clinicalNotesStorage';
import styles from './TherapistPatientView.module.css';

function useNotification() {
  const [toast, setToast] = useState(null);
  const show = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

export default function TherapistPatientView() {
  const location = useLocation();
  const patient = getPatientFromState(location.state);

  if (!patient) {
    return <Navigate to={ROUTES.therapist.agenda} replace />;
  }

  return <TherapistPatientViewContent key={patient.notesKey} patient={patient} />;
}

function TherapistPatientViewContent({ patient }) {
  const navigate = useNavigate();
  const { toast, show } = useNotification();
  const [notes, setNotes] = useState(() => loadClinicalNotes(patient.notesKey));
  const [draftNote, setDraftNote] = useState('');

  const latestNote = notes.find((n) => n.latest) ?? notes[0];

  function handleSaveNote() {
    const text = draftNote.trim();
    if (!text) {
      show('Please enter a note', 'warning');
      return;
    }
    setNotes(addClinicalNote(patient.notesKey, text));
    setDraftNote('');
    show('Note saved successfully!', 'success');
  }

  const toastClass =
    toast?.type === 'success'
      ? styles.notificationSuccess
      : toast?.type === 'warning'
        ? styles.notificationWarning
        : styles.notificationInfo;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(ROUTES.therapist.agenda)}
          aria-label="Back to agenda"
        >
          <FaArrowLeft aria-hidden="true" />
        </button>
        <div className={styles.headerText}>
          <h1>Patient Profile</h1>
          <p>Clinical view — {patient.name}</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Patient Profile</h2>
          <button
            type="button"
            className={styles.updateBtn}
            onClick={() => show('Update patient data — coming soon', 'info')}
          >
            <FaEdit aria-hidden="true" />
            Update Data
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.profileRow}>
              <img src={patient.photo} alt={patient.name} className={styles.avatar} />
              <div>
                <h3 className={styles.patientName}>{patient.name}</h3>
                <div className={styles.badgesGrid}>
                  <div className={styles.infoBadge}>
                    <FaPhone className={styles.infoBadgeIcon} aria-hidden="true" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className={styles.infoBadge}>
                    <FaVenusMars className={styles.infoBadgeIcon} aria-hidden="true" />
                    <span>{patient.gender}</span>
                  </div>
                  <div className={`${styles.infoBadge} ${styles.infoBadgeFull}`}>
                    <FaEnvelope className={styles.infoBadgeIcon} aria-hidden="true" />
                    <span>{patient.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.notesHeader}>
            <h3 className={styles.notesTitle}>
              <FaFileAlt aria-hidden="true" />
              Personal Notes
            </h3>
            <button
              type="button"
              className={styles.historyLink}
              onClick={() => show('Loading note history...', 'info')}
            >
              <FaHistory aria-hidden="true" />
              View History
            </button>
          </div>
          <div className={styles.cardBody}>
            {latestNote && (
              <div className={styles.noteItem}>
                <div className={styles.noteMeta}>
                  <span>{latestNote.date} • {latestNote.author}</span>
                  {latestNote.latest && <span className={styles.latestBadge}>Latest</span>}
                </div>
                <p className={styles.noteText}>{latestNote.text}</p>
              </div>
            )}

            <label className={styles.formLabel} htmlFor="clinical-note">
              Add New Note
            </label>
            <textarea
              id="clinical-note"
              className={styles.textarea}
              rows={4}
              placeholder="Type a new personal note here..."
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
            />
            <div className={styles.formActions}>
              <button type="button" className={styles.btnLight} onClick={() => setDraftNote('')}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleSaveNote}
                disabled={!draftNote.trim()}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className={`${styles.notification} ${toastClass}`} role="alert" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  );
}
