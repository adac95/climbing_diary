import Route from "@components/Route";
import { useEffect, useState } from "react";
import { getDataFromApi } from "src/utils/getDataFromApi";

function RoutesComponent() {
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    getDataFromApi("routes").then((data) => {
      setRoutes(data.body);
    });
  }, []);

  return (
    <>
      {routes.map((e) => (
        <Route key={e._id} route={e} />
      ))}
    </>
  );
}

export default RoutesComponent;
