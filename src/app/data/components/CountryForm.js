import { useState } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function CountryForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [insertedCountry, setInsertedCountry] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setMessage("El nombre del país es requerido.");
      return;
    }
    // Se usa .select() para forzar la devolución del registro insertado
    const { data, error } = await supabase
      .from('country')
      .insert([{ name }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar el país: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedCountry(data[0]);
      setMessage("País insertado correctamente.");
      setName('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar País</h2>
        <label className={styles.label}>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <button type="submit" className={styles.button}>Insertar País</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>

      {insertedCountry && (
        <div className={styles.insertedData}>
          <h3>País creado:</h3>
          <p><strong>ID:</strong> {insertedCountry.id}</p>
          <p><strong>Nombre:</strong> {insertedCountry.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Países</h3>
        <DataList tableName="country" title="Países" columns={["id", "name"]} />
      </div>
    </div>
  );
}
