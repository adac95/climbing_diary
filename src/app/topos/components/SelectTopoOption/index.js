import { memo, useCallback } from "react";
import styles from "./SelectTopoOption.module.css";

const SelectTopoOption = memo(function SelectTopoOption({
  data: options,
  inputToSet: onChange,
  defaultValue,
  className = "",
  disabled = false,
  hideDefaultOption = false,
}) {
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  const defaultOptionClasses = `${styles.option} ${
    defaultValue ? styles.disabledOption : ""
  }`;

  return (
    <section className={styles.container}>
      <select
        value={defaultValue}
        className={`${styles.select} ${className}`.trim()}
        onChange={handleChange}
        disabled={disabled}
      >
        {!hideDefaultOption && (
          <option
            className={defaultOptionClasses}
            value=""
            disabled={!!defaultValue}
          >
            --- choose ---
          </option>
        )}

        {options?.map((option) => (
          <option
            className={styles.option}
            key={option.id}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </section>
  );
});

// Nombre para DevTools
SelectTopoOption.displayName = 'SelectTopoOption';

export default SelectTopoOption;
