import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import styles from './Signup.module.css';

function getPasswordStrength(password) {
  if (!password) return { width: '0%', color: '#e0e0e0', label: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score >= 4) return { width: '100%', color: '#22c55e', label: 'Strong' };
  if (score >= 2) return { width: '66%',  color: '#eab308', label: 'Medium' };
  return { width: '33%', color: '#ef4444', label: 'Weak' };
}

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole]         = useState('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [errors, setErrors]     = useState({});

  const strength = getPasswordStrength(password);

  function validate() {
    const e = {};
    if (!fullName.trim())                              e.fullName = 'Name is required';
    if (!email.trim())                                 e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email  = 'Invalid email address';
    if (!password)                                     e.password = 'Password is required';
    else if (password.length < 8)                      e.password = 'At least 8 characters';
    if (!agreed)                                       e.agreed   = 'You must agree to continue';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // TODO: replace with real API call → authService.signup(...)
    console.log('Signup payload:', { fullName, email, password, role });
    navigate('/dashboard');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Logo ── */}
        <div className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>E</div>
            <span className={styles.logoText}>Eltherabito</span>
          </div>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Join a community dedicated to mental well-being</p>
        </div>

        {/* ── Role tabs ── */}
        <div className={styles.roleTabs}>
          {['patient', 'therapist'].map((r) => (
            <button
              key={r}
              type="button"
              className={`${styles.roleBtn} ${role === r ? styles.roleBtnActive : ''}`}
              onClick={() => setRole(r)}
            >
              <FaUser size={16} />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FaUser size={16} /></span>
              <input
                type="text"
                className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors((prev) => ({ ...prev, fullName: '' })); }}
              />
            </div>
            {errors.fullName && <p className={styles.errorMsg}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FaEnvelope size={16} /></span>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
              />
            </div>
            {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><FaLock size={16} /></span>
              <input
                type={showPass ? 'text' : 'password'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: '' })); }}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            <p className={styles.hint}>Must be at least 8 characters with letters and numbers.</p>

            {password && (
              <div className={styles.strengthBar}>
                <div className={styles.strengthMeter}>
                  <div
                    className={styles.strengthFill}
                    style={{ width: strength.width, backgroundColor: strength.color }}
                  />
                </div>
                <span className={styles.strengthLabel} style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
            {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
          </div>

          {/* Terms */}
          <div className={styles.checkRow}>
            <input
              type="checkbox"
              id="terms"
              className={styles.checkbox}
              checked={agreed}
              onChange={(e) => { setAgreed(e.target.checked); setErrors((prev) => ({ ...prev, agreed: '' })); }}
            />
            <label htmlFor="terms" className={styles.checkLabel}>
              I agree to the{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreed && <p className={styles.errorMsg}>{errors.agreed}</p>}

          <button type="submit" className={styles.submitBtn}>
            Create Account <span>→</span>
          </button>
        </form>

        {/* ── Security badges ── */}
        <div className={styles.security}>
          <div className={styles.badge}><FaCheckCircle size={14} color="#22c55e" /> HIPAA COMPLIANT</div>
          <div className={styles.badge}><FaCheckCircle size={14} color="#22c55e" /> END-TO-END ENCRYPTED</div>
        </div>

        {/* ── Footer ── */}
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
        <p className={styles.copyright}>© 2026 Eltherabito Mental Health. All rights reserved.</p>
      </div>
    </div>
  );
}