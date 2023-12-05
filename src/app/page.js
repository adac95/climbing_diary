// import { ImageTest } from "@components/ImageTest";
// import Link from "next/link";
import styles from "./styles.module.css";

export default async function Home() {
  return (
    <section>
      <h2>Rutas</h2>
      <button>Crear nueva nota</button>
      <br />
      <hr />
      <br />
      <article className={styles.container}>
        {/* <input className={styles.checkbox} type='checkbox' /> */}
        <div className={styles.info}>
          <p>Nombre de la ruta</p>
          <p>6b+</p>
          <p>deportiva</p>
          <p>✅ encadenado</p>
          <p>3 pegues</p>
          <i>Perú ~ Cusco ~ Pitumarca ~ Libron</i>
          <p className={styles.p}> La propiedad line-height establece la altura entre cada línea de texto; esta propiedad admite la mayoría de las unidades y magnitudes, pero también puede tomar un valor sin unidades, que actúa como un multiplicador y generalmente se considera la mejor opción porque se multiplica la propiedad font-size para obtener la altura de la línea (line-height). El texto del cuerpo (body) generalmente se ve mejor y es más fácil de leer si hay más separación entre las líneas; la altura recomendada de la línea es entre 1.5-2 (a doble espacio). Por lo tanto, para configurar nuestras líneas de texto a 1.5 veces la altura de la fuente, deberías usar esto:</p>
          <button>ver archivos multimedia</button>
        </div>
      </article>

      {/* <Link href={'/topos'} ><p style={{display:"block", border:"1px black line",width: '200px', color: 'green', height:'40px', textAlign:"center", background:'#ff002343',fontSize:"18px"}}>Topos</p></Link>
      <Link href={'/topos'} ><p style={{display:"block", border:"1px black line",width: '200px', color: 'green', height:'40px', textAlign:"center", background:'#ff002343',fontSize:"18px"}}>Diario</p></Link> */}
      {/* <ImageTest/> */}
    </section>
  );
}
