// components/StyleForm.js
import { useState } from 'react';
import { getSupabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function StyleForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [insertedStyle, setInsertedStyle] = useState(null);

  // Función para sanitizar y validar el nombre
  function sanitizeName(input) {
    return input.replace(/[^\w\sáéíóúÁÉÍÓÚüÜñÑ-]/g, '').trim();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const safeName = sanitizeName(name);
    if (!safeName) {
      setMessage("El nombre del estilo es requerido y debe ser válido.");
      return;
    }
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('style')
        .insert([{ name: safeName }], { returning: "representation" })
        .select();
      if (error || !data || data.length === 0) {
        setMessage("Error al insertar el estilo: " + (error?.message || "No se devolvieron datos"));
        console.error(error);
      } else {
        setInsertedStyle(data[0]);
        setMessage("Estilo insertado correctamente.");
        setName('');
      }
    } catch (err) {
      setMessage("Error inesperado al insertar el estilo.");
      console.error(err);
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Estilo</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <button type="submit" className={styles.button}>Insertar Estilo</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {insertedStyle && (
        <div className={styles.insertedData}>
          <h3>Estilo creado:</h3>
          <p><strong>ID:</strong> {insertedStyle.id}</p>
          <p><strong>Nombre:</strong> {insertedStyle.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Estilos</h3>
        <DataList tableName="style" title="Estilos" columns={["id", "name"]} />
      </div>
    </div>
  );
}
