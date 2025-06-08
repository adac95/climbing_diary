import DataList from './DataList';
import { validators } from '@utils/validation';
import { withDataForm } from './FormHOC';

function CountryFormComponent({
  formData,
  handleChange,
  handleSubmit,
  error,
  message,
  insertedData,
  styles
}) {
  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Insertar País</h2>
        <label className={styles.label}>
          Nombre:
          <input
            type="text"
            value={formData.name || ''}
            onChange={handleChange('name')}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            required
            maxLength={100}
            aria-invalid={!!error}
            aria-describedby={error ? "name-error" : undefined}
          />
        </label>
        
        {error && (
          <p id="name-error" className={styles.error} role="alert">
            {error}
          </p>
        )}
        
        {message && (
          <p className={styles.success} role="status">
            {message}
          </p>
        )}
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={!formData.name?.trim()}
        >
          Insertar País
        </button>
      </form>

      {insertedData && (
        <div className={styles.insertedData} role="region" aria-label="País creado">
          <h3>País creado:</h3>
          <p><strong>ID:</strong> {insertedData.id}</p>
          <p><strong>Nombre:</strong> {insertedData.name}</p>
        </div>
      )}

      <div>
        <h3>Lista de Países</h3>
        <DataList tableName="country" title="Países" columns={["id", "name"]} />
      </div>
    </div>
  );
}

// Configuración del formulario
const countryFormConfig = {
  tableName: 'country',
  title: 'País',
  validationSchema: {
    name: validators.name
  }
};

// Exportar el componente envuelto con el HOC
export default withDataForm(CountryFormComponent, countryFormConfig);
