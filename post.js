const headerRoot = document.getElementById('post-header');
const contentRoot = document.getElementById('post-content');
const postArticle = document.getElementById('post-article');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const formatDate = (value) => value ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' }).format(new Date(value)) : '';
const isPublished = (post) => post.status === 'published' && post.visibility !== 'hidden' && post.visibility !== 'archived';

function renderBlock(block) {
  if (block.type === 'heading') return '<h2>' + escapeHtml(block.text) + '</h2>';
  if (block.type === 'list') return '<ul>' + (block.items || []).map((item) => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>';
  return '<p>' + escapeHtml(block.text || '') + '</p>';
}

function renderPost(post) {
  document.title = 'Findory – ' + post.title;
  headerRoot.innerHTML = '<p class="eyebrow">Findory Ratgeber</p>' +
    '<h1>' + escapeHtml(post.title) + '</h1>' +
    '<p class="post-lead">' + escapeHtml(post.excerpt || '') + '</p>' +
    '<p class="post-meta">' + escapeHtml(formatDate(post.publishedAt)) + ' · ' + escapeHtml(post.readingTime || 'Ratgeber') + ' · ' + escapeHtml(post.author || 'Findory Redaktion') + '</p>';
  contentRoot.innerHTML = (post.body || []).map(renderBlock).join('');
}

fetch('content/posts.json')
  .then((response) => { if (!response.ok) throw new Error('posts.json konnte nicht geladen werden.'); return response.json(); })
  .then((posts) => {
    const slug = new URLSearchParams(location.search).get('slug');
    const post = (Array.isArray(posts) ? posts : []).find((item) => item.slug === slug && isPublished(item));
    if (!post) throw new Error('Beitrag nicht gefunden.');
    renderPost(post);
  })
  .catch(() => {
    postArticle.innerHTML = '<div class="blog-empty"><h1>Beitrag nicht gefunden</h1><p>Dieser Beitrag ist nicht verfügbar oder wurde noch nicht veröffentlicht.</p><a class="text-link" href="blog.html">Zum Ratgeber →</a></div>';
  });
