// components/RouteDeveloperForm.js
import { useState, useEffect } from 'react';
import { getSupabase } from '../supabaseClient';
import DataList from './DataList';
import styles from './Form.module.css';

export default function RouteDeveloperForm() {
  const [routeId, setRouteId] = useState('');
  const [developerId, setDeveloperId] = useState('');
  const [routes, setRoutes] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchRoutes() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('route')
        .select('id, name');
      if (error) console.error("Error fetching routes:", error);
      else setRoutes(data);
    }
    async function fetchDevelopers() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('developer')
        .select('id, name');
      if (error) console.error("Error fetching developers:", error);
      else setDevelopers(data);
    }
    fetchRoutes();
    fetchDevelopers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeId || !developerId) {
      setMessage("La ruta y el developer son requeridos.");
      return;
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('route_developer')
      .insert([{ route_id: routeId, developer_id: developerId }], { returning: "representation" })
      .select();
    if (error || !data || data.length === 0) {
      setMessage("Error al insertar la relación route_developer: " + (error?.message || "No se devolvieron datos"));
      console.error(error);
    } else {
      setMessage("Relación route_developer insertada correctamente.");
      setRouteId('');
      setDeveloperId('');
    }
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar Relación Route-Developer</h2>
        <label className={styles.label}>
          Ruta:
          <select value={routeId} onChange={(e)=> setRouteId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione una ruta</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Developer:
          <select value={developerId} onChange={(e)=> setDeveloperId(e.target.value)} className={styles.input} required>
            <option value="">Seleccione un developer</option>
            {developers.map(dev => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </label>
        <button type="submit" className={styles.button}>Insertar Relación</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>

      <div>
        <h3>Lista de Relaciones Route-Developer</h3>
        <DataList tableName="route_developer" title="Relación Route-Developer" columns={["route_id", "developer_id"]} />
      </div>
    </div>
  );
}
