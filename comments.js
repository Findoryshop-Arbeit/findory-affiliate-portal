const SUPABASE_URL = 'https://hidmgfmxhqfoehefgeuz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_G2DoqzkZ55PxpRHbCJPHUg_t_95ZF2B';
const section = document.querySelector('.comments-section');
const slug = new URLSearchParams(location.search).get('slug');
const TOKEN_KEY = 'findory_comment_access_token';

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const formatDate = (value) => value ? new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(value)) : '';
const apiHeaders = () => ({ apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' });
const redirectUrl = () => window.location.href.split('#')[0];

function consumeMagicLink() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const token = params.get('access_token');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  history.replaceState(null, document.title, redirectUrl());
}

function renderStatus(target, message, isError = false) {
  target.textContent = message;
  target.classList.toggle('is-error', isError);
}

function renderAuthPanel(container) {
  container.innerHTML = '<h3>Kommentieren</h3><p>Zum Schutz vor Spam ist eine bestätigte E-Mail-Adresse erforderlich. Sie wird nicht öffentlich angezeigt und nicht im Kommentar gespeichert.</p><form class="comment-auth-form"><label for="comment-email">E-Mail-Adresse <span aria-hidden="true">*</span></label><input id="comment-email" name="email" type="email" autocomplete="email" required maxlength="254"><button type="submit">Bestätigungslink senden</button><p class="comments-status" aria-live="polite"></p></form>';
  const form = container.querySelector('form');
  const status = container.querySelector('.comments-status');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email').trim().toLowerCase();
    if (!email) return;
    renderStatus(status, 'Bestätigungslink wird gesendet …');
    try {
      const response = await fetch(SUPABASE_URL + '/auth/v1/otp?redirect_to=' + encodeURIComponent(redirectUrl()), { method: 'POST', headers: apiHeaders(), body: JSON.stringify({ email, create_user: true }) });
      if (!response.ok) throw new Error('Der Bestätigungslink konnte nicht gesendet werden.');
      renderStatus(status, 'Bitte prüfe dein Postfach und öffne den Bestätigungslink.');
    } catch (error) {
      renderStatus(status, error.message, true);
    }
  });
}

function renderCommentForm(container, token) {
  container.innerHTML = '<h3>Kommentar senden</h3><p>Dein Kommentar wird vor der Veröffentlichung geprüft. Die E-Mail-Adresse dient nur der Verifikation.</p><form class="comment-form"><label for="comment-email">E-Mail-Adresse <span aria-hidden="true">*</span></label><input id="comment-email" name="email" type="email" autocomplete="email" required maxlength="254"><label for="comment-name">Anzeigename</label><input id="comment-name" name="authorName" type="text" maxlength="80" placeholder="Leser/in"><label for="comment-body">Kommentar <span aria-hidden="true">*</span></label><textarea id="comment-body" name="body" rows="5" minlength="3" maxlength="4000" required></textarea><input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp-field" hidden><button type="submit">Kommentar zur Prüfung senden</button><p class="comments-status" aria-live="polite"></p></form>';
  const form = container.querySelector('form');
  const status = container.querySelector('.comments-status');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    values.authorName = values.authorName.trim() || 'Leser/in';
    renderStatus(status, 'Kommentar wird übermittelt …');
    try {
      const response = await fetch(SUPABASE_URL + '/functions/v1/submit-comment', { method: 'POST', headers: { ...apiHeaders(), Authorization: 'Bearer ' + token }, body: JSON.stringify({ postSlug: slug, email: values.email, authorName: values.authorName, body: values.body, website: values.website }) });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) { localStorage.removeItem(TOKEN_KEY); throw new Error('Die Anmeldung ist abgelaufen. Bitte fordere einen neuen Bestätigungslink an.'); }
      if (!response.ok) throw new Error(result.error === 'rate_limited' ? 'Zu viele Kommentare in kurzer Zeit. Bitte später erneut versuchen.' : 'Der Kommentar konnte nicht angenommen werden.');
      form.reset();
      renderStatus(status, 'Danke. Der Kommentar wartet jetzt auf Freigabe.');
    } catch (error) {
      renderStatus(status, error.message, true);
    }
  });
}

function renderPublicComments() {
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

if (section && slug) {
  consumeMagicLink();
  const composer = document.createElement('div');
  composer.className = 'comment-composer';
  section.appendChild(composer);
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) renderCommentForm(composer, token); else renderAuthPanel(composer);
  renderPublicComments();
}
