import { memo, useState, useCallback } from 'react';
import styles from '../RouteDoneModal.module.css';

function SessionCard({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionHeader} onClick={toggleExpansion}>
        <div className={styles.sessionHeaderLeft}>
          <span className={isExpanded ? styles.chevronDown : styles.chevronRight}>
            {isExpanded ? '▼' : '▶'}
          </span>
          <div className={styles.sessionInfo}>
            <div className={styles.sessionDate}>{session.date}</div>
            <div className={styles.sessionSubInfoContainer}>
              {session.weather && (
                <div className={styles.sessionWeather}>
                  <span className={styles.weatherIcon}>☁️</span> {session.weather}
                </div>
              )}
              <div className={styles.sessionAttempts}>{session.attempts} intentos</div>
              {session.isCompleted && (
                <div className={styles.sessionCompleted}>
                  <span className={styles.completedIcon}>✓</span> Encadenada
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.sessionHeaderRight}>
          <button className={styles.sessionOptions}>⋮</button>
        </div>
      </div>

      {isExpanded && session.attempts_detail && (
        <div className={styles.sessionExpandedContent}>
          {session.attempts_detail.map((attempt, index) => (
            <div key={index} className={styles.attemptDetail}>
              <div className={styles.attemptHeader}>
                <div className={styles.attemptTime}>
                  <span className={styles.timeIcon}>⏱</span> {attempt.time}
                </div>
                <div className={styles.attemptStateInfo}>
                  <span className={styles.stateTag}>F: {attempt.physical}</span>
                  <span className={styles.stateTag}>M: {attempt.mental}</span>
                </div>
              </div>
              <div className={styles.attemptNote}>{attempt.note}</div>
              <div className={styles.attemptCordada}>Cordada: {attempt.cordada}</div>
              {attempt.hasMedia && (
                <button className={styles.mediaButton}>
                  <span className={styles.cameraIcon}>📷</span> Multimedia
                </button>
              )}
            </div>
          ))}

          {session.sessionNote && (
            <div className={styles.sessionNoteContainer}>
              <h4 className={styles.sessionNoteTitle}>Notas de la sesión:</h4>
              <p className={styles.sessionNoteText}>{session.sessionNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SessionCard);
