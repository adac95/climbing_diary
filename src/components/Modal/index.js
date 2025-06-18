import styles from "./Modal.module.css";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  // Bloquear desplazamiento cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Cerrar el modal al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Montar el modal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  if (!isOpen || !mounted) return null;

  return createPortal(
    <section className={styles.modal}>
      <div
        className={styles.backModal}
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className={styles.children}>{children}</div>
    </section>,
    document.getElementById("modal-root")
  );
}
