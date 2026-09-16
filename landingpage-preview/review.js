(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('review') !== '1') return;

  const SUPABASE_URL = 'https://hidmgfmxhqfoehefgeuz.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_G2DoqzkZ55PxpRHbCJPHUg_t_95ZF2B';
  const SESSION_KEY = 'findory_review_session';
  const root = document.documentElement;
  let selectedElement = null;

  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
  const readSession = () => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  };
  const writeSession = (session) => localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const clearSession = () => localStorage.removeItem(SESSION_KEY);
  const apiHeaders = (token) => ({ apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  function consumeMagicLink() {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const accessToken = hash.get('access_token');
    if (!accessToken) return;
    writeSession({ accessToken, refreshToken: hash.get('refresh_token') || '', expiresAt: Date.now() + (Number(hash.get('expires_in')) || 3600) * 1000 });
    history.replaceState(null, document.title, `${location.pathname}${location.search}`);
  }

  function reviewElementLabel(element) {
    return element.dataset.reviewLabel || element.querySelector('h1, h2, h3, strong')?.textContent?.trim() || element.getAttribute('aria-label') || 'Seitenelement';
  }

  function selectorFor(element) {
    if (element.id) return `#${element.id}`;
    const classes = Array.from(element.classList || []).filter((name) => !name.startsWith('is-')).slice(0, 2);
    return classes.length ? `.${classes.join('.')}` : element.tagName.toLowerCase();
  }

  function markTargets() {
    document.querySelectorAll('.hero, .topic-group, .topic-card, .benefit-row, .about-strip, .detail-hero, .product-area, .detail-link, footer').forEach((element) => {
      element.dataset.reviewLabel ||= reviewElementLabel(element);
    });
  }

  function keepReviewModeInInternalLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const url = new URL(link.href, location.href);
      const isReviewPage = /\/landingpage-preview\/(?:index|category)\.html$/.test(url.pathname);
      if (url.origin === location.origin && isReviewPage) {
        url.searchParams.set('review', '1');
        link.href = url.href;
      }
    });
  }

  function panel() { return document.querySelector('#findory-review-panel'); }
  function status(message, isError = false) {
    const target = panel()?.querySelector('[data-review-status]');
    if (!target) return;
    target.textContent = message;
    target.classList.toggle('is-error', isError);
  }

  async function requestMagicLink(email) {
    const redirectTo = `${location.origin}${location.pathname}${location.search}`;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, create_user: false })
    });
    if (!response.ok) throw new Error('Der Anmeldelink konnte nicht gesendet werden.');
  }

  async function callAdmin(action, payload = {}) {
    const session = readSession();
    if (!session?.accessToken || session.expiresAt < Date.now()) {
      clearSession();
      throw new Error('Die Review-Anmeldung ist abgelaufen.');
    }
    const response = await fetch(`${SUPABASE_URL}/functions/v1/findory-admin`, {
      method: 'POST', headers: apiHeaders(session.accessToken), body: JSON.stringify({ action, ...payload })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) clearSession();
      throw new Error(response.status === 403 ? 'Dieser Bereich ist nur für die Projektverwaltung freigegeben.' : 'Der Review-Hinweis konnte nicht verarbeitet werden.');
    }
    return result;
  }

  function renderLogin() {
    panel().innerHTML = `<div class="review-panel-head"><div><p>Findory intern</p><h2>Review-Modus</h2></div><button class="review-close" type="button" aria-label="Review-Modus schließen">×</button></div><p class="review-intro">Melde dich mit der Projekt-E-Mail an. Erst danach lassen sich Seitenteile markieren und Hinweise speichern.</p><form class="review-login"><label for="review-email">E-Mail-Adresse</label><input id="review-email" name="email" type="email" autocomplete="email" required><button type="submit">Anmeldelink senden</button><p data-review-status aria-live="polite"></p></form>`;
    panel().querySelector('.review-close').addEventListener('click', closePanel);
    panel().querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = new FormData(event.currentTarget).get('email').trim().toLowerCase();
      status('Anmeldelink wird gesendet …');
      try { await requestMagicLink(email); status('Bitte öffne den neuesten Link direkt aus deinem E-Mail-Postfach.'); }
      catch (error) { status(error.message, true); }
    });
  }

  function renderNotes(rows) {
    const notes = panel().querySelector('[data-review-notes]');
    if (!notes) return;
    notes.innerHTML = rows.length ? rows.map((row) => `<article class="review-note"><div><strong>${escapeHtml(row.element_label)}</strong><span class="review-note-status">${escapeHtml(row.status)}</span></div><p>${escapeHtml(row.message)}</p><button type="button" data-review-resolve="${escapeHtml(row.id)}">Erledigt</button></article>`).join('') : '<p class="review-empty">Noch keine gespeicherten Hinweise.</p>';
    notes.querySelectorAll('[data-review-resolve]').forEach((button) => button.addEventListener('click', async () => {
      try { await callAdmin('review_status', { id: button.dataset.reviewResolve, status: 'resolved' }); await loadNotes(); }
      catch (error) { status(error.message, true); }
    }));
  }

  async function loadNotes() {
    try { const result = await callAdmin('review_list'); renderNotes(result.rows || []); }
    catch (error) { status(error.message, true); }
  }

  function renderWorkspace() {
    panel().innerHTML = `<div class="review-panel-head"><div><p>Findory intern</p><h2>Review-Modus</h2></div><button class="review-close" type="button" aria-label="Review-Modus schließen">×</button></div><p class="review-intro">Aktiviere das Markieren, klicke anschließend auf einen Bereich der Seite und beschreibe die Änderung.</p><div class="review-actions"><button class="review-select" type="button">Bereich markieren</button><button class="review-signout" type="button">Abmelden</button></div><form class="review-form" hidden><p class="review-selection" data-review-selection>Noch kein Bereich ausgewählt.</p><label for="review-message">Was soll geändert werden?</label><textarea id="review-message" name="message" rows="5" minlength="3" maxlength="3000" required></textarea><button type="submit">Hinweis speichern</button></form><p data-review-status aria-live="polite"></p><div class="review-saved"><h3>Gespeicherte Hinweise</h3><div data-review-notes><p class="review-empty">Hinweise werden geladen …</p></div></div>`;
    panel().querySelector('.review-close').addEventListener('click', closePanel);
    panel().querySelector('.review-select').addEventListener('click', () => {
      root.classList.toggle('findory-review-selecting');
      const active = root.classList.contains('findory-review-selecting');
      panel().querySelector('.review-select').textContent = active ? 'Markieren beenden' : 'Bereich markieren';
      status(active ? 'Jetzt einen Bereich auf der Seite anklicken.' : '');
    });
    panel().querySelector('.review-signout').addEventListener('click', () => { clearSession(); root.classList.remove('findory-review-selecting'); renderLogin(); });
    panel().querySelector('.review-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!selectedElement) return status('Bitte zuerst einen Seitenteil auswählen.', true);
      const message = new FormData(event.currentTarget).get('message').trim();
      status('Hinweis wird gespeichert …');
      const rect = selectedElement.getBoundingClientRect();
      try {
        await callAdmin('review_save', {
          pagePath: `${location.pathname}${location.search}`,
          elementLabel: reviewElementLabel(selectedElement),
          message,
          anchor: { selector: selectorFor(selectedElement), x: Math.round(rect.left), y: Math.round(rect.top + window.scrollY), width: Math.round(rect.width), height: Math.round(rect.height) }
        });
        event.currentTarget.reset();
        status('Gespeichert. Der Hinweis steht jetzt in deiner Review-Liste.');
        await loadNotes();
      } catch (error) { status(error.message, true); }
    });
    loadNotes();
  }

  function openPanel() {
    panel().hidden = false;
    root.classList.add('findory-review-open');
    if (readSession()?.accessToken && readSession()?.expiresAt > Date.now()) renderWorkspace(); else renderLogin();
  }

  function closePanel() {
    panel().hidden = true;
    root.classList.remove('findory-review-open', 'findory-review-selecting');
    selectedElement?.classList.remove('findory-review-selected');
  }

  function selectElement(element) {
    selectedElement?.classList.remove('findory-review-selected');
    selectedElement = element;
    selectedElement.classList.add('findory-review-selected');
    panel().querySelector('.review-selection').textContent = `Ausgewählt: ${reviewElementLabel(element)}`;
    panel().querySelector('.review-form').hidden = false;
    panel().querySelector('#review-message').focus();
    root.classList.remove('findory-review-selecting');
    panel().querySelector('.review-select').textContent = 'Bereich markieren';
    status('');
  }

  function init() {
    consumeMagicLink();
    markTargets();
    keepReviewModeInInternalLinks();
    document.body.insertAdjacentHTML('beforeend', `<button id="findory-review-toggle" class="review-toggle" type="button" aria-expanded="false">✎ Review</button><aside id="findory-review-panel" class="review-panel" aria-label="Findory Review-Modus" hidden></aside>`);
    document.querySelector('#findory-review-toggle').addEventListener('click', () => {
      const open = panel().hidden;
      if (open) openPanel(); else closePanel();
      document.querySelector('#findory-review-toggle').setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!root.classList.contains('findory-review-selecting')) return;
      const element = event.target.closest('[data-review-label]');
      if (!element || element.closest('.review-panel')) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(element);
    }, true);
  }

  init();
})();
