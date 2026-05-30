import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND, PATIENT_NAV, getPatientActiveNav } from './navConfig';
import styles from './AppSidebar.module.css';

export default function AppSidebar({
  embedded = false,
  subtitle = BRAND.tagline,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeId = getPatientActiveNav(pathname);

  return (
    <aside className={`${styles.sidebar} ${embedded ? styles.sidebarEmbedded : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{BRAND.name}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        {PATIENT_NAV.map(({ id, label, Icon, path }) => (
          <button
            key={id}
            type="button"
            className={`${styles.navItem} ${activeId === id ? styles.navItemActive : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon className={styles.navIcon} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
