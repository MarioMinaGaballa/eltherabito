import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell, FaQuestionCircle, FaUserCircle, FaClock, FaTrash,
  FaPlusCircle, FaTimes,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import {
  SCHEDULE_DAYS,
} from '../../utils/scheduleStorage';
import bookingService from '../../services/bookingService';
import styles from './EditSchedule.module.css';

function sanitizeHours(value) {
  let v = value.replace(/[^0-9]/g, '').slice(0, 2);
  if (v.length === 2) {
    const h = parseInt(v, 10);
    if (h > 12) v = '12';
    else if (h === 0) v = '12';
  }
  return v;
}

function sanitizeMinutes(value) {
  let v = value.replace(/[^0-9]/g, '').slice(0, 2);
  if (v.length === 2 && parseInt(v, 10) > 59) v = '59';
  return v;
}

export default function EditSchedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(() => {
    const initial = {};
    SCHEDULE_DAYS.forEach(d => {
      initial[d.id] = { active: true, slots: [] };
    });
    return initial;
  });
  const [activeDay, setActiveDay] = useState('monday');
  const [showInput, setShowInput] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('AM');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const minutesRef = useRef(null);
  const hoursRef = useRef(null);

  const activeDayMeta = SCHEDULE_DAYS.find((d) => d.id === activeDay);
  const dayData = schedule[activeDay];

  const dayOfWeekMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // The schedules API may return `day` as a name ("Monday") or a number (1).
  // Resolve either form to our local day id ("monday").
  function resolveDayId(apiDay) {
    if (apiDay === null || apiDay === undefined) return null;
    if (typeof apiDay === 'number' || /^\d+$/.test(String(apiDay))) {
      const num = Number(apiDay);
      return Object.keys(dayOfWeekMap).find((key) => dayOfWeekMap[key] === num) ?? null;
    }
    const name = String(apiDay).toLowerCase();
    return name in dayOfWeekMap ? name : null;
  }

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const data = await bookingService.getDoctorSchedules();
        const mappedSchedule = {};
        SCHEDULE_DAYS.forEach(d => {
          mappedSchedule[d.id] = { active: true, slots: [] };
        });
        data.forEach(s => {
          const dayId = resolveDayId(s.day);
          if (dayId && mappedSchedule[dayId]) {
            mappedSchedule[dayId].slots.push({ id: s.id, label: `${s.startTime} - ${s.endTime}` });
          }
        });
        setSchedule(mappedSchedule);
      } catch {
        showSuccess('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    }
    fetchSchedules();
  }, []);

  function showError(msg) {
    setAlert({ type: 'error', text: msg });
    setTimeout(() => setAlert(null), 4000);
  }

  function showSuccess(msg) {
    setAlert({ type: 'success', text: msg });
    setTimeout(() => setAlert(null), 3000);
  }

  const persistSchedule = useCallback(() => {
    // Reserved for future server-side persistence on unload.
  }, []);

  useEffect(() => {
    function onBeforeUnload() {
      persistSchedule(schedule);
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [schedule, persistSchedule]);

  function selectDay(dayId) {
    setActiveDay(dayId);
    closeInput();
  }

  function closeInput() {
    setShowInput(false);
    setHours('');
    setMinutes('');
    setPeriod('AM');
  }

  function openAddInput() {
    if (showInput) {
      closeInput();
      return;
    }
    setHours('');
    setMinutes('');
    setPeriod('AM');
    setShowInput(true);
    setTimeout(() => hoursRef.current?.focus(), 100);
  }

  async function confirmSlot() {
    const h = hours.trim();
    const m = minutes.trim();
    if (!h || !m) {
      showError('Please enter hours and minutes');
      return;
    }
    if (h.length !== 2 || m.length !== 2) {
      showError('Please enter time as HH:MM');
      return;
    }

    try {
      // Convert 12-hour format to 24-hour format
      let hour24 = parseInt(h, 10);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;

      const startTime = `${hour24.toString().padStart(2, '0')}:${m}`;
      const endTime = `${(hour24 + 1).toString().padStart(2, '0')}:${m}`;

      const created = await bookingService.addScheduleSlot(dayOfWeekMap[activeDay], startTime, endTime);

      const newSlot = { id: created?.id, label: `${startTime} - ${endTime}` };
      setSchedule((prev) => ({
        ...prev,
        [activeDay]: {
          ...prev[activeDay],
          slots: [...prev[activeDay].slots, newSlot],
        },
      }));
      closeInput();
      showSuccess('Time slot added successfully');
    } catch {
      showError('Failed to add time slot');
    }
  }

  async function deleteSlot(slot) {
    if (!window.confirm('Delete this time slot?')) return;
    try {
      if (slot.id != null) {
        await bookingService.deleteScheduleSlot(slot.id);
      }
      setSchedule((prev) => ({
        ...prev,
        [activeDay]: {
          ...prev[activeDay],
          slots: prev[activeDay].slots.filter((s) => s !== slot),
        },
      }));
      showSuccess('Time slot removed');
    } catch {
      showError('Failed to delete time slot');
    }
  }

  async function handleDayToggle(dayId, isActive) {
    try {
      await bookingService.changeDayStatus(dayOfWeekMap[dayId], isActive);
      setSchedule((prev) => ({
        ...prev,
        [dayId]: { ...prev[dayId], active: isActive },
      }));
      showSuccess(`${dayId.charAt(0).toUpperCase() + dayId.slice(1)} ${isActive ? 'activated' : 'deactivated'}`);
    } catch {
      showError('Failed to change day status');
    }
  }

  function handleSave() {
    showSuccess('Changes saved successfully');
    setTimeout(() => {
      window.alert('Your schedule has been saved successfully!');
      navigate(ROUTES.therapist.profile);
    }, 500);
  }

  function handleCancel() {
    if (window.confirm('Leave without saving changes?')) {
      navigate(ROUTES.therapist.profile);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  function handleDayKeyDown(e, index) {
    if (e.key === 'ArrowRight' && index < SCHEDULE_DAYS.length - 1) {
      e.preventDefault();
      selectDay(SCHEDULE_DAYS[index + 1].id);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      selectDay(SCHEDULE_DAYS[index - 1].id);
    }
  }

  function handleTimeKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmSlot();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeInput();
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.logoBtn}
          onClick={() => navigate(ROUTES.therapist.profile)}
        >
          Eltherabito
        </button>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            title="Notifications"
            onClick={() => showSuccess('No new notifications')}
          >
            <FaBell aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Help"
            onClick={() => showSuccess('Help center — coming soon')}
          >
            <FaQuestionCircle aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Profile"
            onClick={() => navigate(ROUTES.therapist.profile)}
          >
            <FaUserCircle aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Schedule</h1>
          <p className={styles.pageSubtitle}>
            Set your specific session slots for each day of the week.
          </p>
        </div>

        {alert && (
          <div
            className={`${styles.alert} ${alert.type === 'error' ? styles.alertError : styles.alertSuccess}`}
            role="alert"
          >
            {alert.text}
          </div>
        )}

        <nav className={styles.daysNav} aria-label="Days of the week">
          {SCHEDULE_DAYS.map(({ id, label }, index) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeDay === id}
              aria-label={`Select ${label}`}
              className={`${styles.dayBtn} ${activeDay === id ? styles.dayBtnActive : ''}`}
              onClick={() => selectDay(id)}
              onKeyDown={(e) => handleDayKeyDown(e, index)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.scheduleCard} role="tabpanel">
          <div className={styles.scheduleHeaderRow}>
            <h2 className={styles.scheduleDayTitle}>{activeDayMeta?.label} Time Slots</h2>
            <div className={styles.dayToggle}>
              <span className={styles.toggleLabel}>Day Active</span>
              <div className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  id={`${activeDay}-toggle`}
                  className={styles.toggleInput}
                  checked={dayData.active}
                  onChange={(e) => handleDayToggle(activeDay, e.target.checked)}
                />
                <label htmlFor={`${activeDay}-toggle`} className={styles.toggleSlider} />
              </div>
            </div>
          </div>

          <div className={styles.slotsList}>
            {dayData.slots.map((slot, index) => (
              <div key={slot.id ?? `${slot.label}-${index}`} className={styles.timeSlot}>
                <div className={styles.timeSlotLeft}>
                  <FaClock className={styles.slotIcon} aria-hidden="true" />
                  <span className={styles.timeText}>{slot.label}</span>
                </div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  title="Delete"
                  onClick={() => deleteSlot(slot)}
                >
                  <FaTrash aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.addSlotBtn}
            aria-label="Add new time slot"
            onClick={openAddInput}
          >
            <FaPlusCircle aria-hidden="true" />
            <span>Add New Time Slot</span>
          </button>

          {showInput && (
            <div className={styles.newSlotInput}>
              <div className={styles.inputWrapper}>
                <div className={styles.timeInputGroup}>
                  <FaClock className={styles.inputIcon} aria-hidden="true" />
                  <input
                    ref={hoursRef}
                    type="text"
                    className={styles.timeInput}
                    placeholder="HH"
                    maxLength={2}
                    value={hours}
                    aria-label="Hours"
                    onChange={(e) => {
                      const v = sanitizeHours(e.target.value);
                      setHours(v);
                      if (v.length === 2) minutesRef.current?.focus();
                    }}
                    onKeyDown={handleTimeKeyDown}
                  />
                  <span className={styles.timeSep}>:</span>
                  <input
                    ref={minutesRef}
                    type="text"
                    className={styles.timeInput}
                    placeholder="MM"
                    maxLength={2}
                    value={minutes}
                    aria-label="Minutes"
                    onChange={(e) => setMinutes(sanitizeMinutes(e.target.value))}
                    onKeyDown={handleTimeKeyDown}
                  />
                </div>

                <div className={styles.periodSelector}>
                  {['AM', 'PM'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.confirmSlotBtn}
                  aria-label="Confirm new time slot"
                  onClick={confirmSlot}
                >
                  Confirm Slot
                </button>

                <button
                  type="button"
                  className={styles.closeInputBtn}
                  title="Close"
                  aria-label="Close"
                  onClick={closeInput}
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          <button
            type="button"
            className={styles.btnCancel}
            aria-label="Cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnSave}
            aria-label="Save changes"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
