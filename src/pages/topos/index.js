import { useEffect, useState } from "react";
import { render } from "react-dom";

export default function Topos() {
  const [regions, setRegions] = useState([]);
  const [regionInput, setRegionInput] = useState("");
  const [placeInput, setPlaceInput] = useState();
  const [places, setPlaces] = useState([]);
  const [renderPlace, setRenderPlace] = useState();
  const getData = async (search) => {
    const res = await fetch(`http://localhost:3001/api/${search}`);
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    getData("regions").then((data) => {
      setRegions(data.body);
    });
  }, []);

  useEffect(() => {
    getData(`places/search?region=${regionInput}`).then((data) => {
      setPlaces(data.body);
      setPlaceInput(null)
    });
  }, [regionInput]);

  useEffect(() => {
    getData(`places/${placeInput}`).then((data) => {
      console.log(data);
      setRenderPlace(data.body);
    });
  }, [placeInput]);

  return (
    <div>
      <h3>Escoge el lugar</h3>
      <select
        onChange={(e) => {
          setRegionInput(e.target.value);
        }}
      >
        <option value="">--- choose ---</option>
        {regions.map((region) => {
          return (
            <>
              <option key={region._id} value={region._id}>
                {region.name}
              </option>
            </>
          );
        })}
      </select>
      {places && (
        <select
    
          onChange={(e) => {
            setPlaceInput(e.target.value);
          }}
        >
          <option value="">--- choose ---</option>
          {places.map((place) => {
            return (
              <>
                <option key={place._id} value={place._id}>
                  {place.name}
                </option>
              </>
            );
          })}
        </select>
      )}
      {renderPlace && <>
      <h2>{renderPlace.name}</h2>
      <h4>Informacion</h4> 
      <p>{renderPlace.aproach.info}</p>
      <h4>¿Cómo llegar?</h4>
      <h5>Transporte público:</h5>
      <p>{renderPlace.aproach['transporte publico']}</p>
      <h5>Transporte privado:</h5>
      <p>{renderPlace.aproach['transporte privado']}</p>
      <h4>Precios</h4>
      <p>{renderPlace.price}</p>
      <h4>Zona de camping</h4>
      <p>{renderPlace.camping.price}</p>
      <h4>Lodge/Hospedaje</h4>
      <p>{renderPlace.lodge.price}</p>
      </>}
    </div>
  );
}