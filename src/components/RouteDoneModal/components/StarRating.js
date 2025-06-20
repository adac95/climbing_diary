import styles from '../RouteDoneModal.module.css';

export default function StarRating({ rating = 0 }) {
  return (
    <span className={styles.starsRating}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  );
}
