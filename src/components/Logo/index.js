import styles from "./index.module.css";
import logoImg from "../../assets/logo.png";
import Image from "next/image";

function Logo() {
  return (
    <div className={styles.logo}>
      <Image src={logoImg} alt='Logo' width={150} height={50}/>
      <h1>Climbing Diary</h1>
    </div>
  );
}

export default Logo;
