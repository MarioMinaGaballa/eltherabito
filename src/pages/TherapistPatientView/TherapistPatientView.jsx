import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaArrowLeft, FaPencil, FaPhone, FaVenusMars, FaEnvelope,
  FaFileAlt, FaHistory,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import { getPatientFromState } from '../../utils/patientRecords';
import { loadClinicalNotes, addClinicalNote } from '../../utils/clinicalNotesStorage';
import styles from './TherapistPatientView.module.css';

// 1. Improved Hook: Handles race conditions and memory leaks
function useNotification() {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const show = useCallback((message, type = 'info') => {
    setToast({ message, type });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { toast, show };
}

export default function TherapistPatientView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, show } = useNotification();

  const patient = getPatientFromState(location.state);

  const [notes, setNotes] = useState([]);
  const [draftNote, setDraftNote] = useState('');

  // 2. Extracted derived state for cleaner logic
  const latestNote = notes.find((n) => n.latest) ?? notes[0];

  useEffect(() => {
    if (!patient) {
      navigate(ROUTES.therapist.agenda, { replace: true });
    }
  }, [patient, navigate]);

  useEffect(() => {
    if (patient?.notesKey) {
      setNotes(loadClinicalNotes(patient.notesKey));
    }
  }, [patient?.notesKey]);

  if (!patient) return null;

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

  // 3. Simplified Toast Class logic
  const getToastClass = (type) => {
    switch (type) {
      case 'success': return styles.notificationSuccess;
      case 'warning': return styles.notificationWarning;
      default: return styles.notificationInfo;
    }
  };

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
            <FaPencil aria-hidden="true" />
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
        <div className={`${styles.notification} ${getToastClass(toast.type)}`} role="alert" aria-live="polite">
          {toast.message}
        </div>
      )}
    </div>
  );
}