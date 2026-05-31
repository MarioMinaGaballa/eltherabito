import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  FaSearch, FaStar, FaChevronLeft, FaChevronRight,
  FaCalendarCheck, FaShieldAlt,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import AppLayout from '../../components/layout/AppLayout';
import {
  saveSelectedTherapist,
  getSelectedTherapist,
  saveBooking,
} from '../../utils/bookingStorage';
import styles from './BookAppointment.module.css';

const THERAPISTS = [
  {
    id: 1,
    name: 'Dr. Elena Sterling',
    specialty: 'CLINICAL PSYCHOLOGIST',
    rating: 4.9,
    experience: '12 years exp.',
    description: 'Specializes in CBT and mindfulness for anxiety, depression, and stress management.',
    price: 120,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Dr. Marcus Vance',
    specialty: 'PSYCHOTHERAPIST (CBT)',
    rating: 4.8,
    experience: '8 years exp.',
    description: 'Focusing on relationship dynamics, family therapy, and personal growth strategies.',
    price: 110,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Sarah Jenkins, LMHC',
    specialty: 'MENTAL HEALTH COUNSELOR',
    rating: 5.0,
    experience: '15 years exp.',
    description: 'Trauma-informed specialist helping clients navigate PTSD and emotional resilience.',
    price: 145,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'PSYCHIATRIST',
    rating: 4.9,
    experience: '10 years exp.',
    description: 'Expert in medication management and psychotherapy for mood disorders and ADHD.',
    price: 160,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop',
  },
];

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({ day: prevMonthDays - i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length, inMonth: false });
  }
  return cells;
}

