const elements = {};
let sortColumn = 'base_experience';
let sortDirection = 'desc';
const state = {
  data: []
};

// Initialize UI and bind events
export function initUI({ onRowClick, onBackClick }) {
  Object.assign(elements, {
    title: document.getElementById('title'),
    list: document.getElementById('pokemon-list'),
    tableContainer: document.getElementById('pokemon-table-container'),
    detail: document.getElementById('pokemon-details'),
    searchInput: document.getElementById('searchInput'),
    backBtn: document.getElementById('backButton'),
    detailName: document.getElementById('detail-name'),
    detailSprite: document.getElementById('detail-sprite'),
    detailExp: document.getElementById('detail-experience'),
    detailHeight: document.getElementById('detail-height'),
    detailWeight: document.getElementById('detail-weight'),
    detailTypes: document.getElementById('detail-types')
  });

  elements.searchInput.addEventListener('input', debounce(() => {
    renderTable(state.data, { onRowClick });
  }, 300));

  elements.backBtn.addEventListener('click', () => {
    elements.detail.style.display = 'none';
    elements.list.style.display = 'block';
    elements.title.textContent = 'Pokémon by Base Experience';
    if (onBackClick) onBackClick();
  });
}

// Render the main table
export function renderTable(data, { onRowClick } = {}) {
  state.data = data;

  const query = elements.searchInput.value.trim().toLowerCase();

  const filtered = [...data].filter(p =>
    p.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    elements.tableContainer.innerHTML = `<div style="padding: 10px;">No results found 😢</div>`;
    return;
  }

  filtered.sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th data-col="name">Name</th>
        <th data-col="base_experience">Experience</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map((p, i) => `
        <tr data-id="${p.id}">
          <td>${i + 1}</td>
          <td>${p.name}</td>
          <td>${p.base_experience}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  elements.tableContainer.innerHTML = '';
  elements.tableContainer.appendChild(table);

  elements.tableContainer.scrollTop = 0;

  // Set sorted column arrow
  table.querySelectorAll('th[data-col]').forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    if (th.dataset.col === sortColumn) {
      th.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
    }
  });

  // Single event listener for sorting and row click
  table.addEventListener('click', (event) => {
    const th = event.target.closest('th[data-col]');
    const tr = event.target.closest('tr[data-id]');

    if (th) {
      const col = th.dataset.col;
      if (col === sortColumn) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = col;
        sortDirection = 'asc';
      }
      renderTable(state.data, { onRowClick });
      return;
    }

    if (tr && onRowClick) {
      const id = tr.dataset.id;
      onRowClick(id);
    }
  });
}

// Render detail view
export async function showPokemonDetails(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    elements.detailName.textContent = data.name;
    elements.detailSprite.src = data.sprites.front_default;
    elements.detailExp.textContent = data.base_experience;
    elements.detailHeight.textContent = data.height;
    elements.detailWeight.textContent = data.weight;
    elements.detailTypes.textContent = data.types.map(t => t.type.name).join(', ');

    elements.list.style.display = 'none';
    elements.detail.style.display = 'block';
    elements.title.textContent = 'Pokémon Details';
  } catch (err) {
    console.error('Failed to load Pokémon details:', err);
    alert('Failed to load details.');
  }
}

// Debounce helper
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
