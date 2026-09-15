const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

function renderProblemCard(card) {
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
  const title = document.createElement('h2');
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

async function initCategoryPage() {
  const title = document.getElementById('category-title');
  try {
    const [categoryResponse, problemResponse] = await Promise.all([
      fetch('content/categories.json'),
      fetch('content/problems.json')
    ]);
    if (!categoryResponse.ok || !problemResponse.ok) throw new Error('Content files unavailable');
    const [categories, problems] = await Promise.all([categoryResponse.json(), problemResponse.json()]);
    const category = categories.find((item) => item.slug === slug);
    if (!category) throw new Error('Category not found');
    title.textContent = category.title;
    document.title = 'Findory – ' + category.title;
    document.getElementById('category-description').textContent = category.description;
    const cards = document.getElementById('category-cards');
    problems.filter((item) => item.category === category.slug).forEach((card) => cards.append(renderProblemCard(card)));
  } catch (error) {
    console.error('Findory category page could not be loaded.', error);
    title.textContent = 'Kategorie nicht gefunden';
    document.getElementById('category-description').textContent = 'Bitte kehre zur Startseite zurück.';
  }
}

initCategoryPage();
