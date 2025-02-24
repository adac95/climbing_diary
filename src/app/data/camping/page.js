'use client';
import Navigation from '../components/Navigation';
import CampingForm from '../components/CampingForm';

export default function CampingPage() {
  return (
    <div>
      <Navigation />
      <h1>Insertar Camping</h1>
      <CampingForm />
    </div>
  );
}
