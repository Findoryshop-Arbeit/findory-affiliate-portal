const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

async function initProblemPage() {
  const detail = document.getElementById('problem-detail');
  try {
    const [problemResponse, categoryResponse, guideResponse, productResponse] = await Promise.all([
      fetch('content/problems.json'),
      fetch('content/categories.json'),
      fetch('content/guides.json'),
      fetch('data/security-products.json')
    ]);
    if (!problemResponse.ok || !categoryResponse.ok) throw new Error('Content files unavailable');
    const [problems, categories, guides, products] = await Promise.all([
      problemResponse.json(), categoryResponse.json(),
      guideResponse.ok ? guideResponse.json() : {},
      productResponse.ok ? productResponse.json() : []
    ]);
    const problem = problems.find((item) => item.slug === slug);
    if (!problem) throw new Error('Problem not found');
    const category = categories.find((item) => item.slug === problem.category);

    detail.querySelector('h1').textContent = problem.title;
    document.title = 'Findory – ' + problem.title;
    document.getElementById('detail-problem').textContent = problem.problem;
    document.getElementById('detail-summary').textContent = problem.summary;
    const categoryLink = document.getElementById('category-link');
    categoryLink.href = category ? 'category.html?slug=' + encodeURIComponent(category.slug) : 'index.html#themen';
    categoryLink.textContent = category ? 'Mehr aus ' + category.title + ' →' : 'Zur Themenübersicht →';

    const imageContainer = document.getElementById('detail-image');
    if (problem.asset) {
      const image = document.createElement('img');
      image.src = problem.asset;
      image.alt = problem.title;
      image.className = 'detail-image';
      imageContainer.replaceWith(image);
    }

    const tags = document.getElementById('detail-tags');
    (problem.tags || []).forEach((tag) => {
      const item = document.createElement('span');
      item.textContent = tag;
      tags.append(item);
    });

    const guide = guides[problem.slug];
    if (guide) {
      document.querySelector('.detail-note').hidden = true;
      renderGuide(guide);
      renderProducts(products.filter((product) => product.guide === problem.slug));
    }
  } catch (error) {
    console.error('Findory problem page could not be loaded.', error);
    detail.querySelector('h1').textContent = 'Problemseite nicht gefunden';
    document.getElementById('detail-problem').textContent = 'Bitte kehre zur Themenübersicht zurück.';
    document.getElementById('detail-summary').textContent = '';
  }
}

function renderGuide(guide) {
  const container = document.getElementById('guide-content');
  container.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'guide-intro';
  intro.textContent = guide.intro;
  container.append(intro);
  (guide.sections || []).forEach((section) => {
    const block = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = section.title;
    block.append(heading);
    (section.paragraphs || []).forEach((text) => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      block.append(paragraph);
    });
    container.append(block);
  });
  const conclusion = document.createElement('div');
  conclusion.className = 'guide-conclusion';
  const heading = document.createElement('h2');
  heading.textContent = 'Fazit';
  const paragraph = document.createElement('p');
  paragraph.textContent = guide.conclusion;
  conclusion.append(heading, paragraph);
  container.append(conclusion);
  container.hidden = false;
}

function renderProducts(products) {
  const section = document.getElementById('product-section');
  const grid = document.getElementById('product-grid');
  grid.replaceChildren();
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const image = document.createElement('div');
    image.className = 'product-image-placeholder';
    image.textContent = 'Produktbild folgt nach Freigabe';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const meta = document.createElement('p');
    meta.className = 'product-meta';
    meta.textContent = product.brand + ' · ' + product.variant;
    const description = document.createElement('p');
    description.textContent = product.description;
    const details = document.createElement('div');
    details.className = 'product-details';
    const advantages = document.createElement('div');
    advantages.innerHTML = '<strong>Vorteile</strong>';
    (product.advantages || []).forEach((text) => { const li = document.createElement('span'); li.textContent = '✓ ' + text; advantages.append(li); });
    const disadvantages = document.createElement('div');
    disadvantages.innerHTML = '<strong>Beachten</strong>';
    (product.disadvantages || []).forEach((text) => { const li = document.createElement('span'); li.textContent = '– ' + text; disadvantages.append(li); });
    details.append(advantages, disadvantages);
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = product.amazonUrl;
    link.target = '_blank';
    link.rel = 'sponsored noopener';
    link.textContent = 'Hier mehr erfahren ↗';
    card.append(image, title, meta, description, details, link);
    grid.append(card);
  });
  section.hidden = products.length === 0;
}

initProblemPage();
