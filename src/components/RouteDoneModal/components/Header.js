import styles from '../RouteDoneModal.module.css';

export default function Header({ title, onClose }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.routeTitle}>{title}</h1>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
