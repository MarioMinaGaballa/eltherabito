import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import styles from './AppLayout.module.css';

export default function AppLayout({
  children,
  variant = 'patient',
  showSidebar = true,
  showSearch = false,
  sidebarSubtitle,
  headerProps = {},
  headerSlot,
  footer,
  className = '',
}) {
  const isPatientShell = variant === 'patient';
  const useSidebarLayout = isPatientShell && showSidebar;

  return (
    <div className={`${styles.page} ${className}`}>
      <AppHeader
        variant={variant}
        showSearch={showSearch}
        {...headerProps}
        logoHref={headerProps.logoHref ?? (variant === 'patient' ? '/dashboard' : undefined)}
      >
        {headerSlot}
      </AppHeader>

      {useSidebarLayout ? (
        <div className={styles.body}>
          <AppSidebar subtitle={sidebarSubtitle} />
          <div className={styles.main}>{children}</div>
        </div>
      ) : (
        <div className={styles.bodyNoSidebar}>
          <div className={styles.mainFull}>{children}</div>
        </div>
      )}

      {footer}
    </div>
  );
}
