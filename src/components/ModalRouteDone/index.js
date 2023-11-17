import styles from "./ModalRouteDone.module.css";

function ModalRouteDone({ isOpen, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const { elements } = e.currentTarget;
    const data = {
      idOfRoute: "esto aun falta",
      idOfUser: "esto aun falta",
      tries: elements.namedItem("tries").value,
      dateOfDone: elements.namedItem("dateOfDone").value,
      partner: elements.namedItem("partner").value,
      comments: elements.namedItem("comments").value,
    };
    console.log(data);
  };

  return (
    isOpen && (
      <section className={styles.modal}>
        <div
          className={styles.backModal}
          onClick={() => {
            onClose();
          }}
        ></div>
        <form className={styles.container} onSubmit={(e) => handleSubmit(e)}>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
          <h2>Encadenado!!</h2>
          <label className={styles.label}>
            Nro de pegues{" "}
            <input name='tries' className={styles.input} type='number' />
          </label>
          <label className={styles.label}>
            Fecha{" "}
            <input name='dateOfDone' className={styles.input} type='date' />
          </label>
          <label className={styles.label}>
            Cordada{" "}
            <input name='partner' className={styles.input} type='text' />
          </label>
          <label className={styles.label}>
            comentarios
            <textarea
              rows={5}
              name='comments'
              placeholder='Escribe aquí datos adicionales'
              className={`${styles.input} ${styles[`text-area`]}`}
              type='text'
            />
          </label>
          <p>Ver imágenes o videos</p>
          <button type='button' className={styles.uploadButton}>
            Subir archivos
          </button>
          <button className={styles.uploadButton}>Aplicar cambios</button>
        </form>
      </section>
    )
  );
}

export default ModalRouteDone;
