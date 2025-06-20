import { useState, useCallback, memo } from "react";
import styles from "./RouteDoneModal.module.css";
import Header from "./components/Header";
import RouteInfo from "./components/RouteInfo";
import TabNav from "./components/TabNav";
import SessionCardComponent from "./components/SessionCard";

// SessionCard moved to its own file (components/SessionCard.js)
const SessionCard = memo(({ session }) => {
  // Cada tarjeta maneja su propio estado de expansión
  const hola = "hola";

  const [isExpanded, setIsExpanded] = useState(false);

  // Función para alternar el estado de expansión local
  const toggleExpansion = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionHeader} onClick={toggleExpansion}>
        <div className={styles.sessionHeaderLeft}>
          <span
            className={isExpanded ? styles.chevronDown : styles.chevronRight}
          >
            {isExpanded ? "▼" : "▶"}
          </span>
          <div className={styles.sessionInfo}>
            <div className={styles.sessionDate}>{session.date}</div>
            <div className={styles.sessionSubInfoContainer}>
              {session.weather && (
                <div className={styles.sessionWeather}>
                  <span className={styles.weatherIcon}>☁️</span>{" "}
                  {session.weather}
                </div>
              )}
              <div className={styles.sessionAttempts}>
                {session.attempts} intentos
              </div>
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
              <div className={styles.attemptCordada}>
                Cordada: {attempt.cordada}
              </div>
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
});

export default function RouteDoneModal({ route, onClose }) {
  const [activeTab, setActiveTab] = useState("route");
  const [showAttemptForm, setShowAttemptForm] = useState(false);

  // Datos de ejemplo para la ruta - ajustados para coincidir con la imagen de referencia
  const routeData = {
    name: "Biographie",
    location: "Ceüse",
    grade: "9a+",
    isProject: true,
    attempts: 4,
    sessions: 2,
    rating: 5,
  };

  // Datos de ejemplo para las sesiones - ajustados para coincidir con la imagen de referencia
  const sessionsData = [
    {
      id: 1,
      date: "miércoles, 31 de mayo de 2023",
      attempts: 2,
      expanded: false,
      attempts_detail: [
        {
          time: "10:00",
          physical: "bueno",
          mental: "concentrado",
          note: "Trabajando los movimientos",
          cordada: "Juan",
          hasMedia: true,
        },
        {
          time: "11:00",
          physical: "bueno",
          mental: "concentrado",
          note: "Entendiendo la secuencia",
          hasMedia: true,
        },
      ],
      sessionNote: "Primera sesión, reconocimiento de la ruta.",
    },
    {
      id: 2,
      date: "lunes, 19 de junio de 2023",
      attempts: 2,
      weather: "Ideal, 14°C",
      isCompleted: true,
      expanded: false,
    },
  ];

  // Ya no necesitamos un estado global para la sesión expandida
  // pues cada SessionCard maneja su propio estado

  // Optimizado con useCallback para evitar recreaciones innecesarias
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Formulario enviado");
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <Header title={routeData.name} onClose={onClose} />

      <RouteInfo
        location={routeData.location}
        grade={routeData.grade}
        rating={routeData.rating}
        isProject={routeData.isProject}
      />

      <TabNav activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "route" ? (
        // Contenido de la pestaña Ruta
        <div className={styles.tabContent}>
          {/* Pegues registrados */}
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Pegues registrados</h3>
            <div className={styles.attemptsCounter}>
              <span className={styles.attemptsNumber}>
                {routeData.attempts}
              </span>{" "}
              intentos registrados
              <span className={styles.sessionCount}>
                en {routeData.sessions} sesiones
              </span>
            </div>
          </div>

          {/* Beta personal */}
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Beta personal</h3>
            <input
              type='text'
              className={styles.inputField}
              placeholder='Agarre lateral en el crux, descanso antes del techo'
            />
          </div>

          {/* Opinión del grado */}
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Opinión del grado</h3>
            <input
              type='text'
              className={styles.inputField}
              placeholder='Correcto'
            />
          </div>

          {/* Notas generales */}
          <div className={styles.sectionContainer}>
            <h3 className={styles.sectionTitle}>Notas generales de la ruta</h3>
            <textarea
              className={styles.textArea}
              placeholder='Información sobre la ruta: aproximación, material necesario, mejor época, condiciones ideales...'
              rows={4}
            />
          </div>

          {/* Botón de registrar intento */}
          {!showAttemptForm && (
            <button
              className={styles.registerButton}
              onClick={() => setShowAttemptForm(true)}
            >
              <span>+</span> Registrar intento
            </button>
          )}

          {/* Formulario de registro de intento */}
          {showAttemptForm && (
            <div className={styles.attemptFormSection}>
              <div className={styles.attemptFormHeader}>
                <h2 className={styles.attemptFormTitle}>
                  Registrar nuevo intento
                </h2>
                <button
                  className={styles.closeAttemptForm}
                  onClick={() => setShowAttemptForm(false)}
                >
                  ×
                </button>
              </div>

              <div className={styles.attemptFormRow}>
                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input
                    type='text'
                    className={styles.inputField}
                    placeholder='14/06/2025'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Hora</label>
                  <input
                    type='text'
                    className={styles.inputField}
                    placeholder='12:30 p.m.'
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>¿Encadenaste?</label>
                <select className={styles.selectField}>
                  <option value=''>Seleccionar</option>
                  <option value='si'>Sí</option>
                  <option value='no'>No</option>
                  <option value='casiAlFinal'>
                    A punto (caída en último movimiento)
                  </option>
                </select>
              </div>

              <div className={styles.attemptFormRow}>
                <div className={styles.formGroup}>
                  <label>Estado físico</label>
                  <select className={styles.selectField}>
                    <option value=''>Seleccionar</option>
                    <option value='excelente'>Excelente</option>
                    <option value='bueno'>Bueno</option>
                    <option value='regular'>Regular</option>
                    <option value='malo'>Malo</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Estado mental</label>
                  <select className={styles.selectField}>
                    <option value=''>Seleccionar</option>
                    <option value='enfocado'>Enfocado</option>
                    <option value='relajado'>Relajado</option>
                    <option value='ansioso'>Ansioso</option>
                    <option value='distraido'>Distraído</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Cordada (opcional)</label>
                <input
                  type='text'
                  className={styles.inputField}
                  placeholder='Nombre de tu compañero de escalada'
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notas del intento</label>
                <textarea
                  className={styles.textArea}
                  placeholder='Describe cómo fue el intento, hasta dónde llegaste, qué movimientos te costaron...'
                  rows={4}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Archivo multimedia (opcional)</label>
                <button className={styles.fileUploadButton}>
                  <span className={styles.uploadIcon}>↑</span>
                  Seleccionar foto o video
                </button>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveButton}>Guardar intento</button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowAttemptForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Contenido de la pestaña Sesiones
        <div className={styles.tabContent}>
          <div className={styles.sessionsList}>
            <div className={styles.sessionTittleAndCountContainer}>
              <h2 className={styles.sessionsTitle}>Historial de sesiones</h2>
              <span className={styles.sessionCount}>
                {routeData.sessions} sesiones
              </span>
            </div>

            {sessionsData.map((session) => (
              <div key={session.id}>
                <SessionCardComponent session={session} />
              </div>
            ))}

            <button className={styles.addSessionButton}>
              <span>+</span> Añadir nueva sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
