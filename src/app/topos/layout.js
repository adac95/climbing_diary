import { Suspense } from "react";
import TopoSelector from "./topoSelector";
import SkeletonTopoSelector from "./components/SkeletonLoader/SkeletonTopoSelector.js";
import { getAllRegions, getAllPlaces } from "./fetchData";

export default async function Toposlayout({ children }) {
  const regions = await getAllRegions();
  const places = await getAllPlaces();

  return (
    <Suspense fallback={<SkeletonTopoSelector />}>
      <div>
        <TopoSelector regions={regions} places={places} />
        {children}
      </div>
    </Suspense>
  );
}
