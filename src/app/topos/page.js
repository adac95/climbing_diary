import React from "react";
import {getAllPlaces, getAllRegions, getAllRoutes, getAllSectos} from "./fetchData";
import Topos from "./Topos";

export default async function page() {
    const regions = await getAllRegions()
    const places = await getAllPlaces()
    const sectors = await getAllSectos()
    const routes = await getAllRoutes()
  return (
    <div>
      <Topos regions={regions} places={places} sectors={sectors} routes={routes} />
    </div>
  );
}
