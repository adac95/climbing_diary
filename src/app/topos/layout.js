import { getAllRegions } from "./fetchData";
import TopoSelector from "./topoSelector";

export default async function Toposlayout({ children, params }) {
  const regions = await getAllRegions();
  return (
    <div>
      <TopoSelector regions={regions} />
      <div>{children}</div>
    </div>
  );
}
