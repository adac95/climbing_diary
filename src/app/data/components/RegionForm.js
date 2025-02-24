// components/RegionForm.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function RegionForm() {
  const [name, setName] = useState('');
  const [information, setInformation] = useState('');
  const [obs, setObs] = useState('');
  const [countryId, setCountryId] = useState('');
  const [countries, setCountries] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedRegion, setInsertedRegion] = useState(null);

  useEffect(() => {
    async function fetchCountries() {
      const { data, error } = await supabase
        .from('country')
        .select('id, name');
      if (error) console.error("Error fetching countries:", error);
      else setCountries(data);
    }
    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !countryId) {
      setMessage("El nombre y el país son requeridos.");
      return;
    }
    const { data, error } = await supabase
      .from('region')
      .insert([{ name, country_id: countryId, information, obs }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar la región: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setInsertedRegion(data[0]);
      setMessage("Región insertada correctamente.");
      setName('');
      setInformation('');
      setObs('');
      setCountryId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Región</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <label className={styles.label}>
          País:
          <select value={countryId} onChange={(e)=> setCountryId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un país</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Información:
          <textarea value={information} onChange={(e)=> setInformation(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Observaciones:
          <textarea value={obs} onChange={(e)=> setObs(e.target.value)} className={styles.input} />
        </label>
        <button type="submit" className={styles.button}>Insertar Región</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      
      {insertedRegion && (
        <div className={styles.insertedData}>
          <h3>Región creada:</h3>
          <p><strong>ID:</strong> {insertedRegion.id}</p>
          <p><strong>Nombre:</strong> {insertedRegion.name}</p>
          <p><strong>Información:</strong> {insertedRegion.information}</p>
          <p><strong>Observaciones:</strong> {insertedRegion.obs}</p>
        </div>
      )}

      <div>
        <h3>Lista de Regiones</h3>
        <DataList tableName="region" title="Regiones" columns={["id", "name", "country_id"]} />
      </div>
    </div>
  );
}
