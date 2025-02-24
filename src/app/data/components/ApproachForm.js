// components/ApproachForm.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function ApproachForm() {
  const [information, setInformation] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [privateTransport, setPrivateTransport] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedApproach, setInsertedApproach] = useState(null);

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
      .from('approach')
      .insert([{ information, public_transport: publicTransport, private_transport: privateTransport, place_id: placeId }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar approach: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedApproach(data[0]);
      setMessage("Approach insertado correctamente.");
      setInformation('');
      setPublicTransport('');
      setPrivateTransport('');
      setPlaceId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Approach</h2>
        <label className={styles.label}>
          Información:
          <textarea value={information} onChange={(e)=> setInformation(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Transporte Público:
          <input type="text" value={publicTransport} onChange={(e)=> setPublicTransport(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Transporte Privado:
          <input type="text" value={privateTransport} onChange={(e)=> setPrivateTransport(e.target.value)} className={styles.input} />
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
        <button type="submit" className={styles.button}>Insertar Approach</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      {insertedApproach && (
        <div className={styles.insertedData}>
          <h3>Approach creado:</h3>
          <p><strong>ID:</strong> {insertedApproach.id}</p>
          <p><strong>Información:</strong> {insertedApproach.information}</p>
        </div>
      )}

      <div>
        <h3>Lista de Approach</h3>
        <DataList tableName="approach" title="Approach" columns={["id", "information", "place_id"]} />
      </div>
    </div>
  );
}
