function Route({ route }) {
  return (
    <>
      <p>{route.name}</p>
      <p>
      {Object.entries(route.grade).map(element => {
        return (`${element[0]}: ${element[1]} `)
      })}
      </p>
    </>
  );
}

export default Route;
