const toneClasses = {
  mint: 'category-green',
  blue: 'category-blue',
  yellow: 'category-orange',
  coral: 'category-pink'
};

let categories = [];
let problems = [];

function isArchived(item) {
  return item.visibility === 'archived' || item.status === 'archived';
}

function isHidden(item) {
  return item.visibility === 'hidden' || item.status === 'hidden';
}

function searchableText(item) {
  return [item.title, item.problem, item.summary, ...(item.tags || [])].join(' ').toLowerCase();
}

function createProblemCard(card) {
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
  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = 'problem.html?slug=' + encodeURIComponent(card.slug);
  link.textContent = 'Zur Problemseite →';
  article.append(title, summary, link);
  return article;
}

function renderCards(query = '') {
  const themeRoot = document.getElementById('themen');
  if (!themeRoot) return;
  const term = query.trim().toLowerCase();
  const visibleCategories = categories
    .filter((category) => !isArchived(category) && !isHidden(category))
    .slice()
    .sort((a, b) => (a.order || 999) - (b.order || 999));
  const activeProblems = problems.filter((problem) => !isArchived(problem) && !isHidden(problem));
  const activeMatches = activeProblems.filter((problem) => !term || searchableText(problem).includes(term));
  const archivedMatches = problems.filter((problem) => isArchived(problem) && !isHidden(problem) && (!term || searchableText(problem).includes(term)));

  themeRoot.innerHTML = '';

  if (term) {
    const notice = document.createElement('p');
    notice.className = 'search-message';
    notice.setAttribute('role', 'status');
    notice.textContent = activeMatches.length
      ? activeMatches.length + ' passende aktuelle Themen gefunden.'
      : 'Keine passenden aktuellen Themen gefunden.';
    if (archivedMatches.length) {
      const archiveLink = document.createElement('a');
      archiveLink.href = 'archive.html?q=' + encodeURIComponent(query.trim());
      archiveLink.textContent = ' ' + archivedMatches.length + ' Treffer im Archiv ansehen →';
      notice.append(archiveLink);
    }
    themeRoot.append(notice);
  }

  visibleCategories.forEach((category) => {
    const section = document.createElement('section');
    section.id = category.slug;
    section.className = 'category-section ' + (toneClasses[category.tone] || 'category-green');

    const heading = document.createElement('div');
    heading.className = 'section-heading';
    const copy = document.createElement('div');
    const icon = document.createElement('span');
    icon.className = 'category-icon';
    icon.textContent = category.icon || '•';
    const title = document.createElement('h2');
    title.textContent = category.title;
    const description = document.createElement('p');
    description.textContent = category.description || '';
    copy.append(icon, title, description);
    const categoryLink = document.createElement('a');
    categoryLink.href = 'category.html?slug=' + encodeURIComponent(category.slug);
    categoryLink.textContent = 'Alle Themen ansehen →';
    heading.append(copy, categoryLink);

    const grid = document.createElement('div');
    grid.className = 'card-grid';
    activeProblems
      .filter((problem) => problem.category === category.slug && (!term || searchableText(problem).includes(term)))
      .forEach((problem) => grid.append(createProblemCard(problem)));

    if (!grid.children.length) {
      const empty = document.createElement('p');
      empty.className = 'category-empty';
      empty.textContent = term ? 'Für diese Kategorie gibt es keinen passenden aktuellen Treffer.' : 'Neue Problemseiten werden hier ergänzt.';
      section.append(heading, empty);
    } else {
      section.append(heading, grid);
    }
    themeRoot.append(section);
  });
}

function bindSearch() {
  document.getElementById('search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = document.getElementById('hero-search').value;
    const headerSearch = document.getElementById('header-search');
    if (headerSearch) headerSearch.value = value;
    renderCards(value);
    document.getElementById('themen')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('header-search')?.addEventListener('input', (event) => renderCards(event.target.value));
}

async function loadContent() {
  try {
    const [categoryResponse, problemResponse] = await Promise.all([
      fetch('content/categories.json'),
      fetch('content/problems.json')
    ]);
    if (!categoryResponse.ok || !problemResponse.ok) throw new Error('Content files unavailable');
    [categories, problems] = await Promise.all([categoryResponse.json(), problemResponse.json()]);
    renderCards();
  } catch (error) {
    console.error('Findory content could not be loaded.', error);
    const notice = document.createElement('p');
    notice.className = 'search-message';
    notice.textContent = 'Die Inhaltsdaten konnten noch nicht geladen werden.';
    document.getElementById('themen')?.prepend(notice);
  }
}

bindSearch();
loadContent();
