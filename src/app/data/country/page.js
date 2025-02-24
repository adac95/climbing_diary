'use client'

import CountryForm from "../components/CountryForm";
import Navigation from "../components/Navigation";

export default function CountryPage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar País</h1>
      <CountryForm />
    </div>
  );
}