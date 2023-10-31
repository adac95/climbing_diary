import React from "react";
import styles from "./ModalRouteDone.module.css";

function ModalRouteDone() {
  return (
    <section className={styles.modal}>
      <div className={styles.container}>
        <button className={styles.closeButton} >X</button>
        <h2>Encadenado!!</h2>
        <label className={styles.label}>
          Nro de pegues <input className={styles.input} type='number' />
        </label>
        <label className={styles.label}>
          Fecha <input className={styles.input} type='date' />
        </label>
        <label className={styles.label}>
          Cordada <input className={styles.input} type='text' />
        </label>
        <label className={styles.label}>
          comentarios <input className={styles.input} type='text' />
        </label>
        <p>Ver imágenes o videos</p>
        <button className={styles.uploadButton} >Subir archivos</button>
      </div>
    </section>
  );
}

export default ModalRouteDone;
