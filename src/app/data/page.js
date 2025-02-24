// app/data/page.js
'use client'

import DataList from "./components/DataList";
import FormWizard from "./components/FormWizzard";
import Navigation from "./components/Navigation";
import RouteFormExisting from "./components/RouteFormExisting";
// app/data/page.js

export default function DataPage() {
  return (
    <div>
        <Navigation />
      <h1>Data Insertion Wizard</h1>
     {/* <FormWizard /> */}
    
      {/* <RouteFormExisting /> */}
      <hr />
      <h2>Datos Creados</h2>
      <DataList tableName="country" title="Países" columns={["id", "name"]} />
      <DataList tableName="region" title="Regiones" columns={["id", "name", "country_id"]} />
      <DataList tableName="place" title="Lugares" columns={["id", "name", "region_id"]} />
      <DataList tableName="sector" title="Sectores" columns={["id", "name", "place_id"]} />
      <DataList tableName="camping" title="Camping" columns={["id", "name", "place_id"]} />
      <DataList tableName="approach" title="Approach" columns={["id", "information", "place_id"]} />
      <DataList tableName="lodge" title="Lodge" columns={["id", "name", "place_id"]} />
      <DataList tableName="style" title="Estilos" columns={["id", "name"]} />
      <DataList tableName="route" title="Rutas" columns={["id", "name", "sector_id", "style_id"]} />
      <DataList tableName="developer" title="Developers" columns={["id", "name"]} />
      <DataList tableName="route_developer" title="Relación Route-Developer" columns={["route_id", "developer_id"]} />
      <DataList tableName="sector_style" title="Relación Sector-Style" columns={["sector_id", "style_id"]} />
    </div>
  );
}
