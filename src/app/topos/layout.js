
import {
  getAllPlaces,
  getAllRegions,
  getAllRoutes,
  getAllSectos,
} from "./fetchData";
import TopoSelector from "./topoSelector";

export default async function Toposlayout({ children }) {
  const regions = await getAllRegions();
  const places = await getAllPlaces();
  const sectors = await getAllSectos();
  const routes = await getAllRoutes();

  return (
    <div>
      <TopoSelector
        regions={regions}
        places={places}
        sectors={sectors}
        routes={routes}
      />

      <div>{children}</div>
    </div>
  );
}
