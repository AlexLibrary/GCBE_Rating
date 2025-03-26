import { initTheme } from './theme.js';
import { loadPokemon } from './data.js';
import { initUI, renderTable, showPokemonDetails } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme switcher
  initTheme();

  // Initialize UI event handlers
  initUI({
    onRowClick: showPokemonDetails,
    onBackClick: () => {
      renderTable(pokemonList, { onRowClick: showPokemonDetails });
    }
  });

  // Load data
  const pokemonList = await loadPokemon();

  // Render initial table
  renderTable(pokemonList, { onRowClick: showPokemonDetails });
});
