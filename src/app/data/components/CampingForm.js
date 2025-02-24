// components/CampingForm.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function CampingForm() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [information, setInformation] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedCamping, setInsertedCamping] = useState(null);

  useEffect(() => {
    async function fetchPlaces() {
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
    if (!placeId) {
      setMessage("El lugar es requerido.");
      return;
    }
    const { data, error } = await supabase
      .from('camping')
      .insert([{ is_available: isAvailable, price, name, information, place_id: placeId }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar camping: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedCamping(data[0]);
      setMessage("Camping insertado correctamente.");
      setPrice('');
      setName('');
      setInformation('');
      setPlaceId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Camping</h2>
        <label className={styles.label}>
          Disponible:
          <input type="checkbox" checked={isAvailable} onChange={(e)=> setIsAvailable(e.target.checked)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Precio:
          <input type="text" value={price} onChange={(e)=> setPrice(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Información:
          <textarea value={information} onChange={(e)=> setInformation(e.target.value)} className={styles.input} />
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
        <button type="submit" className={styles.button}>Insertar Camping</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {insertedCamping && (
        <div className={styles.insertedData}>
          <h3>Camping creado:</h3>
          <p><strong>ID:</strong> {insertedCamping.id}</p>
          <p><strong>Nombre:</strong> {insertedCamping.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Camping</h3>
        <DataList tableName="camping" title="Camping" columns={["id", "name", "place_id"]} />
      </div>
    </div>
  );
}
