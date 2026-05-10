import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors]       = useState({});

  function validate() {
    const e = {};
    if (!email.trim())                                   e.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email    = 'Invalid email address';
    if (!password)                                       e.password = 'Password is required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // TODO: replace with real API call → authService.login(...)
    console.log('Login payload:', { email, password, rememberMe });
    navigate('/dashboard');
  }

  function handleSocialLogin(provider) {
    console.log('Social login:', provider);
  }

  return (
    <div className={styles.container}>

      <div className={styles.imageSection}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663531265658/gtqrRfypCCTCgjq5vWs5H8/sunset-landscape-cMkeb9xnJeoTHVmqZAZxzo.webp"
          alt="Sunset landscape"
        />
        <div className={styles.imageOverlay} />
        <div className={styles.imageText}>
          <h2>Reconnect with yourself.</h2>
          <p>Your journey to mental clarity and emotional balance continues here.</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formSection}>

        {/* Mobile logo */}
        <div className={styles.mobileLogo}>
          <div className={styles.mobileLogoIcon}>E</div>
          <span className={styles.mobileLogoText}>Eltherabito</span>
        </div>

        <div className={styles.formWrapper}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>E</div>
              <span className={styles.logoText}>Eltherabito</span>
            </div>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Log in to continue your mindfulness journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              />
              {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div className={styles.passWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className={styles.formGroup}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkLabel}>Stay logged in for 30 days</span>
              </label>
            </div>

            <button type="submit" className={styles.loginBtn}>Log In</button>

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>Or continue with</span>
              <div className={styles.dividerLine} />
            </div>

            
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('google')}>
                <FcGoogle size={18}  /> <span>Google</span>
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => handleSocialLogin('facebook')}>
                <FaFacebook size={18} color="#1877F2" /> <span>Facebook</span>
              </button>
            </div>
          </form>

          <p className={styles.signupSection}>
            New to Eltherabito?{' '}
            <Link to="/signup" className={styles.signupLink}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}