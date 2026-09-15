const categoryRoots = {
  'wohnen-sparen': 'wohnen',
  'sicherheit-vorsorge': 'sicherheit',
  'gesund-arbeiten-leben': 'gesundheit',
  'alltag-leichter-machen': 'alltag'
};
let categories = [];
let problems = [];

function renderCards(query = '') {
  const term = query.trim().toLowerCase();
  let matches = 0;

  categories.slice().sort((a, b) => a.order - b.order).forEach((category) => {
    const root = document.getElementById(categoryRoots[category.slug]);
    if (!root) return;
    root.innerHTML = '';

    problems
      .filter((card) => {
        const haystack = [card.title, card.problem, card.summary, ...(card.tags || [])].join(' ').toLowerCase();
        return card.category === category.slug && (!term || haystack.includes(term));
      })
      .forEach((card) => {
        matches += 1;
        const article = document.createElement('article');
        article.className = 'problem-card';

        const image = document.createElement('div');
        image.className = 'problem-image';
        image.setAttribute('role', 'img');
        image.setAttribute('aria-label', 'Bild folgt nach externer Erstellung');
        image.textContent = 'Bild folgt';

        const title = document.createElement('h3');
        title.textContent = card.title;
        const summary = document.createElement('p');
        summary.textContent = card.summary;
        const link = document.createElement('a');
        link.className = 'card-link';
        link.href = '#' + card.slug;
        link.textContent = 'Zur Übersicht →';

        article.append(image, title, summary, link);
        root.append(article);
      });
  });

  let notice = document.querySelector('.search-message');
  if (term && !notice) {
    notice = document.createElement('p');
    notice.className = 'search-message';
    notice.setAttribute('role', 'status');
    document.getElementById('themen').prepend(notice);
  }
  if (notice) {
    notice.textContent = term ? (matches ? matches + ' passende Themen gefunden.' : 'Keine passenden Themen gefunden.') : '';
    notice.hidden = !term;
  }
}

function bindSearch() {
  document.getElementById('search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = document.getElementById('hero-search').value;
    document.getElementById('header-search').value = value;
    renderCards(value);
    document.getElementById('themen').scrollIntoView({ behavior: 'smooth' });
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
