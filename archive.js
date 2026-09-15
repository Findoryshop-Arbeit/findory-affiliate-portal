const params = new URLSearchParams(window.location.search);
const searchInput = document.getElementById('archive-search');
const status = document.getElementById('archive-status');
const content = document.getElementById('archive-content');

function isArchived(item) {
  return item.visibility === 'archived' || item.status === 'archived';
}

function searchableText(item) {
  return [item.title, item.problem, item.summary, ...(item.tags || [])].join(' ').toLowerCase();
}

function createArchiveCard(card) {
  const article = document.createElement('article');
  article.className = 'problem-card';
  if (card.asset) {
    const image = document.createElement('img');
    image.className = 'problem-image';
    image.src = card.asset;
    image.alt = card.title;
    article.append(image);
  } else {
    const image = document.createElement('div');
    image.className = 'problem-image';
    image.setAttribute('role', 'img');
    image.setAttribute('aria-label', 'Bild folgt nach externer Erstellung');
    image.textContent = 'Bild folgt';
    article.append(image);
  }
  const title = document.createElement('h3');
  title.textContent = card.title;
  const summary = document.createElement('p');
  summary.textContent = card.summary;
  const meta = document.createElement('small');
  meta.className = 'archive-status';
  meta.textContent = card.archivedAt ? 'Archiviert am ' + card.archivedAt : 'Archivseite';
  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = 'problem.html?slug=' + encodeURIComponent(card.slug);
  link.textContent = 'Lösung ansehen →';
  article.append(title, summary, meta, link);
  return article;
}

function renderArchive(categories, problems, query = '') {
  const term = query.trim().toLowerCase();
  const archived = problems.filter((problem) => isArchived(problem) && (!term || searchableText(problem).includes(term)));
  content.innerHTML = '';
  status.textContent = term
    ? archived.length + (archived.length === 1 ? ' archivierte Problemseite gefunden.' : ' archivierte Problemseiten gefunden.')
    : archived.length + (archived.length === 1 ? ' archivierte Problemseite verfügbar.' : ' archivierte Problemseiten verfügbar.');

  categories.slice().sort((a, b) => (a.order || 999) - (b.order || 999)).forEach((category) => {
    const cards = archived.filter((problem) => problem.category === category.slug);
    if (!cards.length) return;
    const section = document.createElement('section');
    section.className = 'archive-section';
    const heading = document.createElement('h2');
    heading.textContent = category.title;
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    cards.forEach((card) => grid.append(createArchiveCard(card)));
    section.append(heading, grid);
    content.append(section);
  });

  if (!archived.length) {
    const empty = document.createElement('div');
    empty.className = 'archive-empty';
    empty.textContent = term ? 'Kein archivierter Treffer für diese Suche.' : 'Noch keine Problemseiten archiviert. Sobald ein Thema aus dem aktiven Katalog genommen wird, bleibt es hier verfügbar.';
    content.append(empty);
  }
}

async function initArchive() {
  try {
    const [categoryResponse, problemResponse] = await Promise.all([
      fetch('content/categories.json'),
      fetch('content/problems.json')
    ]);
    if (!categoryResponse.ok || !problemResponse.ok) throw new Error('Content files unavailable');
    const [categories, problems] = await Promise.all([categoryResponse.json(), problemResponse.json()]);
    const initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;
    renderArchive(categories, problems, initialQuery);
    document.getElementById('archive-search-form').addEventListener('submit', (event) => {
      event.preventDefault();
      renderArchive(categories, problems, searchInput.value);
    });
    searchInput.addEventListener('input', () => renderArchive(categories, problems, searchInput.value));
  } catch (error) {
    console.error('Findory archive could not be loaded.', error);
    status.textContent = 'Die Archivdaten konnten noch nicht geladen werden.';
  }
}

initArchive();
