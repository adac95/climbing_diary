import PokedexHeaderHome from "@components/PokedexHeaderHome";
import PokedexRoute from "@components/PokedexRoute";

export default async function Home() {
  return (
    <main>
      <PokedexHeaderHome />
      <PokedexRoute />
    </main>
  );
}
