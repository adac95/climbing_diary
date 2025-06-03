// components/RouteForm.js
import { useState, useEffect } from 'react';
import { getSupabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function RouteForm() {
  // Estados para los datos de la ruta
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [distance, setDistance] = useState('');
  const [isMultipitch, setIsMultipitch] = useState(false);
  const [yearOpened, setYearOpened] = useState('');
  const [numberInPicture, setNumberInPicture] = useState('');

  // Estados para la selección en cascada
  const [countryId, setCountryId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [styleId, setStyleId] = useState('');

  // Estados para las listas de opciones
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [places, setPlaces] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [stylesData, setStylesData] = useState([]);
  const [developers, setDevelopers] = useState([]);

  // Otros estados
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [message, setMessage] = useState('');
  const [insertedRoute, setInsertedRoute] = useState(null);

  // Cargar países, estilos y developers al montar el componente
  useEffect(() => {
    async function fetchInitialData() {
      const supabase = getSupabase();
      const { data: countriesData, error: countriesError } = await supabase
        .from('country')
        .select('id, name');
      if (countriesError) console.error("Error fetching countries:", countriesError);
      else setCountries(countriesData);

      const { data: stylesData, error: stylesError } = await supabase
        .from('style')
        .select('id, name');
      if (stylesError) console.error("Error fetching styles:", stylesError);
      else setStylesData(stylesData);

      const { data: developersData, error: devError } = await supabase
        .from('developer')
        .select('id, name');
      if (devError) console.error("Error fetching developers:", devError);
      else setDevelopers(developersData);
    }
    fetchInitialData();
  }, []);

  // Cuando country cambia, cargar regiones y limpiar los siguientes select
  useEffect(() => {
    async function fetchRegions() {
      if (!countryId) {
        setRegions([]);
        setRegionId('');
        return;
      }
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('region')
        .select('id, name')
        .eq('country_id', countryId);
      if (error) console.error("Error fetching regions:", error);
      else setRegions(data);
      setRegionId('');
      setPlaceId('');
      setSectors([]);
      setSectorId('');
    }
    fetchRegions();
  }, [countryId]);

  // Cuando region cambia, cargar lugares y limpiar los siguientes select
  useEffect(() => {
    async function fetchPlaces() {
      if (!regionId) {
        setPlaces([]);
        setPlaceId('');
        return;
      }
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('place')
        .select('id, name')
        .eq('region_id', regionId);
      if (error) console.error("Error fetching places:", error);
      else setPlaces(data);
      setPlaceId('');
      setSectors([]);
      setSectorId('');
    }
    fetchPlaces();
  }, [regionId]);

  // Cuando place cambia, cargar sectores
  useEffect(() => {
    async function fetchSectors() {
      if (!placeId) {
        setSectors([]);
        setSectorId('');
        return;
      }
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('sector')
        .select('id, name')
        .eq('place_id', placeId);
      if (error) console.error("Error fetching sectors:", error);
      else setSectors(data);
      setSectorId('');
    }
    fetchSectors();
  }, [placeId]);

  // Manejo del campo multi-select para developers
  const handleDevelopersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedDevelopers(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar campos obligatorios (nombre, sector y estilo son requeridos)
    if (!name || !sectorId || !stylesData || !styleId) {
      setMessage("El nombre, sector y estilo son requeridos.");
      return;
    }
    // Insertar la ruta
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('route')
      .insert([
        {
          name,
          sector_id: sectorId,
          grade,
          distance: distance !== "" ? parseFloat(distance) : null,
          is_multipitch: isMultipitch,
          year_opened:yearOpened !== "" ? parseInt(yearOpened) : null,
          style_id: styleId,
          number_of_route_in_picture:numberInPicture !== "" ? parseInt(numberInPicture) : null,
        }
      ], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar la ruta: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
      return;
    }
    const inserted = data[0];
    setInsertedRoute(inserted);
    let finalMessage = "Ruta insertada correctamente.";
    // Si se seleccionaron developers, insertar relaciones en route_developer
    if (selectedDevelopers.length > 0) {
      const routeDevRecords = selectedDevelopers.map(devId => ({
        route_id: inserted.id,
        developer_id: devId
      }));
      const { error: relError } = await supabase
        .from('route_developer')
        .insert(routeDevRecords);
      if (relError) {
        finalMessage += " Pero hubo un error al asociar los developers: " + relError.message;
        console.error(relError);
      } else {
        finalMessage += " Y los developers se asociaron correctamente.";
      }
    }
    setMessage(finalMessage);
    // Resetear campos
    setName('');
    setGrade('');
    setDistance('');
    setIsMultipitch(false);
    setYearOpened('');
    setNumberInPicture('');
    setCountryId('');
    setRegionId('');
    setPlaceId('');
    setSectorId('');
    setStyleId('');
    setSelectedDevelopers([]);
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Ruta</h2>
        {/* Cascada: Country -> Region -> Place -> Sector */}
        <label className={styles.label}>
          País:
          <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un país</option>
            {countries.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Región:
          <select value={regionId} onChange={(e) => setRegionId(e.target.value)} className={styles.input} required disabled={!countryId}>
            <option value="">Seleccione una región</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Lugar:
          <select value={placeId} onChange={(e) => setPlaceId(e.target.value)} className={styles.input} required disabled={!regionId}>
            <option value="">Seleccione un lugar</option>
            {places.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Sector:
          <select value={sectorId} onChange={(e) => setSectorId(e.target.value)} className={styles.input} required disabled={!placeId}>
            <option value="">Seleccione un sector</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        {/* Otros campos */}
        <label className={styles.label}>
          Nombre:
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className={styles.input} required />
        </label>
        <label className={styles.label}>
          Grado:
          <input type="text" value={grade} onChange={(e)=> setGrade(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Distancia:
          <input type="number" value={distance} onChange={(e)=> setDistance(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          ¿Multipitch?:
          <input type="checkbox" checked={isMultipitch} onChange={(e)=> setIsMultipitch(e.target.checked)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Año de Apertura:
          <input type="number" value={yearOpened} onChange={(e)=> setYearOpened(e.target.value)} className={styles.input} />
        </label>
        <label className={styles.label}>
          Número en la foto:
          <input type="number" value={numberInPicture} onChange={(e)=> setNumberInPicture(e.target.value)} className={styles.input} />
        </label>
        {/* Estilo: selector independiente */}
        <label className={styles.label}>
          Estilo:
          <select value={styleId} onChange={(e)=> setStyleId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un estilo</option>
            {stylesData.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </label>
        {/* Developers: multi-select */}
        <label className={styles.label}>
          Developers (Ctrl+clic para seleccionar varios):
          <select multiple value={selectedDevelopers} onChange={handleDevelopersChange} className={styles.input}>
            {developers.map(dev => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.button}>Insertar Ruta</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
      
      {insertedRoute && (
        <div className={styles.insertedData}>
          <h3>Ruta creada:</h3>
          <p><strong>ID:</strong> {insertedRoute.id}</p>
          <p><strong>Nombre:</strong> {insertedRoute.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Rutas</h3>
        <DataList tableName="route" title="Rutas" columns={["id", "name", "sector_id", "style_id"]} />
      </div>
    </div>
  );
}
