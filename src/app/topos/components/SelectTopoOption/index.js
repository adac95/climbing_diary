import styles from "./SelectTopoOption.module.css";

export default function SelectTopoOption({ 
  data, 
  inputToSet, 
  defaultValue, 
  className = '', 
  disabled = false,
  hideDefaultOption = false,
  onOptionHover = () => {}
}) {
  return (
    <section className={styles.container}>
      <select
        value={defaultValue}
        className={`${styles.select} ${className}`}
        onChange={(e) => {
          inputToSet(e.target.value);
        }}
        disabled={disabled}
      >
        <option 
          className={`${styles.option} ${defaultValue ? styles.disabledOption : ''}`} 
          value=""
          disabled={!!defaultValue}
        >
          --- choose ---
        </option>

        {data &&
          data.map((dataToMap) => {
            return (
              <option
                className={styles.option}
                key={dataToMap.id}
                value={dataToMap.id}
                onMouseEnter={() => onOptionHover(dataToMap.id)}
              >
                {dataToMap.name}
              </option>
            );
          })}
      </select>
    </section>
  );
}
