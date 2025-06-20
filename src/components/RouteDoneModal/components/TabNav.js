import styles from '../RouteDoneModal.module.css';

export default function TabNav({ activeTab, onChange }) {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tabButton} ${activeTab === 'route' ? styles.activeTab : ''}`}
        onClick={() => onChange('route')}
      >
        Ruta
      </button>
      <button
        className={`${styles.tabButton} ${activeTab === 'sessions' ? styles.activeTab : ''}`}
        onClick={() => onChange('sessions')}
      >
        Sesiones
      </button>
    </div>
  );
}
