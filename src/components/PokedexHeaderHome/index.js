'use client'
import { useState } from "react";
import styles from "./PokedexHeaderHome.module.css";
import Modal from "@components/Modal";
import PokedexNewRouteModal from "@components/PokedexNewRouteModal";

export default function PokedexHeaderHome() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <h2>Rutas en tu pokedex</h2>
        <button
          className={styles.button}
          onClick={() => setIsOpen(true)}
        ></button>
        
      </header>
      {isOpen && <Modal isOpen={isOpen} onClose={closeModal}><PokedexNewRouteModal/></Modal>}
    </>
  );
}
