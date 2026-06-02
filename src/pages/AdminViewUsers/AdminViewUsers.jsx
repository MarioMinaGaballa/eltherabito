import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminViewUsers.module.css';

// Sample patient data
const patientsData = [
  {
    id: 1,
    initials: 'SJ',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+20 100 123 4567',
    avatar: null
  },
  {
    id: 2,
    initials: 'MR',
    name: 'Michael Ross',
    email: 'm.ross_88@domain.co',
    phone: '+20 111 234 5678',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 3,
    initials: 'AB',
    name: 'Amara Bennett',
    email: 'amara.b.consulting@web.net',
    phone: '+20 122 345 6789',
    avatar: null
  },
  {
    id: 4,
    initials: 'DL',
    name: 'David Lee',
    email: 'david.lee.tech@example.com',
    phone: '+20 155 456 7890',
    avatar: null
  },
  {
    id: 5,
    initials: 'EM',
    name: 'Elena Martinez',
    email: 'e.martinez@healthplus.org',
    phone: '+20 166 567 8901',
    avatar: null
  },
  {
    id: 6,
    initials: 'JW',
    name: 'James Wilson',
    email: 'j.wilson@corp.com',
    phone: '+20 114 678 9012',
    avatar: null
  },
  {
    id: 7,
    initials: 'SC',
    name: 'Sophie Chen',
    email: 'sophie.c@design.studio',
    phone: '+20 128 789 0123',
    avatar: null
  },
  {
    id: 8,
    initials: 'RT',
    name: 'Robert Taylor',
    email: 'r.taylor@university.edu',
    phone: '+20 109 890 1234',
    avatar: null
  },
  {
    id: 9,
    initials: 'LB',
    name: 'Linda Brooks',
    email: 'linda.brooks@provider.net',
    phone: '+20 115 901 2345',
    avatar: null
  },
  {
    id: 10,
    initials: 'AG',
    name: 'Alice Green',
    email: 'alice.g@freelance.io',
    phone: '+20 120 012 3456',
    avatar: null
  },
  {
    id: 11,
    initials: 'HS',
    name: 'Hannah Scott',
    email: 'hannah.scott@webmail.com',
    phone: '+20 150 123 4567',
    avatar: null
  },
  {
    id: 12,
    initials: 'OM',
    name: 'Olivia Moore',
    email: 'olivia.m@marketing.ag',
    phone: '+20 102 234 5678',
    avatar: null
  },
  {
    id: 13,
    initials: 'CL',
    name: 'Chloe Lopez',
    email: 'chloe.l@hospital.net',
    phone: '+20 112 345 6789',
    avatar: null
  },
  {
    id: 14,
    initials: 'JD',
    name: 'John Davis',
    email: 'john.d@tech.io',
    phone: '+20 121 456 7890',
    avatar: null
  },
  {
    id: 15,
    initials: 'EM',
    name: 'Emma White',
    email: 'emma.w@design.com',
    phone: '+20 131 567 8901',
    avatar: null
  },
  {
    id: 16,
    initials: 'CB',
    name: 'Christopher Brown',
    email: 'c.brown@business.co',
    phone: '+20 141 678 9012',
    avatar: null
  },
  {
    id: 17,
    initials: 'OJ',
    name: 'Olivia Johnson',
    email: 'olivia.j@company.com',
    phone: '+20 151 789 0123',
    avatar: null
  },
  {
    id: 18,
    initials: 'LM',
    name: 'Lucas Martinez',
    email: 'lucas.m@service.net',
    phone: '+20 161 890 1234',
    avatar: null
  },
  {
    id: 19,
    initials: 'IS',
    name: 'Isabella Smith',
    email: 'isabella.s@studio.io',
    phone: '+20 171 901 2345',
    avatar: null
  },
  {
    id: 20,
    initials: 'MW',
    name: 'Mason Wilson',
    email: 'mason.w@agency.com',
    phone: '+20 181 012 3456',
    avatar: null
  },
  {
    id: 21,
    initials: 'AR',
    name: 'Ava Rodriguez',
    email: 'ava.r@creative.co',
    phone: '+20 191 123 4567',
    avatar: null
  },
  {
    id: 22,
    initials: 'ET',
    name: 'Ethan Thompson',
    email: 'ethan.t@solutions.net',
    phone: '+20 201 234 5678',
    avatar: null
  },
  {
    id: 23,
    initials: 'SC',
    name: 'Sophia Clark',
    email: 'sophia.c@platform.io',
    phone: '+20 211 345 6789',
    avatar: null
  },
  {
    id: 24,
    initials: 'LH',
    name: 'Liam Harris',
    email: 'liam.h@ventures.com',
    phone: '+20 221 456 7890',
    avatar: null
  },
  {
    id: 25,
    initials: 'MG',
    name: 'Mia Garcia',
    email: 'mia.g@digital.net',
    phone: '+20 231 567 8901',
    avatar: null
  },
  {
    id: 26,
    initials: 'NM',
    name: 'Noah Martin',
    email: 'noah.m@innovation.co',
    phone: '+20 241 678 9012',
    avatar: null
  },
  {
    id: 27,
    initials: 'EP',
    name: 'Emma Perez',
    email: 'emma.p@systems.io',
    phone: '+20 251 789 0123',
    avatar: null
  },
  {
    id: 28,
    initials: 'OT',
    name: 'Oliver Taylor',
    email: 'oliver.t@networks.com',
    phone: '+20 261 890 1234',
    avatar: null
  },
  {
    id: 29,
    initials: 'AC',
    name: 'Amelia Clark',
    email: 'amelia.c@services.net',
    phone: '+20 271 901 2345',
    avatar: null
  },
  {
    id: 30,
    initials: 'BL',
    name: 'Benjamin Lee',
    email: 'benjamin.l@enterprise.io',
    phone: '+20 281 012 3456',
    avatar: null
  },
  {
    id: 31,
    initials: 'CW',
    name: 'Charlotte White',
    email: 'charlotte.w@global.com',
    phone: '+20 291 123 4567',
    avatar: null
  },
  {
    id: 32,
    initials: 'DH',
    name: 'Daniel Harris',
    email: 'daniel.h@tech.net',
    phone: '+20 301 234 5678',
    avatar: null
  },
  {
    id: 33,
    initials: 'EM',
    name: 'Evelyn Martin',
    email: 'evelyn.m@solutions.io',
    phone: '+20 311 345 6789',
    avatar: null
  },
  {
    id: 34,
    initials: 'FT',
    name: 'Frank Thompson',
    email: 'frank.t@digital.com',
    phone: '+20 321 456 7890',
    avatar: null
  },
  {
    id: 35,
    initials: 'GG',
    name: 'Grace Garcia',
    email: 'grace.g@network.net',
    phone: '+20 331 567 8901',
    avatar: null
  },
  {
    id: 36,
    initials: 'HM',
    name: 'Henry Martinez',
    email: 'henry.m@platform.io',
    phone: '+20 341 678 9012',
    avatar: null
  },
  {
    id: 37,
    initials: 'IR',
    name: 'Iris Rodriguez',
    email: 'iris.r@services.com',
    phone: '+20 351 789 0123',
    avatar: null
  },
  {
    id: 38,
    initials: 'JD',
    name: 'Jack Davis',
    email: 'jack.d@systems.net',
    phone: '+20 361 890 1234',
    avatar: null
  },
  {
    id: 39,
    initials: 'KJ',
    name: 'Katherine Johnson',
    email: 'katherine.j@enterprise.io',
    phone: '+20 371 901 2345',
    avatar: null
  },
  {
    id: 40,
    initials: 'LB',
    name: 'Leo Brown',
    email: 'leo.b@global.com',
    phone: '+20 381 012 3456',
    avatar: null
  },
  {
    id: 41,
    initials: 'MS',
    name: 'Megan Smith',
    email: 'megan.s@tech.net',
    phone: '+20 391 123 4567',
    avatar: null
  },
  {
    id: 42,
    initials: 'NW',
    name: 'Nathan Wilson',
    email: 'nathan.w@solutions.io',
    phone: '+20 401 234 5678',
    avatar: null
  }
];

