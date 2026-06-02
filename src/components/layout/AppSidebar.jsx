import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND, PATIENT_NAV, getPatientActiveNav } from './navConfig';
import styles from './AppSidebar.module.css';

const SIDEBAR_USER = {
  name: 'Alex Johnson',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
};

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

      <div className={styles.user}>
        <img className={styles.userAvatar} src={SIDEBAR_USER.avatar} alt={SIDEBAR_USER.name} />
        <span className={styles.userName}>{SIDEBAR_USER.name}</span>
      </div>
    </aside>
  );
}
