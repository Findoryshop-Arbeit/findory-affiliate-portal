(() => {
  const id = new URLSearchParams(location.search).get('guide');
  const guide = (window.FINDORY_GUIDES || []).find((entry) => entry.id === id);
  const target = document.querySelector('#guide-article');
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

  if (!guide) {
    target.innerHTML = '<section class="guide-hero"><h1>Ratgeber nicht gefunden</h1><p>Bitte wähle einen Vergleich aus der Ratgeberübersicht.</p></section>';
    return;
  }

  document.title = `Findory – ${guide.title}`;
  const comparison = guide.comparison;
  const products = (window.FINDORY_PRODUCTS || []).filter((product) => product.guideId === guide.id);
  const productSection = products.length ? `<section class="product-area" aria-labelledby="product-heading"><div class="product-head"><p>Geprüfte Produkte</p><h2 id="product-heading">Konkrete Thermostatköpfe im Überblick</h2><span>Technische Angaben stammen von den jeweils geprüften Amazon.de-Produktseiten. Preise und Bewertungen werden bewusst nicht statisch dargestellt.</span></div><p class="affiliate-disclosure">Werbelinks: Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Für dich ändert sich der Preis nicht.</p><div class="product-grid">${products.map((product) => `<article data-asin="${escapeHtml(product.asin)}"><p class="product-asin">ASIN ${escapeHtml(product.asin)}</p><h3>${escapeHtml(product.title)}</h3><p class="product-meta">${escapeHtml(product.meta)}</p><section><h4>Beschreibung</h4><p>${escapeHtml(product.description)}</p></section><section><h4>Eigenschaften</h4>${list(product.properties)}</section><section><h4>Vorteile</h4>${list(product.pros)}</section><section><h4>Nachteile</h4>${list(product.cons)}</section><a class="amazon-link" href="${escapeHtml(product.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">Bei Amazon.de ansehen <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>` : '';

  target.innerHTML = `<section class="guide-hero"><p class="eyebrow">${guide.readTime}</p><h1>${guide.title}</h1><p>${guide.intro}</p></section><section class="comparison"><h2>${comparison.question}</h2><p class="comparison-summary">${comparison.summary}</p><div class="comparison-grid">${comparison.items.map((item) => `<article><h3>${item.name}</h3><dl><div><dt>Passt gut</dt><dd>${item.best}</dd></div><div><dt>Stärke</dt><dd>${item.strength}</dd></div><div><dt>Beachten</dt><dd>${item.notice}</dd></div></dl></article>`).join('')}</div><p class="comparison-conclusion">${comparison.conclusion}</p></section>${productSection}`;
})();
