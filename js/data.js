export async function loadPokemon(limit = 100) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const details = await Promise.all(
    data.results.map(async (p, i) => {
      const id = i + 1;
      const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const detail = await detailRes.json();

      return {
        id,
        name: p.name,
        base_experience: detail.base_experience
      };
    })
  );

  return details;
}
