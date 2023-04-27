
import { useEffect, useState } from "react";
import { getDataFromApi } from "src/utils/getDataFromApi";


export const useRegions = () => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    getDataFromApi("regions").then((data) => {
      setRegions(data.body);
    });
  }, []);

  return {
    regions
  };
};
