import styles from '../RouteDoneModal.module.css';
import StarRating from './StarRating';

export default function RouteInfo({ location, grade, rating, isProject }) {
  return (
    <div className={styles.routeInfo}>
      <div className={styles.locationInfo}>
        <span className={styles.locationIcon}>📍</span>
        <span>{location}</span>
      </div>
      <div className={styles.gradeBox}>{grade}</div>
      <StarRating rating={rating} />
      {isProject && <span className={styles.projectBadge}>Proyecto</span>}
    </div>
  );
}
