import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapPin, FaTimes, FaUser, FaPhone, FaEnvelope,
  FaCalendar, FaClock, FaEdit,
} from 'react-icons/fa';
import {
  getBooking,
  saveBookingConfirmation,
} from '../../utils/bookingStorage';
import { loadSavedContact } from '../../utils/profileStorage';
import styles from './ConfirmSession.module.css';

function formatSpecialty(specialty) {
  if (!specialty) return 'Clinical Psychologist';
  return specialty
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useNotification() {
  const [message, setMessage] = useState(null);
  const show = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);
  return { message, show };
}

export default function ConfirmSession() {
  const navigate = useNavigate();
  const { message, show } = useNotification();
  const [booking] = useState(() => getBooking());
  const formInitialized = useRef(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/book-appointment', { replace: true });
      return;
    }
    if (formInitialized.current) return;
    formInitialized.current = true;

    const contact = loadSavedContact();
    setEmail(contact.email);
    setPhone(contact.mobile);
  }, [booking, navigate]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        navigate('/book-appointment');
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  if (!booking) {
    return null;
  }

  const doctorName = booking.therapist;
  const priceDisplay = `$${Number(booking.price).toFixed(2)}`;
  const dateDisplay = booking.dateLabel || booking.dateTime;
  const timeDisplay = booking.timeRange || `${booking.time || booking.dateTime} - 60 Mins`;

  function handleClose() {
    navigate('/book-appointment');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
      show('❌ Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show('❌ Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    show('✓ Confirming your booking...');

    const confirmation = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      doctorName,
      specialty: booking.specialty,
      date: dateDisplay,
      time: timeDisplay,
      price: priceDisplay,
      img: booking.img,
      confirmedAt: new Date().toISOString(),
    };

    saveBookingConfirmation(confirmation);

    setTimeout(() => {
      show('✓ Booking confirmed successfully!');
      setTimeout(() => {
        navigate('/my-booking');
        setSubmitting(false);
      }, 1000);
    }, 1500);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className={styles.dialog}>

        <div className={styles.header}>
          <button type="button" className={styles.logoBtn} onClick={() => navigate('/dashboard')}>
            <FaMapPin className={styles.logoIcon} aria-hidden="true" />
            <span className={styles.logoText}>Eltherabito</span>
          </button>
          <button
            type="button"
            className={styles.closeBtn}
            id="closeModal"
            aria-label="Close"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>

            <div className={styles.formSection}>
              <h1 id="confirm-title" className={styles.title}>Confirm Your Session</h1>
              <p className={styles.subtitle}>
                Secure your appointment with {doctorName}. All information is kept strictly confidential.
              </p>

              <div className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                  <FaUser className={styles.sectionHeaderIcon} aria-hidden="true" />
                  <h3>Your Information</h3>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
                      <div className={styles.inputWrapper}>
                        <FaUser className={styles.inputIcon} aria-hidden="true" />
                        <input
                          type="text"
                          id="firstName"
                          className={styles.formControl}
                          placeholder="e.g. Jane"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
                      <div className={styles.inputWrapper}>
                        <FaUser className={styles.inputIcon} aria-hidden="true" />
                        <input
                          type="text"
                          id="lastName"
                          className={styles.formControl}
                          placeholder="e.g. Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                    <div className={styles.inputWrapper}>
                      <FaPhone className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="tel"
                        id="phone"
                        className={styles.formControl}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                    <div className={styles.inputWrapper}>
                      <FaEnvelope className={styles.inputIcon} aria-hidden="true" />
                      <input
                        type="email"
                        id="email"
                        className={styles.formControl}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.btnConfirm} disabled={submitting}>
                      Confirm Booking
                    </button>
                    <button type="button" className={styles.btnCancel} onClick={handleClose}>
                      Cancel
                    </button>
                  </div>

                  <p className={styles.termsText}>
                    By clicking confirm, you agree to our <a href="#">Terms of Service</a> and{' '}
                    <a href="#">Privacy Policy</a>
                  </p>
                </form>
              </div>
            </div>

            <div className={styles.doctorSection}>
              <div className={styles.doctorImage}>
                <img
                  src={booking.img || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'}
                  alt={doctorName}
                  className={styles.doctorPhoto}
                />
              </div>

              <div className={styles.appointmentDetails}>
                <p className={styles.appointmentLabel}>APPOINTMENT WITH</p>
                <h2 className={styles.doctorName}>{doctorName}</h2>
                <p className={styles.doctorSpecialty}>{formatSpecialty(booking.specialty)}</p>

                <div className={styles.detailItem}>
                  <FaCalendar className={styles.detailIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.detailLabel}>Date</p>
                    <p className={styles.detailValue}>{dateDisplay}</p>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <FaClock className={styles.detailIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.detailLabel}>Time</p>
                    <p className={styles.detailValue}>{timeDisplay}</p>
                  </div>
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.priceRow}>
                    <span>Session Price</span>
                    <span className={styles.priceValue}>{priceDisplay}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Tax</span>
                    <span className={styles.priceValue}>Included</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.changeSelection}
                  onClick={() => navigate('/book-appointment')}
                >
                  <FaEdit aria-hidden="true" />
                  Change selection
                </button>
              </div>
            </div>

          </div>
        </div>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2026 Eltherabito Mental Health Services. Your privacy is our priority
          </p>
        </footer>
      </div>

      {message && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}
