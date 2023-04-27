export default function SectorsToRender({ sectors }) {
  const { name, aproach, style } = sectors;

  return (
    <>
      <h3>{name}</h3>
      <h4>Aproach</h4>
      <p>{aproach}</p>
      <h4>Estilos de escalada</h4>
      <p>{style.map((e) => `[${e} ]`)}</p>
      <h4>Cantida de rutas</h4>
      <button>Ver rutas</button>
    </>
  );
}
