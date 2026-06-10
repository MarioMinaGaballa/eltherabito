import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserMd, FaCalendarCheck,
  FaPlus, FaChevronRight,
} from 'react-icons/fa';
import AppLayout from '../../components/layout/AppLayout';
import { BRAND } from '../../components/layout/navConfig';
import { ROUTES } from '../../routes/paths';
import adminService from '../../services/adminService';
import styles from './AdminDashboard.module.css';
/* ── Data ── */

const STATS_CONFIG = [
  { id: 'users',    icon: <FaUsers />,         color: 'blue',   label: 'Total Users',    key: 'totalUsers' },
  { id: 'doctors',  icon: <FaUserMd />,         color: 'indigo', label: 'Num Doctor',     key: 'totalDoctors' },
  { id: 'bookings', icon: <FaCalendarCheck />,  color: 'green',  label: 'Total Bookings', key: 'totalBookings' },
];

const FALLBACK_STATS = {
  totalUsers: 14802,
  totalDoctors: 342,
  totalBookings: 2540,
};

const FALLBACK_DOCTORS = [
  { id: 1, name: 'Dr. Aris Thorne',     specialty: 'Clinical Psychologist', exp: '12 Years Experience', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=440&fit=crop&crop=face' },
  { id: 2, name: 'Dr. Marcus Vane',     specialty: 'Cognitive Therapist',   exp: '8 Years Experience',  img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=440&fit=crop&crop=face' },
  { id: 3, name: 'Dr. Elena Rodriguez', specialty: 'Child & Adolescent',    exp: '15 Years Experience', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=440&fit=crop&crop=face' },
  { id: 4, name: 'Dr. James Wilson',    specialty: 'Psychiatrist',          exp: '20 Years Experience', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=440&fit=crop&crop=face' },
  { id: 5, name: 'Dr. Sarah Chen',      specialty: 'Family Therapist',      exp: '10 Years Experience', img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=440&fit=crop&crop=face' },
  { id: 6, name: 'Dr. Michael Brown',   specialty: 'Addiction Specialist',  exp: '14 Years Experience', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=440&fit=crop&crop=face' },
];

/* ── Counter hook ── */
function useCounter(target, duration = 1200) {

  const [val, setVal] = useState(0);
  useEffect(() => {
    let start; let frame;
    function update(now) {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(update);
    }
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return val;
}

/* ── Toast hook ── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  function show(msg, type = 'info') {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }
  return { toasts, show };
}

/* ── Stat Card ── */
function StatCard({ icon, color, label, value }) {
  const animated = useCounter(value);
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[`icon_${color}`]}`}>{icon}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{animated.toLocaleString()}</div>
    </div>
  );
}

/* ── Main Component ── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const { toasts, show } = useToast();

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats, using fallback:', err);
        setStats(FALLBACK_STATS);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await adminService.getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error('Failed to fetch doctors, using fallback:', err);
        setDoctors(FALLBACK_DOCTORS);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <AppLayout
      variant="admin"
      showSidebar={false}
      headerProps={{
        subtitle: BRAND.adminTagline,
        onNotify: () => show('No new notifications.', 'info'),
        userImage: 'https://randomuser.me/api/portraits/men/41.jpg',
      }}
    >
      <main className={styles.container}>

        {/* Platform Reports */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Platform Reports</h2>
          <div className={styles.statsGrid}>
            {statsLoading ? (
              <div>Loading statistics...</div>
            ) : stats ? (
              STATS_CONFIG.map(config => (
                <StatCard
                  key={config.id}
                  icon={config.icon}
                  color={config.color}
                  label={config.label}
                  value={stats[config.key] || 0}
                />
              ))
            ) : (
              <div>Failed to load statistics</div>
            )}
          </div>
        </section>

        {/* User Directory */}
        <section className={styles.section}>
          <div className={styles.dirHeader}>
            <h2 className={styles.sectionTitle}>User Directory</h2>
            <span className={styles.regBadge}>
              Total registered patients: <strong>42</strong>
            </span>
          </div>
          <div className={styles.dirCard}>
            <button className={styles.btnViewAll} onClick={() => navigate('/admin/users')}>
              View All Users
            </button>
          </div>
        </section>

        {/* Doctor Management */}
        <section className={styles.section}>
          <div className={styles.doctorHeader}>
            <h2 className={styles.sectionTitle}>Doctor Management</h2>
            <button className={styles.btnAddDoctor} onClick={() => navigate('/admin/add-doctor')}>
              <FaPlus /> Add New Doctor
            </button>
          </div>

          <div className={styles.doctorsGrid}>
            {doctors.slice(0, showAllDoctors ? doctors.length : 3).map(d => (
              <div key={d.id} className={styles.doctorCard}>
                <img className={styles.doctorPhoto} src={d.img} alt={d.name} />
                <div className={styles.doctorBody}>
                  <div className={styles.doctorName}>{d.name}</div>
                  <div className={styles.doctorSpecialty}>{d.specialty}</div>
                  <div className={styles.doctorFooter}>
                    <span className={styles.doctorExp}>{d.exp}</span>
                  
                  </div>
                </div>
              </div>
            ))}

            {/* View More tile */}
            <div
              className={styles.viewMoreTile}
              role="button"
              tabIndex={0}
              onClick={() => setShowAllDoctors(!showAllDoctors)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowAllDoctors(!showAllDoctors); }}
            >
              <div className={styles.viewMoreArrow}><FaChevronRight /></div>
              <div className={styles.viewMoreTitle}>{showAllDoctors ? 'Show Less Doctors' : 'View More Doctors'}</div>
              <div className={styles.viewMoreSub}>{showAllDoctors ? 'Collapse the doctor roster' : 'Access the full roster of healthcare professionals'}</div>
            </div>
          </div>
        </section>

      </main>

      {/* Toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}