import { Suspense } from "react";
import TopoSelector from "./topoSelector";
import SkeletonTopoSelector from "./components/SkeletonLoader/SkeletonTopoSelector.js";
import { getCachedPlaces, getCachedRegions } from "../../utils/fetchData";

export default async function Toposlayout({ children }) {
 await getCachedRegions();
  // const places = await getCachedPlaces();

  return (
    <Suspense fallback={<SkeletonTopoSelector />}>
      <div>
        <TopoSelector regions={[]} places={[]} />
        {children}
      </div>
    </Suspense>
  );
}
