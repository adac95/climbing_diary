import React from "react";

export default function SelectTopoOption({ data, inputToSet }) {
  return (
    <select
      onChange={(e) => {
        inputToSet(e.target.value);
      }}
    >
      <option value=''>--- choose ---</option>
      {data &&
        data.map((dataToMap) => {
          return (
            <option key={dataToMap._id} value={dataToMap._id}>
              {dataToMap.name}
            </option>
          );
        })}
    </select>
  );
}
