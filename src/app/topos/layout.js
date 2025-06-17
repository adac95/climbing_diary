import TopoSelector from "./topoSelector";
import { getAllRegions, getAllPlaces } from "./fetchData";
import SimpleBreadcrumb from "@/components/Breadcrumb/SimpleBreadcrumb";

export default async function Toposlayout({ children }) {
  // Solo obtener los datos necesarios para el TopoSelector
  const regions = await getAllRegions();
  const places = await getAllPlaces();

  return (
    <main>
      <div>
        <TopoSelector regions={regions} places={places} />
        {/* Breadcrumb persistente simplificado */}
        <SimpleBreadcrumb />
      </div>
      {children}
    </main>
  );
}
