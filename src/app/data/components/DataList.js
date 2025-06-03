// components/DataList.js
import { useState, useEffect } from 'react';
import { getSupabase } from '../supabaseClient';
import styles from './Form.module.css';

export default function DataList({ tableName, title, columns }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los registros iniciales
  const fetchRecords = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    if (error) {
      setError(error.message);
    } else {
      setRecords(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();

    // Crear canal de suscripción en tiempo real usando la API de Supabase v2
    const supabase = getSupabase();
    const channel = supabase.channel(`realtime-${tableName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: tableName },
        payload => {
          setRecords(prev => [...prev, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: tableName },
        payload => {
          setRecords(prev =>
            prev.map(record =>
              record.id === payload.new.id ? payload.new : record
            )
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: tableName },
        payload => {
          setRecords(prev =>
            prev.filter(record => record.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Limpieza al desmontar el componente
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [tableName]);

  if (loading) return <p>Cargando {title}...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.listContainer}>
      <h2>{title}</h2>
      {records.length === 0 ? (
        <p>No hay registros en {title}.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id || JSON.stringify(record)}>
                {columns.map(col => (
                  <td key={col}>{record[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
