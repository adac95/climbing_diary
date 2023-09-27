import { setBtnToRender } from "@redux/reducers/toposReducer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./OptionsTopoToRender.module.css";
import { useState } from "react";

export default function OptionsTopoToRender({ name }) {
  const btnToRender = useSelector((state) => state.topos.btnToRender);
  const dispatch = useDispatch();
  const [btnIsActive, setBtnIsActive] = useState(false);

  const clickHandle = (e) => {
    if (e.target.name == btnToRender.name) {
       dispatch(
        setBtnToRender({ name: e.target.name, isActive: !btnToRender.isActive })
      );
    } else {
       dispatch(setBtnToRender({ name: e.target.name, isActive: true }));
    }
  };
  return (
    <button
      onClick={(e) => {
         clickHandle(e);
      }}
      className={
        btnToRender.isActive && btnToRender.name == name
          ? `${styles.button} ${styles.buttonIsActive}`
          : styles.button
      }
      name={name}
    >
      {name}
    </button>
  );
}
