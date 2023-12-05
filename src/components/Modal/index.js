import styles from "./Modal.module.css";

export default function Modal({ isOpen, onClose, children }) {
  return (
    isOpen && (
      <section className={styles.modal}>
        <div
          className={styles.backModal}
          onClick={() => {
            onClose();
          }}
        ></div>
        <div className={styles.children}>
        {children}
        </div>
      </section>
    )
  );
}
