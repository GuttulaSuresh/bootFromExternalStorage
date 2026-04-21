const CATEGORY_CONFIG = [
  { key: 'reliable', title: 'Top 100 Reliable Stocks', count: 100, prefix: 'Reliable' },
  {
    key: 'performingSinceLaunch',
    title: 'Top 100 Stocks Performing Since Launch',
    count: 100,
    prefix: 'Performance'
  },
  { key: 'startup', title: 'Top 100 Startup Stocks', count: 100, prefix: 'Startup' },
  { key: 'unicorn', title: 'Top 10 Unicorn Stocks', count: 10, prefix: 'Unicorn' },
  { key: 'dividend', title: 'Top 100 Dividend Stocks', count: 100, prefix: 'Dividend' },
  { key: 'mutualFund', title: 'Top 100 Mutual Funds Stocks', count: 100, prefix: 'Fund' },
  { key: 'crypto', title: 'Top 100 Crypto Stocks', count: 100, prefix: 'Crypto' },
  { key: 'evergreen', title: 'Top 100 Evergreen Stocks', count: 100, prefix: 'Evergreen' }
];

function tickerFrom(prefix, rank) {
  const clean = prefix.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() || 'STK';
  return `${clean}${String(rank).padStart(3, '0')}`;
}

function scoreFor(rank, categoryIndex) {
  const base = 100 - rank * 0.35;
  const adjustment = categoryIndex * 0.9;
  return Math.max(50, Number((base - adjustment).toFixed(2)));
}

function buildData() {
  return CATEGORY_CONFIG.map((category, categoryIndex) => ({
    ...category,
    items: Array.from({ length: category.count }, (_, idx) => {
      const rank = idx + 1;
      return {
        rank,
        name: `${category.prefix} Holdings ${rank}`,
        ticker: tickerFrom(category.prefix, rank),
        score: scoreFor(rank, categoryIndex)
      };
    })
  }));
}

function compareValues(a, b, sortBy) {
  if (sortBy === 'rank' || sortBy === 'score') {
    return a[sortBy] - b[sortBy];
  }

  return String(a[sortBy]).localeCompare(String(b[sortBy]));
}

function render(categories, filters) {
  const host = document.getElementById('lists');
  host.innerHTML = '';

  categories.forEach((category) => {
    const filteredItems = category.items
      .filter((item) => {
        if (!filters.query) {
          return true;
        }

        const q = filters.query.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.ticker.toLowerCase().includes(q);
      })
      .sort((a, b) => compareValues(a, b, filters.sortBy));

    const rows = filteredItems
      .map(
        (item) => `
          <tr>
            <td>${item.rank}</td>
            <td>${item.name}</td>
            <td><code>${item.ticker}</code></td>
            <td><span class="badge">${item.score}</span></td>
          </tr>
        `
      )
      .join('');

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h2>${category.title} (${filteredItems.length})</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Ticker</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;

    host.appendChild(card);
  });
}

const state = {
  query: '',
  sortBy: 'rank'
};

const data = buildData();

document.getElementById('search').addEventListener('input', (event) => {
  state.query = event.target.value.trim();
  render(data, state);
});

document.getElementById('sort-by').addEventListener('change', (event) => {
  state.sortBy = event.target.value;
  render(data, state);
});

render(data, state);