function useNotification() {
  const [message, setMessage] = useState(null);
  const show = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);
  return { message, show };
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const { message, show } = useNotification();

  const [search, setSearch] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(getSelectedTherapist);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('01:00 PM');
  const [booking, setBooking] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const calendarDays = useMemo(() => buildCalendarDays(year, month), [year, month]);

  const filteredTherapists = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return THERAPISTS;
    return THERAPISTS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q)
    );
  }, [search]);

  const bookingSummary = useMemo(() => {
    const monthShort = currentMonth.toLocaleString('default', { month: 'short' });
    return `${monthShort} ${selectedDay}, ${selectedTime}`;
  }, [currentMonth, selectedDay, selectedTime]);

  useEffect(() => {
    if (search.trim() && filteredTherapists.length === 0) {
      show('❌ No therapists found');
    }
  }, [search, filteredTherapists.length, show]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        handleBookNow();
      }
      if (e.key === 'Escape') {
        navigate(-1);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTherapist, bookingSummary]);

  function handleSelectTherapist(name) {
    setSelectedTherapist(name);
    saveSelectedTherapist(name);
    show(`✓ ${name} selected!`);
  }

  function navigateMonth(direction) {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  }

  function handleSelectDay(day, inMonth) {
    if (!inMonth) return;
    setSelectedDay(day);
    const monthShort = currentMonth.toLocaleString('default', { month: 'short' });
    show(`📅 Date selected: ${monthShort} ${day}`);
  }

  function handleSelectTime(time) {
    setSelectedTime(time);
    show(`🕐 Time selected: ${time}`);
  }

  function handleBookNow() {
    if (!selectedTherapist) {
      show('❌ Please select a therapist');
      return;
    }

    const therapist = THERAPISTS.find((t) => t.name === selectedTherapist);
    const dateObj = new Date(year, month, selectedDay);
    const dateLabel = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setBooking(true);
    saveBooking({
      therapist: selectedTherapist,
      specialty: therapist?.specialty ?? '',
      price: therapist?.price ?? 0,
      img: therapist?.img ?? '',
      dateTime: bookingSummary,
      dateLabel,
      time: selectedTime,
      timeRange: `${selectedTime} · 60 min session`,
      duration: '60 Mins',
      bookedAt: new Date().toISOString(),
    });

    navigate(ROUTES.patient.bookingConfirm);
    setBooking(false);
  }

  return (
    <AppLayout
      variant="patient"
      showSidebar
      headerProps={{
        onAvatarClick: () => navigate(ROUTES.patient.profile),
      }}
    >
      <div className={styles.content}>

        <nav className={styles.pageNav} aria-label="Booking navigation">
          <NavLink
            to={ROUTES.patient.booking}
            className={({ isActive }) =>
              `${styles.pageNavLink} ${isActive ? styles.pageNavLinkActive : ''}`
            }
          >
            Find Therapist
          </NavLink>
          <NavLink
            to={ROUTES.patient.bookings}
            className={({ isActive }) =>
              `${styles.pageNavLink} ${isActive ? styles.pageNavLinkActive : ''}`
            }
          >
            My Bookings
          </NavLink>
        </nav>

        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search by name or specialist"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search therapists"
          />
        </div>

        <div className={styles.contentWrapper}>

          <section className={styles.therapistsSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Book an Appointment</h1>
              <p className={styles.sectionSubtitle}>
                Select a professional who aligns with your journey towards wellness.
              </p>
            </div>

            <div className={styles.therapistsList}>
              {filteredTherapists.map((t, index) => (
                <article
                  key={t.id}
                  className={`${styles.therapistCard} ${
                    selectedTherapist === t.name ? styles.therapistCardSelected : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={t.img} alt={t.name} className={styles.therapistImage} />
                  <div className={styles.therapistCardContent}>
                    <h3 className={styles.therapistName}>{t.name}</h3>
                    <p className={styles.therapistSpecialty}>{t.specialty}</p>
                    <div className={styles.therapistRating}>
                      <FaStar className={styles.starIcon} aria-hidden="true" />
                      <span className={styles.ratingValue}>{t.rating}</span>
                      <span className={styles.ratingCount}>{t.experience}</span>
                    </div>
                    <p className={styles.therapistDescription}>{t.description}</p>
                  </div>
                  <div className={styles.therapistCardRight}>
                    <p className={styles.sessionLabel}>SESSION PRICE</p>
                    <p className={styles.sessionPrice}>
                      ${t.price}
                      <span className={styles.priceUnit}>/hr</span>
                    </p>
                    <button
                      type="button"
                      className={`${styles.btnSelect} ${
                        selectedTherapist === t.name ? styles.btnSelectActive : ''
                      }`}
                      onClick={() => handleSelectTherapist(t.name)}
                    >
                      {selectedTherapist === t.name ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.bookingSidebar}>
            <div className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <h2 className={styles.bookingTitle}>Select Date &amp; Time</h2>
                <div className={styles.calendarNav}>
                  <button
                    type="button"
                    className={styles.navBtn}
                    aria-label="Previous month"
                    onClick={() => navigateMonth(-1)}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    className={styles.navBtn}
                    aria-label="Next month"
                    onClick={() => navigateMonth(1)}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <div>
                <h3 className={styles.calendarMonth}>{monthLabel}</h3>
                <div className={styles.calendarHeader}>
                  {DAY_LABELS.map((label, i) => (
                    <div key={`${label}-${i}`} className={styles.dayLabel}>{label}</div>
                  ))}
                </div>
                <div className={styles.calendarBody}>
                  {calendarDays.map((cell, i) => (
                    <button
                      key={`${cell.day}-${i}`}
                      type="button"
                      className={`${styles.calendarDay} ${
                        !cell.inMonth ? styles.calendarDayEmpty : ''
                      } ${cell.inMonth && cell.day === selectedDay ? styles.calendarDaySelected : ''}`}
                      onClick={() => handleSelectDay(cell.day, cell.inMonth)}
                      disabled={!cell.inMonth}
                    >
                      {cell.day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={styles.timeSlotsTitle}>AVAILABLE TIME SLOTS</h3>
                <div className={styles.timeSlotsGrid}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`${styles.timeSlot} ${
                        selectedTime === slot ? styles.timeSlotSelected : ''
                      }`}
                      onClick={() => handleSelectTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.bookingSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>BOOKING FOR</span>
                  <span className={styles.summaryValue}>{bookingSummary}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>DURATION</span>
                  <span className={styles.summaryValue}>60 Mins</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnBookNow}
                onClick={handleBookNow}
                disabled={booking}
              >
                <FaCalendarCheck aria-hidden="true" />
                Book Now
              </button>

              <div className={styles.securityNotice}>
                <FaShieldAlt className={styles.securityIcon} aria-hidden="true" />
                <span className={styles.securityTitle}>Secure &amp; Confidential</span>
                <p className={styles.securityText}>
                  All sessions are HIPAA-compliant and end-to-end encrypted.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {message && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </AppLayout>
  );
}
