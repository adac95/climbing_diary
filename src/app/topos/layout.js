import TopoSelector from "./topoSelector";
import { getAllRegions, getAllPlaces } from "./fetchData";

export default async function Toposlayout({ children }) {
  const regions = await getAllRegions();
  const places = await getAllPlaces();
  
  return (
    <main>
      <div style={{ width: '100%', position: 'relative' }}>
        <TopoSelector regions={regions} places={places} />
      </div>
      {children}
    </main>
  );
}
