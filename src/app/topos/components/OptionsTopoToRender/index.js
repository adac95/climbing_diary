import styles from "./OptionsTopoToRender.module.css";

export default function OptionsTopoToRender({ name }) {
  return (
    <button className={styles.button} name={name}>
      {name}
    </button>
  );
}
