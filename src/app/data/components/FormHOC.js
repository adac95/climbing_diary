import { useState } from 'react';
import { getSupabase } from '@utils/supabase/client';
import { validators } from '@utils/validation';
import { handleError } from '@utils/error-handler';
import styles from './Form.module.css';

export const withDataForm = (WrappedComponent, options) => {
  const {
    tableName,
    title,
    validationSchema,
    transformData,
    additionalFields = []
  } = options;

  function DataForm(props) {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [insertedData, setInsertedData] = useState(null);

    const handleChange = (field) => (e) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

    const validateForm = () => {
      for (const [field, validator] of Object.entries(validationSchema)) {
        const value = formData[field];
        const { isValid, error } = validator(value);
        if (!isValid) {
          setError(`${field}: ${error}`);
          return false;
        }
      }
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setMessage('');

      if (!validateForm()) return;

      try {
        const supabase = getSupabase();
        const dataToInsert = transformData ? transformData(formData) : formData;

        const { data, error } = await supabase
          .from(tableName)
          .insert([dataToInsert], { returning: "representation" })
          .select();

        if (error) throw error;
        
        if (!data || data.length === 0) {
          throw new Error('No se devolvieron datos');
        }

        setInsertedData(data[0]);
        setMessage(`${title} insertado correctamente.`);
        setFormData({});
        
      } catch (error) {
        const handledError = handleError(error, { 
          component: title + 'Form',
          action: 'insert',
          input: formData
        });
        setError(handledError.message);
      }
    };

    return (
      <WrappedComponent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        error={error}
        message={message}
        insertedData={insertedData}
        styles={styles}
        {...props}
      />
    );
  }

  return DataForm;
}; 