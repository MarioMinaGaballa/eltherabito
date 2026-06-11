import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt, FaUtensils, FaMoon, FaPlus,
  FaCircle, FaTimes, FaCheck, FaUser,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import AppLayout from '../../components/layout/AppLayout';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import styles from './DailyAgenda.module.css';

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
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, show } = useToast();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const doctorId = user?.id || user?.doctorId;
        if (!doctorId) {
          show('Doctor ID not found', 'danger');
          return;
        }
        const data = await adminService.getAppointmentAgenda(doctorId);
        const mappedSessions = data.map(apt => ({
          id: apt.appointmentId,
          time: formatTime(apt.startTime),
          ampm: getAmPm(apt.startTime),
          duration: calculateDuration(apt.startTime, apt.endTime),
          name: apt.patientName,
          img: apt.pictureUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
          status: mapStatus(apt.status),
          patientId: apt.patientId,
        }));
        setSessions(mappedSessions);
      } catch (error) {
        show(error.message, 'danger');
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

  function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes}`;
  }

  function getAmPm(timeStr) {
    const [hours] = timeStr.split(':');
    const hour = parseInt(hours);
    return hour >= 12 ? 'PM' : 'AM';
  }

  function calculateDuration(startTime, endTime) {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);
    const startTotal = startHours * 60 + startMins;
    const endTotal = endHours * 60 + endMins;
    const diff = endTotal - startTotal;
    return `${diff} min`;
  }

  function mapStatus(status) {
    const statusMap = {
      0: null,      // Pending
      1: 'done',    // Done
      2: 'cancelled', // Cancelled
      3: 'missed',   // Missed
    };
    return statusMap[status] || null;
  }

  function mapStatusToBackend(status) {
    const statusMap = {
      'done': 1,
      'cancelled': 2,
      'missed': 3,
    };
    return statusMap[status];
  }

  function updateSession(id, patch) {
    setSessions(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  }

  async function handleCancel(s) {
    if (!window.confirm(`Cancel session with ${s.name}?`)) return;
    try {
      await adminService.updateAppointmentStatus(s.id, 2); // Cancelled = 2
      updateSession(s.id, { status: 'cancelled' });
      show(`Session with ${s.name} cancelled.`, 'warning');
    } catch (error) {
      show(error.message, 'danger');
    }
  }

  async function handleMissed(s) {
    try {
      await adminService.updateAppointmentStatus(s.id, 3); // Missed = 3
      updateSession(s.id, { status: 'missed' });
      show(`${s.name} marked as missed.`, 'danger');
    } catch (error) {
      show(error.message, 'danger');
    }
  }

  async function handleDone(s) {
    try {
      await adminService.updateAppointmentStatus(s.id, 1); // Done = 1
      updateSession(s.id, { status: 'done' });
      show(`Session with ${s.name} marked as done! ✓`, 'success');
    } catch (error) {
      show(error.message, 'danger');
    }
  }
  function handleProfile(session) {
    navigate(ROUTES.therapist.viewPatient, {
      state: {
        sessionId: session.id,
        name: session.name,
        photo: session.img,
      },
    });
  }

  const beforeLunch = sessions.filter(s => ['09:00','10:30','12:00'].includes(s.time));
  const afterLunch  = sessions.filter(s => !['09:00','10:30','12:00'].includes(s.time));
  const totalActive = sessions.filter(s => s.status !== 'cancelled').length;

  const therapistHeader = (
    <div className={styles.navRight}>
      <div className={styles.liveBadge}>
        <span className={styles.liveDot} /> LIVE
      </div>
      <button
        type="button"
        className={styles.therapistPill}
        onClick={() => navigate(ROUTES.therapist.profile)}
        aria-label="Open therapist profile"
      >
        <div className={styles.therapistInfo}>
          <div className={styles.therapistName}>Dr. Alex Carter</div>
          <div className={styles.therapistRole}>Therapist</div>
        </div>
        <img
          className={styles.therapistAvatar}
          src="https://randomuser.me/api/portraits/men/41.jpg"
          alt="Dr. Alex Carter"
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <AppLayout variant="therapist" showSidebar={false} headerSlot={therapistHeader}>
        <div className={styles.wrapper}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Daily Agenda</h1>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </AppLayout>
    );
  }

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
              onProfile={() => handleProfile(s)}
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
              onProfile={() => handleProfile(s)}
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
  const isPending   = s.status === null; // Pending = 0 from backend

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
          {isPending && (
            <>
              <button className={`${styles.btnAction} ${styles.btnCancel}`} onClick={onCancel}>
                <FaTimes /> Cancel
              </button>
              <button className={`${styles.btnAction} ${styles.btnMissed}`} onClick={onMissed}>
                Missed
              </button>
              <button className={`${styles.btnAction} ${styles.btnDone}`} onClick={onDone}>
                <FaCheck /> Done
              </button>
            </>
          )}
          {!isPending && (
            <div className={styles.statusBadge}>
              {isDone && <span className={styles.statusDone}>Done</span>}
              {isCancelled && <span className={styles.statusCancelled}>Cancelled</span>}
              {isMissed && <span className={styles.statusMissed}>Missed</span>}
            </div>
          )}
          <button className={`${styles.btnAction} ${styles.btnProfile}`} onClick={onProfile}>
            <FaUser /> View Profile
          </button>
        </div>
      </div>
    </div>
  );
}