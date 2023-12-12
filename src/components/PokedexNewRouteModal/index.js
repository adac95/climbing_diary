'use client'

import { useRef } from "react";
import styles from "./PokedexNewRouteModal.module.css";

export default function PokedexNewRouteModal() {

 const form = useRef()
  const handlesubmit = function (e) {

      e.preventDefault();
    const formData = new FormData(form.current)

    console.log({formData}, form.current);
  };

  return (
    <form ref={form} onSubmit={(e) => handlesubmit(e)} className={styles.container}>
      <h2>Creando nueva ruta en tu pokedex</h2>
      <label className={styles.label} id='name' htmlFor='name'>
        Nombre de la ruta
        <input className={styles.input} type='text' id='name' name='name' />
      </label>
      <label className={styles.label}>
        Estilo
        <select className={styles.input}>
          <option>deportiva</option>
          <option>boulder</option>
          <option>tradicional</option>
        </select>
      </label>
      <label className={styles.label}>
        grado
        <input className={styles.input} type='text' />
      </label>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend} >Salió?</legend>
        <label className={styles.label} htmlFor='encadenado'>
          <input id='encadenado' type='radio' name='a' value='encadenado' />
          Encadenado{" "}
        </label>
        <label className={styles.label} htmlFor='proyecto'>
          <input id='proyecto' type='radio' name='a' value='proyecto' />
          Proyecto{" "}
        </label>
      </fieldset>
      <label className={styles.label}>
        Nro pegues <input className={styles.input} />
      </label>
      <label className={styles.label}>
        Comentarios
        <textarea className={styles.input} rows='6' />
      </label>
       <label className={styles.label}> Subir archivos <input type="file" className={styles.submitBtn}  /></label>
      <button className={styles.submitBtn} type="submit">Agregar al pokedex</button>
    </form>
  );
}
