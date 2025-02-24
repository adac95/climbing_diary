// components/RouteFormExistingConDeveloper.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function RouteFormExistingConDeveloper({ onNext }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [distance, setDistance] = useState('');
  const [isMultipitch, setIsMultipitch] = useState(false);
  const [yearOpened, setYearOpened] = useState('');
  const [numberInPicture, setNumberInPicture] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [styleId, setStyleId] = useState('');
  const [developerId, setDeveloperId] = useState('');
  const [message, setMessage] = useState('');

  const [sectors, setSectors] = useState([]);
  const [stylesData, setStylesData] = useState([]);
  const [developers, setDevelopers] = useState([]);

  // Cargar datos existentes de sector, style y developer
  useEffect(() => {
    async function fetchData() {
      const { data: secData } = await supabase.from('sector').select('id, name');
      setSectors(secData || []);
      const { data: styData } = await supabase.from('style').select('id, name');
      setStylesData(styData || []);
      const { data: devData } = await supabase.from('developer').select('id, name');
      setDevelopers(devData || []);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !sectorId || !styleId || !developerId) {
      setMessage("El nombre, sector, estilo y developer son requeridos.");
      return;
    }
    // Insertar la ruta y obtener la representación
    const { data, error } = await supabase
      .from('route')
      .insert([
        {
          name,
          sector_id: sectorId,
          grade,
          distance: distance ? parseFloat(distance) : null,
          is_multipitch: isMultipitch,
          year_opened: yearOpened ? parseInt(yearOpened) : null,
          style_id: styleId,
          number_of_route_in_picture: numberInPicture ? parseInt(numberInPicture) : null,
        }
      ], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar la ruta: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      const routeId = data[0].id;
      // Insertar la relación en la tabla route_developer
      const { error: relError } = await supabase
        .from('route_developer')
        .insert([{ route_id: routeId, developer_id: developerId }]);
      if (relError) {
        setMessage("Ruta creada, pero error al asociar el developer: " + relError.message);
      } else {
        setMessage("Ruta y relación developer insertadas correctamente.");
        onNext({ routeId });
        // Resetear campos
        setName('');
        setGrade('');
        setDistance('');
        setIsMultipitch(false);
        setYearOpened('');
        setNumberInPicture('');
        setSectorId('');
        setStyleId('');
        setDeveloperId('');
      }
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Crear Ruta con Datos Existentes</h2>
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
        </label>
        <label className={styles.label}>
          Sector:
          <select value={sectorId} onChange={(e) => setSectorId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un sector</option>
            {sectors.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Estilo:
          <select value={styleId} onChange={(e) => setStyleId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un estilo</option>
            {stylesData.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Developer:
          <select value={developerId} onChange={(e) => setDeveloperId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un developer</option>
            {developers.map(dev => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Grado:
          <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Distancia:
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          ¿Multipitch?:
          <input type="checkbox" checked={isMultipitch} onChange={(e) => setIsMultipitch(e.target.checked)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Año de Apertura:
          <input type="number" value={yearOpened} onChange={(e) => setYearOpened(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Número en la foto:
          <input type="number" value={numberInPicture} onChange={(e) => setNumberInPicture(e.target.value)} className={styles.input} />
        </label>
        <button type="submit" className={styles.button}>Crear Ruta</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      <div>
        <h3>Lista de Rutas</h3>
        <DataList tableName="route" title="Rutas" columns={["id", "name", "sector_id", "style_id"]} />
      </div>
    </div>
  );
}
