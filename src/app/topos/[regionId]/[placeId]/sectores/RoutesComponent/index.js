"use client";
import styles from "./RoutesComponent.module.css";
import { useState } from "react";
import Modal from "@components/Modal";
import RouteDoneModal from "@components/RouteDoneModal";

function RoutesComponent({ routes }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tableHeader}>
          <div className={styles.headerRow}>
            <div className={styles.headerCell}>NRO</div>
            <div className={styles.headerCell}>NOMBRE</div>
            <div className={styles.headerCell}>ESTILO</div>
            <div className={styles.headerCell}>GRADO</div>
            <div className={styles.headerCell}>DISTANCIA</div>
            <div className={styles.headerCell}>EQUIPAD@R</div>
            <div className={styles.headerCell}>AÑO</div>
            <div className={styles.headerCell}>PROYECTO</div>
            <div className={styles.headerCell}>ENCADENADA</div>
          </div>
        </div>
        {routes.map((route) => (
          <article key={route.id} className={styles.routeCard}>
            <div className={styles.routeInfo}>
            <div className={styles.routeInfoItem}>
              <p className={styles.routeInfoLabel}>Nro:</p>
              <p className={styles.routeInfoValue}>
                {route["number_of_route_in_picture"]}
              </p>
              </div>
            </div>
            <h3 className={styles.routeTitle}>{route.name}</h3>
            <div className={styles.routeInfo}>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Estilo:</p>
                <p className={styles.routeInfoValue}>{route.style_id.name}</p>
              </div>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Grado:</p>
                <p className={styles.routeInfoValue}>{route.grade}</p>
              </div>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Longitud:</p>
                <p className={styles.routeInfoValue}>{route.distance}</p>
              </div>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Equipador@s:</p>
                <p className={styles.routeInfoValue}>
                  {route["route_developer"]
                    .map((e) => e["developer_id"].name)
                    .join(", ")}
                </p>
              </div>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Año:</p>
                <p className={styles.routeInfoValue}>{route.year_opened}</p>
              </div>
              <div className={styles.routeInfoItem}>
                <p className={styles.routeInfoLabel}>Proyecto:</p>
                <p className={styles.routeInfoValue}>
                  {route.is_proyect ? "✔" : "❌"}
                </p>
              </div>
              <label className={styles.checkboxLabel}>
              <p className={styles.routeInfoLabel}>Encadenada:</p>
                <input
                  type='checkbox'
                  checked={route.completed}
                  onChange={() => setIsOpen(true)}
                  className={styles.checkbox}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <RouteDoneModal onClose={closeModal} />
        </Modal>
      )}
    </>
  );
}

export default RoutesComponent;
