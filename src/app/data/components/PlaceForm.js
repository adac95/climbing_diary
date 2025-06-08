// components/PlaceForm.js
import { useState, useEffect } from 'react';
import { getSupabase } from '@utils/supabase/client';
import DataList from './DataList.js';
import styles from './Form.module.css';

export default function PlaceForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [season, setSeason] = useState('');
  const [information, setInformation] = useState('');
  const [rules, setRules] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [regionId, setRegionId] = useState('');
  const [regions, setRegions] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedPlace, setInsertedPlace] = useState(null);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('region')
          .select('id, name');
        
        if (error) {
          console.error("Error fetching regions:", error);
          return;
        }
        
        setRegions(data);
      } catch (err) {
        console.error("Error unexpected:", err);
      }
    }
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !regionId) {
      setMessage("El nombre y la región son requeridos.");
      return;
    }
    // Sanitizar entradas
    const safeName = name.trim().replace(/[^\w\sáéíóúÁÉÍÓÚüÜñÑ-]/g, '');
    const safePrice = price.trim().replace(/[^\d.,]/g, '');
    const safeSeason = season.trim().replace(/[^\w\sáéíóúÁÉÍÓÚüÜñÑ-]/g, '');
    const safeInformation = information.trim();
    const safeRules = rules.trim();
    const safeAdditionalInformation = additionalInformation.trim();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('place')
      .insert([{ name: safeName, region_id: regionId, price: safePrice, season: safeSeason, information: safeInformation, rules: safeRules, additional_information: safeAdditionalInformation }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar el lugar: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedPlace(data[0]);
      setMessage("Lugar insertado correctamente.");
      setName('');
      setPrice('');
      setSeason('');
      setInformation('');
      setRules('');
      setAdditionalInformation('');
      setRegionId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Lugar</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <label className={styles.label}>
          Región:
          <select value={regionId} onChange={(e)=> setRegionId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione una región</option>
            {regions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Precio:
          <input type="text" value={price} onChange={(e)=> setPrice(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Temporada:
          <input type="text" value={season} onChange={(e)=> setSeason(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Información:
          <textarea value={information} onChange={(e)=> setInformation(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Reglas:
          <textarea value={rules} onChange={(e)=> setRules(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Información Adicional:
          <textarea value={additionalInformation} onChange={(e)=> setAdditionalInformation(e.target.value)} className={styles.input} />
        </label>
        <button type="submit" className={styles.button}>Insertar Lugar</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      
      {insertedPlace && (
        <div className={styles.insertedData}>
          <h3>Lugar creado:</h3>
          <p><strong>ID:</strong> {insertedPlace.id}</p>
          <p><strong>Nombre:</strong> {insertedPlace.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Lugares</h3>
        <DataList tableName="place" title="Lugares" columns={["id", "name", "region_id"]} />
      </div>
    </div>
  );
}
