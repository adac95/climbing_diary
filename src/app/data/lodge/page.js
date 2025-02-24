'use client'

import LodgeForm from "../components/LodgeForm";
import Navigation from "../components/Navigation";

export default function LodgePage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Lodge</h1>
      <LodgeForm />
    </div>
  );
}
