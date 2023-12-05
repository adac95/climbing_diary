export default function PokedexNewRouteModal() {
  return (
    <section>
      <h2>Creando nueva ruta en tu pokedex</h2>
      <label>
        Nombre de la ruta
        <input type='text' />
      </label>
      <label>
        Estilo
        <select>
          <option>deportiva</option>
          <option>boulder</option>
          <option>tradicional</option>
        </select>{" "}
      </label>
      <label>
        grado
        <input type='text' />
      </label>
      <fieldset>
        <legend>Salió?</legend>
        <input id='encadenado' type='radio' name='a' value='encadenado' />
        <label htmlFor='encadenado'>Encadenado </label>
        <input id='proyecto' type='radio' name='a' value='proyecto' />
        <label htmlFor='proyecto'>Proyecto </label>
      </fieldset>
      <label>
        Nro pegues <input />
      </label>
      <label>Comentarios
        <textarea />
      </label>
      <button>Subir archivos</button>
    </section>
  );
}
