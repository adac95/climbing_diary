'use client'
import DeveloperForm from "../components/DeveloperForm";
import Navigation from "../components/Navigation";


export default function DeveloperPage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Developer</h1>
      <DeveloperForm />
    </div>
  );
}
