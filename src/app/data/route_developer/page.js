'use client'
import Navigation from "../components/Navigation";
import RouteDeveloperForm from "../components/RouteDeveloperForm";

export default function RouteDeveloperPage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Relación Route-Developer</h1>
      <RouteDeveloperForm />
    </div>
  );
}