export default function AdminViewUsers() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(patientsData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate pagination
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = patients.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle back to home
  const handleBackToHome = () => {
    navigate('/admin');
  };

  // Handle delete patient
  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients((prev) => {
        const updated = prev.filter((p) => p.id !== patientId);
        
        // Adjust current page if necessary
        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        
        return updated;
      });
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        {/* Back to Home Link */}
        <div className={styles.backLink}>
          <a onClick={handleBackToHome}>
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </a>
        </div>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>User Directory</h1>
          <p className={styles.pageSubtitle}>
            Total registered patients: <span className={styles.totalCount}>{patients.length}</span>
          </p>
        </div>

        {/* Table Container */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colPatient}>PATIENT NAME</th>
                <th className={styles.colEmail}>EMAIL ADDRESS</th>
                <th className={styles.colPhone}>PHONE NUMBER</th>
                <th className={styles.colActions}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((patient) => (
                <tr key={patient.id}>
                  {/* Patient Name Cell */}
                  <td>
                    <div className={styles.patientCell}>
                      <div
                        className={`${styles.patientAvatar} ${patient.avatar ? styles.image : ''}`}
                        style={patient.avatar ? { backgroundImage: `url('${patient.avatar}')` } : {}}
                      >
                        {!patient.avatar && patient.initials}
                      </div>
                      <p className={styles.patientName}>{patient.name}</p>
                    </div>
                  </td>

                  {/* Email Cell */}
                  <td>
                    <span className={styles.emailCell}>{patient.email}</span>
                  </td>

                  {/* Phone Cell */}
                  <td>
                    <span className={styles.phoneCell}>{patient.phone}</span>
                  </td>

                  {/* Actions Cell */}
                  <td>
                    <button
                      className={styles.actionBtn}
                      title="Delete patient"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Info */}
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, patients.length)} of {patients.length} results
            </span>
          </div>
          <nav aria-label="Page navigation">
            <ul className={styles.pagination}>
              {/* Previous button */}
              <li className={`${styles.pageItem} ${currentPage === 1 ? styles.pageItemDisabled : ''}`}>
                <a
                  className={styles.pageLink}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </a>
              </li>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`${styles.pageItem} ${page === currentPage ? styles.pageItemActive : ''}`}
                >
                  <a
                    className={styles.pageLink}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </a>
                </li>
              ))}

              {/* Next button */}
              <li className={`${styles.pageItem} ${currentPage === totalPages ? styles.pageItemDisabled : ''}`}>
                <a
                  className={styles.pageLink}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>
          <div className={styles.paginationInfoRight}>
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, patients.length)} of {patients.length} results
            </span>
            <span>{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footerSection}>
        <div className={`${styles.container} ${styles.footerContainer}`}>
          <div className={styles.footerRow}>
            <p className={styles.footerText}>
              © 2024 Eltherabito Mental Health Platform. Professional Administration Suite.
            </p>
            <div className={styles.footerLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">HIPAA Compliance</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
