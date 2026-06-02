import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import styles from './DisplayPreferences.module.css';

const THEMES = [
  { id: 'light', label: 'Light Mode',  preview: { bg: '#f9fafb', bar: '#d1d5db' } },
  { id: 'dark',  label: 'Dark Mode',   preview: { bg: '#1e293b', bar: '#3b82f6' } },
  { id: 'calm',  label: 'Calm Mode',   preview: { bg: '#e8f5f0', bar: '#a7d7c5' } },
];

const ACCENTS = ['#2563eb', '#16a34a', '#4f46e5', '#dc2626', '#f59e0b'];

const FONT_FAMILIES = [
  'Manrope (System Default)', 'Inter', 'Roboto', 'Georgia', 'Courier New',
];

const FONT_WEIGHTS = ['Light', 'Regular', 'Bold'];

const DEFAULTS = {
  theme:      'calm',
  accent:     '#2563eb',
  fontSize:   2,
  fontWeight: 'Regular',
  fontFamily: 'Manrope (System Default)',
};

export default function DisplayPreferences() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  function set(key, val) { setPrefs(p => ({ ...p, [key]: val })); }

  function handleReset() { setPrefs(DEFAULTS); }

  function handleSave() {
    console.log('Saved preferences:', prefs);
    alert('Preferences saved!');
  }

  return (
    <AppLayout variant="patient" showSidebar showHeader={false}>
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Display Preferences</h1>
        <p className={styles.pageDesc}>
          Personalize your therapeutic environment for better focus and mental well-being.
          Changes apply instantly across all devices.
        </p>

        {/* ── THEME ── */}
        <div className={styles.sectionHeading}><span>🎨</span> Theme &amp; Visuals</div>
        <div className={styles.card}>

          <div className={styles.themeGrid}>
            {THEMES.map((t) => (
              <div
                key={t.id}
                className={`${styles.themeCard} ${prefs.theme === t.id ? styles.themeSelected : ''}`}
                onClick={() => set('theme', t.id)}
              >
                <div className={styles.themePreview} style={{ background: t.preview.bg }}>
                  <div className={styles.themeBar} style={{ background: t.preview.bar }} />
                </div>
                <div className={styles.themeFooter}>
                  {t.label}
                  <span className={`${styles.radio} ${prefs.theme === t.id ? styles.radioChecked : ''}`} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.accentLabel}>Accent Colors</div>
          <div className={styles.accentRow}>
            {ACCENTS.map((color) => (
              <div
                key={color}
                className={`${styles.accentDot} ${prefs.accent === color ? styles.accentSelected : ''}`}
                style={{ background: color }}
                onClick={() => set('accent', color)}
              />
            ))}
          </div>

        </div>

        {/* ── TYPOGRAPHY ── */}
        <div className={styles.sectionHeading}><span>🔤</span> Typography</div>
        <div className={styles.card}>

          <div className={styles.typoGrid}>
            <div className={styles.typoCol}>
              <div className={styles.typoLabel}>Font Size</div>
              <input
                type="range" min="1" max="3" step="1"
                value={prefs.fontSize}
                onChange={(e) => set('fontSize', Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Small</span><span>Default</span><span>Large</span>
              </div>
            </div>

            <div className={styles.typoCol}>
              <div className={styles.typoLabel}>Font Weight</div>
              <div className={styles.fwBtns}>
                {FONT_WEIGHTS.map((w) => (
                  <button
                    key={w}
                    className={`${styles.fwBtn} ${prefs.fontWeight === w ? styles.fwBtnActive : ''}`}
                    onClick={() => set('fontWeight', w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.fontFamilyWrap}>
            <label className={styles.fontFamilyLabel}>Font Family</label>
            <select
              className={styles.select}
              value={prefs.fontFamily}
              onChange={(e) => set('fontFamily', e.target.value)}
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ── FOOTER BUTTONS ── */}
      <div className={styles.footerBtns}>
        <button type="button" className={styles.btnReset} onClick={handleReset}>Reset to Default</button>
        <button type="button" className={styles.btnSave} onClick={handleSave}>Save Changes</button>
      </div>
    </AppLayout>
  );
}