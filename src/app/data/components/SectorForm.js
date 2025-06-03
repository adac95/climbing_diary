// components/SectorForm.js
import { useState, useEffect } from 'react';
import { getSupabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function SectorForm() {
  const [name, setName] = useState('');
  const [approach, setApproach] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedSector, setInsertedSector] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('place')
        .select('id, name');
      if (error) console.error("Error fetching places:", error);
      else setPlaces(data);
    }
    fetchPlaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !placeId) {
      setMessage("El nombre y el lugar son requeridos.");
      return;
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('sector')
      .insert([{ name, place_id: placeId, approach }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar el sector: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedSector(data[0]);
      setMessage("Sector insertado correctamente.");
      setName('');
      setApproach('');
      setPlaceId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Sector</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <label className={styles.label}>
          Lugar:
          <select value={placeId} onChange={(e)=> setPlaceId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un lugar</option>
            {places.map(place => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Approach:
          <input type="text" value={approach} onChange={(e)=> setApproach(e.target.value)} className={styles.input} />
        </label>
        <button type="submit" className={styles.button}>Insertar Sector</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {insertedSector && (
        <div className={styles.insertedData}>
          <h3>Sector creado:</h3>
          <p><strong>ID:</strong> {insertedSector.id}</p>
          <p><strong>Nombre:</strong> {insertedSector.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Sectores</h3>
        <DataList tableName="sector" title="Sectores" columns={["id", "name", "place_id"]} />
      </div>
    </div>
  );
}
