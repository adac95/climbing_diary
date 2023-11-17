'use client'
import React, { useRef } from "react";
import { API_URL } from "variables";

export const ImageTest = () => {
  const form1 = useRef(null);
  const form2 = useRef(null);
  return (
    <>
    <form
      ref={form1}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(form1.current);
        fetch(`${API_URL}/api/routes`, {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((json) => console.log(json));
      }
    }
    >
      <input type='file' name="image" />
      <input type='text' name='name' defaultValue='prueba4' />
      <input type='text' name='style' defaultValue='lead' />
      <input
        type='text'
        name='sector'
        defaultValue='6311749cfa7f48ae79c52a57'
      />
      <input type='text' name='grade' defaultValue='{"usa": "a"}' />
      <input type='text' name='is_project' defaultValue='false' />
      <input type='text' name='is_multipitch' defaultValue='false' />
      <button>enviar</button>
    </form>

<br/><br/><br/><br/>

SECTOR
<form
ref={form2}
onSubmit={(e) => {
  e.preventDefault();
  const data = new FormData(form2.current);
  fetch(`${API_URL}/api/sectors/63117b9ca76bcb3646779e76`, {
    method: "PUT",
    body: data,
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}
}
>
<input type='file' name="image_with_routes" />
<button>enviar</button>
</form>
</>
  );
};
