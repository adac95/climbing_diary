import styles from './ToposPage.module.css';

export default async function ToposPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Guía de Escalada</h1>
      <p className={styles.description}>
        Selecciona una región en el menú desplegable de arriba para explorar lugares de escalada.
      </p>
    </div>
  );
}
