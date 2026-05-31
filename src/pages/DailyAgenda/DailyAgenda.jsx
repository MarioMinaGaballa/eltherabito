import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt, FaUtensils, FaMoon, FaPlus,
  FaCircle, FaTimes, FaCheck, FaUser,
} from 'react-icons/fa';
import AppLayout from '../../components/layout/AppLayout';
import styles from './DailyAgenda.module.css';

/* ── Data ── */
const SESSIONS = [
  { id: 1, time: '09:00', ampm: 'AM', duration: '50 min', name: 'Sarah Mitchell',  img: 'https://randomuser.me/api/portraits/women/44.jpg', status: null },
  { id: 2, time: '10:30', ampm: 'AM', duration: '60 min', name: 'James Parker',    img: 'https://randomuser.me/api/portraits/men/32.jpg',   status: null },
  { id: 3, time: '12:00', ampm: 'PM', duration: '50 min', name: 'Michael Ross',    img: 'https://randomuser.me/api/portraits/men/54.jpg',   status: null, isLast: true },
  // after lunch
  { id: 4, time: '02:00', ampm: 'PM', duration: '60 min', name: 'Elena Rodriguez', img: 'https://randomuser.me/api/portraits/women/56.jpg', status: null },
  { id: 5, time: '04:30', ampm: 'PM', duration: '45 min', name: 'David Chang',     img: 'https://randomuser.me/api/portraits/men/76.jpg',   status: null },
  { id: 6, time: '05:30', ampm: 'PM', duration: '60 min', name: 'Anna West',       img: 'https://randomuser.me/api/portraits/women/12.jpg', status: null },
];

const dateChip = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });

/* ── Toast ── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  function show(msg, type = 'info') {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }
  return { toasts, show };
}

export default function DailyAgenda() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(SESSIONS);
  const { toasts, show } = useToast();

  function updateSession(id, patch) {
    setSessions(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  }

  function handleCancel(s) {
    if (!window.confirm(`Cancel session with ${s.name}?`)) return;
    updateSession(s.id, { status: 'cancelled' });
    show(`Session with ${s.name} cancelled.`, 'warning');
  }
  function handleMissed(s) {
    updateSession(s.id, { status: 'missed' });
    show(`${s.name} marked as missed.`, 'danger');
  }
  function handleDone(s) {
    updateSession(s.id, { status: 'done' });
    show(`Session with ${s.name} marked as done! ✓`, 'success');
  }
  function handleProfile() {
    navigate('/patient-profile');
  }

  const beforeLunch = sessions.filter(s => ['09:00','10:30','12:00'].includes(s.time));
  const afterLunch  = sessions.filter(s => !['09:00','10:30','12:00'].includes(s.time));
  const totalActive = sessions.filter(s => s.status !== 'cancelled').length;

  const therapistHeader = (
    <div className={styles.navRight}>
      <div className={styles.liveBadge}>
        <span className={styles.liveDot} /> LIVE
      </div>
      <div className={styles.therapistPill}>
        <div className={styles.therapistInfo}>
          <div className={styles.therapistName}>Dr. Alex Carter</div>
          <div className={styles.therapistRole}>Therapist</div>
        </div>
        <img
          className={styles.therapistAvatar}
          src="https://randomuser.me/api/portraits/men/41.jpg"
          alt="Dr. Alex Carter"
        />
      </div>
    </div>
  );

  return (
    <AppLayout variant="therapist" showSidebar={false} headerSlot={therapistHeader}>
      <div className={styles.wrapper}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Daily Agenda</h1>
          <div className={styles.pageMeta}>
            <span className={styles.dateChip}>{dateChip}</span>
            <a href="#" className={styles.calendarLink}><FaCalendarAlt /> Full Calendar</a>
            <span className={styles.sessionsCount}>
              <strong>{totalActive}</strong> sessions today
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>

          {/* Before lunch */}
          {beforeLunch.map((s) => (
            <SessionRow key={s.id} session={s}
              onCancel={() => handleCancel(s)}
              onMissed={() => handleMissed(s)}
              onDone={() => handleDone(s)}
              onProfile={handleProfile}
            />
          ))}

          {/* Lunch break */}
          <div className={styles.breakRow}>
            <div className={styles.breakTimeLabel}>01:00 PM</div>
            <div className={styles.breakLabel}><FaUtensils /> Lunch Break</div>
          </div>

          {/* After lunch */}
          {afterLunch.map((s) => (
            <SessionRow key={s.id} session={s}
              onCancel={() => handleCancel(s)}
              onMissed={() => handleMissed(s)}
              onDone={() => handleDone(s)}
              onProfile={handleProfile}
            />
          ))}

          {/* End of day */}
          <div className={styles.endRow}>
            <div className={styles.endTime}>END</div>
            <div className={styles.endLabel}><FaMoon /> Rest &amp; Recharge</div>
          </div>

        </div>
      </div>

      {/* FAB */}
      <button className={styles.fab} onClick={() => show('Add new session — coming soon!', 'info')}>
        <FaPlus />
      </button>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>© 2026 ELTHERABITO PROTOCOL. SYSTEMS OPERATIONAL.</span>
        <nav className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Support</a>
        </nav>
      </footer>

      {/* Toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

/* ── Session Row Component ── */
function SessionRow({ session: s, onCancel, onMissed, onDone, onProfile }) {
  const isCancelled = s.status === 'cancelled';
  const isMissed    = s.status === 'missed';
  const isDone      = s.status === 'done';

  return (
    <div className={`${styles.timeSlot} ${isCancelled ? styles.slotCancelled : ''}`}>
      <div className={`${styles.timeLabel} ${!isCancelled ? '' : styles.timeLabelMuted}`}>
        <div className={styles.hour}>{s.time}</div>
        <div className={styles.ampm}>{s.ampm}</div>
        <div className={styles.duration}>{s.duration}</div>
      </div>

      <div className={`${styles.sessionCard}
        ${isMissed ? styles.cardMissed : ''}
        ${isDone   ? styles.cardDone   : ''}
      `}>
        <div className={styles.sessionLeft}>
          <img className={styles.clientAvatar} src={s.img} alt={s.name} />
          <div>
            <div className={styles.clientName}>{s.name}</div>
            <div className={styles.onlineTag}><FaCircle className={styles.onlineDot} /> Online</div>
          </div>
        </div>

        <div className={styles.sessionActions}>
          <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={onCancel}>
            <FaTimes /> Cancel
          </button>
          <button className={`${styles.btnAction} ${styles.btnMissed} ${isMissed ? styles.btnMissedActive : ''}`} onClick={onMissed}>
            Missed
          </button>
          <button className={`${styles.btnAction} ${styles.btnDone} ${isDone ? styles.btnDoneActive : ''}`} onClick={onDone}>
            <FaCheck /> Done
          </button>
          <button className={`${styles.btnAction} ${styles.btnProfile}`} onClick={onProfile}>
            <FaUser /> View Profile
          </button>
        </div>
      </div>
    </div>
  );
}