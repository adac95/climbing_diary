'use client'

import Navigation from "../components/Navigation";
import SectorStyleForm from "../components/SectorStyleForm";

export default function SectorStylePage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Relación Sector-Style</h1>
      <SectorStyleForm />
    </div>
  );
}