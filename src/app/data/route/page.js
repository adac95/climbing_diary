'use client'
import Navigation from "../components/Navigation";
import RouteForm from "../components/RouteForm";


export default function RoutePage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Ruta</h1>
      <RouteForm />
    </div>
  );
}
