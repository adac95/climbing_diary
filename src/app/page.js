import PokedexHeaderHome from "@components/PokedexHeaderHome";
import PokedexRoute from "@components/PokedexRoute";
import styles from "./styles.module.css";
// import { ImageTest } from "@components/ImageTest";

export default async  function Home() {
 
  return (
    <section className={styles.container}>
      
      <PokedexHeaderHome/>
      <PokedexRoute />

      {/* <ImageTest/> */}
    </section>
  );
}
