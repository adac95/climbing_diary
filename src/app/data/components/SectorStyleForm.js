// components/SectorStyleForm.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function SectorStyleForm() {
  const [sectorId, setSectorId] = useState('');
  const [styleId, setStyleId] = useState('');
  const [sectors, setSectors] = useState([]);
  const [stylesData, setStylesData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSectors() {
      const { data, error } = await supabase
        .from('sector')
        .select('id, name');
      if (error) console.error("Error fetching sectors:", error);
      else setSectors(data);
    }
    async function fetchStyles() {
      const { data, error } = await supabase
        .from('style')
        .select('id, name');
      if (error) console.error("Error fetching styles:", error);
      else setStylesData(data);
    }
    fetchSectors();
    fetchStyles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectorId || !styleId) {
      setMessage("El sector y el estilo son requeridos.");
      return;
    }
    const { data, error } = await supabase
      .from('sector_style')
      .insert([{ sector_id: sectorId, style_id: styleId }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar la relación sector_style: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setMessage("Relación sector_style insertada correctamente.");
      setSectorId('');
      setStyleId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Relación Sector-Style</h2>
        <label className={styles.label}>
          Sector:
          <select value={sectorId} onChange={(e)=> setSectorId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un sector</option>
            {sectors.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Estilo:
          <select value={styleId} onChange={(e)=> setStyleId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un estilo</option>
            {stylesData.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.button}>Insertar Relación</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>

      <div>
        <h3>Lista de Relaciones Sector-Style</h3>
        <DataList tableName="sector_style" title="Relación Sector-Style" columns={["sector_id", "style_id"]} />
      </div>
    </div>
  );
}
