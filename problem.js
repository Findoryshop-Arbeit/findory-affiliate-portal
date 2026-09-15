const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

async function initProblemPage() {
  const detail = document.getElementById('problem-detail');
  try {
    const [problemResponse, categoryResponse] = await Promise.all([
      fetch('content/problems.json'),
      fetch('content/categories.json')
    ]);
    if (!problemResponse.ok || !categoryResponse.ok) throw new Error('Content files unavailable');
    const [problems, categories] = await Promise.all([problemResponse.json(), categoryResponse.json()]);
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
  } catch (error) {
    console.error('Findory problem page could not be loaded.', error);
    detail.querySelector('h1').textContent = 'Problemseite nicht gefunden';
    document.getElementById('detail-problem').textContent = 'Bitte kehre zur Themenübersicht zurück.';
    document.getElementById('detail-summary').textContent = '';
  }
}

initProblemPage();
