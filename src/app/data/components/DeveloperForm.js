// components/DeveloperForm.js
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function DeveloperForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [insertedDeveloper, setInsertedDeveloper] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("El nombre del developer es requerido.");
      return;
    }
    const { data, error } = await supabase
      .from('developer')
      .insert([{ name }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar el developer: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedDeveloper(data[0]);
      setMessage("Developer insertado correctamente.");
      setName('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Developer</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <button type="submit" className={styles.button}>Insertar Developer</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {insertedDeveloper && (
        <div className={styles.insertedData}>
          <h3>Developer creado:</h3>
          <p><strong>ID:</strong> {insertedDeveloper.id}</p>
          <p><strong>Nombre:</strong> {insertedDeveloper.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Developers</h3>
        <DataList tableName="developer" title="Developers" columns={["id", "name"]} />
      </div>
    </div>
  );
}
