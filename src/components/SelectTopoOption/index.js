import styles from './SelectTopoOption.module.css';

export default function SelectTopoOption({ data, inputToSet }) {
  return (
    <section className={styles.container}>
    <select
    className={styles.select}
      onChange={(e) => {
        inputToSet(e.target.value);
      }}
    >
      <option className={styles.option} value=''>--- choose ---</option>
      {data &&
        data.map((dataToMap) => {
          return (
            <option className={styles.option} key={dataToMap._id} value={dataToMap._id}>
              {dataToMap.name}
            </option>
          );
        })}
    </select>
    </section>
  );
}
