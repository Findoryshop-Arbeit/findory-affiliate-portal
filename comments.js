const SUPABASE_URL = 'https://hidmgfmxhqfoehefgeuz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_G2DoqzkZ55PxpRHbCJPHUg_t_95ZF2B';
const section = document.querySelector('.comments-section');
const slug = new URLSearchParams(location.search).get('slug');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const formatDate = (value) => value ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(value)) : '';

if (section && slug) {
  const list = document.createElement('div');
  list.className = 'public-comments';
  list.innerHTML = '<h3>Freigegebene Kommentare</h3><p class="comments-status">Kommentare werden geladen …</p>';
  section.appendChild(list);
  const query = new URLSearchParams({ select: 'id,author_name,body,created_at', post_slug: 'eq.' + slug, status: 'eq.approved', order: 'created_at.desc' });
  fetch(SUPABASE_URL + '/rest/v1/comments?' + query.toString(), { headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + SUPABASE_PUBLISHABLE_KEY } })
    .then((response) => { if (!response.ok) throw new Error('Kommentare konnten nicht geladen werden.'); return response.json(); })
    .then((comments) => {
      if (!comments.length) { list.innerHTML = '<h3>Freigegebene Kommentare</h3><p class="comments-status">Noch keine freigegebenen Kommentare.</p>'; return; }
      list.innerHTML = '<h3>Freigegebene Kommentare</h3>' + comments.map((comment) => '<article class="comment"><p class="comment-meta">' + escapeHtml(comment.author_name) + ' · ' + escapeHtml(formatDate(comment.created_at)) + '</p><p>' + escapeHtml(comment.body) + '</p></article>').join('');
    })
    .catch(() => { list.innerHTML = '<h3>Freigegebene Kommentare</h3><p class="comments-status">Kommentare sind momentan nicht verfügbar.</p>'; });
}
