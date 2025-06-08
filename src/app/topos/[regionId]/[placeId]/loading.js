import styles from "./PlacePage.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      {/* Skeleton del botón de sectores */}
      <div className={styles.buttonSkeleton}>
        <div className={styles.buttonText}></div>
      </div>

      {/* Skeleton de la información del lugar */}
      <div className={styles.placeSkeleton}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
        <div className={styles.infoSkeleton}></div>
      </div>
    </div>
  );
}
