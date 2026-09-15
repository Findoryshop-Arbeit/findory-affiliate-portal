const contentRoot = document.getElementById('blog-content');
const statusEl = document.getElementById('blog-status');
const searchInput = document.getElementById('blog-search');
const searchForm = document.getElementById('blog-search-form');
let posts = [];

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const formatDate = (value) => value ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(value)) : '';
const isPublished = (post) => post.status === 'published' && post.visibility !== 'hidden' && post.visibility !== 'archived';
const searchableText = (post) => [post.title, post.excerpt, ...(post.tags || [])].join(' ').toLowerCase();

function createPostCard(post) {
  const media = post.cover
    ? '<img src="' + escapeHtml(post.cover) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">'
    : '<div class="card-image-placeholder" aria-hidden="true"><span>Ratgeber</span></div>';
  const url = 'post.html?slug=' + encodeURIComponent(post.slug);
  return '<article class="problem-card blog-card">' +
    '<a class="card-image" href="' + url + '">' + media + '</a>' +
    '<div class="card-body">' +
    '<p class="card-meta">' + escapeHtml(formatDate(post.publishedAt)) + ' · ' + escapeHtml(post.readingTime || 'Ratgeber') + '</p>' +
    '<h2><a href="' + url + '">' + escapeHtml(post.title) + '</a></h2>' +
    '<p>' + escapeHtml(post.excerpt || '') + '</p>' +
    '<a class="text-link" href="' + url + '">Beitrag lesen →</a>' +
    '</div></article>';
}

function render(query = '') {
  const term = query.trim().toLowerCase();
  const matches = posts.filter(isPublished).filter((post) => !term || searchableText(post).includes(term));
  contentRoot.innerHTML = matches.length ? matches.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))).map(createPostCard).join('') : '<p class="blog-empty">Noch kein passender Ratgeberbeitrag gefunden.</p>';
  statusEl.textContent = term ? String(matches.length) + ' Beitrag' + (matches.length === 1 ? '' : 'e') + ' gefunden.' : String(matches.length) + ' veröffentlichte' + (matches.length === 1 ? 'r' : '') + ' Beitrag' + (matches.length === 1 ? '' : 'e') + '.';
}

searchForm.addEventListener('submit', (event) => { event.preventDefault(); render(searchInput.value); });
searchInput.addEventListener('input', () => render(searchInput.value));

fetch('content/posts.json')
  .then((response) => { if (!response.ok) throw new Error('posts.json konnte nicht geladen werden.'); return response.json(); })
  .then((data) => { posts = Array.isArray(data) ? data : []; render(new URLSearchParams(location.search).get('q') || ''); })
  .catch(() => { contentRoot.innerHTML = '<p class="blog-empty">Der Ratgeber ist vorübergehend nicht verfügbar.</p>'; statusEl.textContent = 'Inhalt konnte nicht geladen werden.'; });
