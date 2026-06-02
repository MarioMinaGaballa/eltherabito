import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheck, FaEnvelope, FaPhone, FaShieldAlt, FaSave,
} from 'react-icons/fa';
import { ROUTES } from '../../routes/paths';
import AppLayout from '../../components/layout/AppLayout';
import { BRAND } from '../../components/layout/navConfig';
import styles from './EditProfile.module.css';
import { PROFILE_STORAGE_KEY, loadSavedPhone } from '../../utils/profileStorage';

const PROFILE_DRAFT_KEY = 'eltherabito-profile-draft';
const DEFAULT_EMAIL = 'ahmed.ali@example.com';
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop';

function useNotification() {
  const [message, setMessage] = useState(null);
  const show = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);
  return { message, show };
}

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { message, show } = useNotification();

  const [email] = useState(DEFAULT_EMAIL);
  const [phone, setPhone] = useState(loadSavedPhone);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);

  const saveDraft = useCallback((value) => {
    try {
      localStorage.setItem(
        PROFILE_DRAFT_KEY,
        JSON.stringify({ email, phone: value, lastSaved: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
  }, [email]);

  const handleCancel = useCallback(() => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate(-1);
    }
  }, [navigate]);

  const handleSave = useCallback(() => {
    if (!phone.trim()) {
      show('❌ Please enter a phone number');
      return;
    }

    setSaving(true);
    const profileData = {
      email,
      phone: phone.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      localStorage.removeItem(PROFILE_DRAFT_KEY);
    } catch {
      show('❌ Could not save profile');
      setSaving(false);
      return;
    }

    show('✓ Profile updated successfully!');
    setTimeout(() => {
      navigate(ROUTES.patient.profile);
      setSaving(false);
    }, 1500);
  }, [email, phone, navigate, show]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleSave, handleCancel]);

  function handlePhoneChange(e) {
    const value = e.target.value;
    setPhone(value);
    saveDraft(value);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      show('❌ Image must be 2MB or smaller');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        show('📸 Profile picture updated');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <AppLayout
      variant="patient"
      showSidebar
      showHeader={false}
      sidebarSubtitle={BRAND.portalTagline}
      headerProps={{
        userImage: avatar,
      }}
    >
      <div className={styles.content}>

        <div className={styles.breadcrumbSection}>
          <button
            type="button"
            className={styles.breadcrumbLink}
            onClick={() => navigate(ROUTES.patient.profile)}
          >
            Profile
          </button>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Edit Settings</span>
        </div>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Update Personal Information</h1>
          <p className={styles.pageSubtitle}>
            Manage your profile details and preferences to ensure your medical records stay up to date.
          </p>
        </div>

        <div className={styles.profileSection}>

          <div className={styles.profilePictureCard}>
            <div className={styles.pictureInfoCenter}>
              <div className={styles.pictureContainer}>
                <img src={avatar} alt="Profile" className={styles.profilePicture} />
                <div className={styles.pictureBadge} aria-hidden="true">
                  <FaCheck />
                </div>
              </div>
              <h3 className={styles.pictureTitle}>Profile Picture</h3>
              <p className={styles.pictureSubtitle}>JPEG, PNG or GIF. Max size 2MB.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className={styles.hiddenInput}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={styles.btnUpload}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload New
              </button>
            </div>
          </div>

          <div className={styles.detailsCard}>
            <h2 className={styles.cardTitle}>Basic Details</h2>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <div className={styles.formInputGroup}>
                <FaEnvelope className={styles.inputIcon} aria-hidden="true" />
                <input type="email" id="email" className={styles.formControl} value={email} readOnly />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
              <div className={styles.formInputGroup}>
                <FaPhone className={styles.inputIcon} aria-hidden="true" />
                <input
                  type="tel"
                  id="phone"
                  className={styles.formControl}
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              <p className={styles.formHint}>We&apos;ll use this for appointment reminders.</p>
            </div>
          </div>

          <div className={styles.privacyCard}>
            <div className={styles.privacyHeader}>
              <FaShieldAlt className={styles.privacyIcon} aria-hidden="true" />
              <h3 className={styles.privacyTitle}>Data Privacy</h3>
            </div>
            <p className={styles.privacyText}>
              Your information is securely encrypted and only shared with your designated
              healthcare providers at Eltherabito.
            </p>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={`${styles.btn} ${styles.btnCancel}`} onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSave}`}
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave aria-hidden="true" />
            Save Changes
          </button>
        </div>

        <footer className={styles.pageFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <img src={avatar} alt="" className={styles.footerAvatar} />
              <div>
                <p className={styles.footerUserName}>Ahmed Ali</p>
                <p className={styles.footerUserRole}>Patient</p>
              </div>
            </div>
            <div className={styles.footerSection}>
              <button type="button" className={styles.footerLink} onClick={() => show('Support')}>
                Support
              </button>
              <button type="button" className={styles.footerLink} onClick={() => show('Terms')}>
                Terms
              </button>
              <button type="button" className={styles.footerLink} onClick={() => show('Privacy')}>
                Privacy
              </button>
            </div>
          </div>
        </footer>
      </div>

      {message && (
        <div className={styles.notification} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </AppLayout>
  );
}
