import styles from "./PokedexRoute.module.css";

export default function PokedexRoute() {
  return (
    <article className={styles.container}>
      <div className={styles.info}>
        <p className={styles.routeName}>Nombre de la ruta</p>
        <p className={styles.routeGrade}>6b+</p>
        <p className={styles.routeType}>deportiva</p>
        <p className={styles.routeStatus}>
          <span className={styles.statusIcon}>✅</span>
          <span className={styles.statusText}>encadenado</span>
        </p>
        <p className={styles.routeAttempts}>3 pegues</p>
        <div className={styles.routeLocation}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.locationText}>Perú ~ Cusco ~ Pitumarca ~ Libron</span>
        </div>
        <p className={styles.routeDescription}>
          La propiedad line-height establece la altura entre cada línea de
          texto; esta propiedad admite la mayoría de las unidades y magnitudes,
          pero también puede tomar un valor sin unidades, que actúa como un
          multiplicador y generalmente se considera la mejor opción porque se
          multiplica la propiedad font-size para obtener la altura de la línea
          (line-height). El texto del cuerpo (body) generalmente se ve mejor y
          es más fácil de leer si hay más separación entre las líneas; la altura
          recomendada de la línea es entre 1.5-2 (a doble espacio). Por lo
          tanto, para configurar nuestras líneas de texto a 1.5 veces la altura
          de la fuente, deberías usar esto:
        </p>
        <button className={styles.mediaButton}>
          <span className={styles.buttonIcon}>📷</span>
          <span className={styles.buttonText}>ver archivos multimedia</span>
        </button>
      </div>
    </article>
  );
}
