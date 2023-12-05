import styles from "./PokedexRoute.module.css";

export default function PokedexRoute() {
  return (
    <article className={styles.container}>
      {/* <input className={styles.checkbox} type='checkbox' /> */}
      <div className={styles.info}>
        <p>Nombre de la ruta</p>
        <p>6b+</p>
        <p>deportiva</p>
        <p>✅ encadenado</p>
        <p>3 pegues</p>
        <i>Perú ~ Cusco ~ Pitumarca ~ Libron</i>
        <p className={styles.p}>
          {" "}
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
        <button>ver archivos multimedia</button>
      </div>
    </article>
  );
}
