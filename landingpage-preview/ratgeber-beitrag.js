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
  const categories = [
    { id: 'manual', label: 'Manuell', empty: 'Für diese Kategorie sind die fünf geprüften mechanischen Thermostatköpfe unten aufgeführt.' },
    { id: 'programmable', label: 'Programmierbar', empty: 'Für programmierbare Thermostate liegen derzeit noch keine einzeln geprüften Produkte vor.' },
    { id: 'smart', label: 'Smart', empty: 'Für smarte Thermostate liegen derzeit noch keine einzeln geprüften Produkte vor.' }
  ];
  const productImage = (product) => product.imageSrc ? `<figure class="product-image"><img src="${escapeHtml(product.imageSrc)}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy"></figure>` : '';
  const productCard = (product) => `<article data-asin="${escapeHtml(product.asin)}"><h3>${escapeHtml(product.title)}</h3>${productImage(product)}<p class="product-meta">${escapeHtml(product.meta)}</p><section><h4>Beschreibung</h4><p>${escapeHtml(product.description)}</p></section><section><h4>Eigenschaften</h4>${list(product.properties)}</section><section><h4>Vorteile</h4>${list(product.pros)}</section><section><h4>Nachteile</h4>${list(product.cons)}</section><p class="affiliate-label">Werbelink</p><a class="amazon-link" href="${escapeHtml(product.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">Hier mehr erfahren <span aria-hidden="true">↗</span></a></article>`;
  const productSection = products.length ? `<section class="product-area" aria-labelledby="product-heading"><div class="product-head"><p>Geprüfte Produkte</p><h2 id="product-heading">Konkrete Thermostatköpfe im Überblick</h2></div>${categories.map((category) => { const categoryProducts = products.filter((product) => product.category === category.id); return `<section class="product-category" id="category-${category.id}" aria-labelledby="category-${category.id}-heading"><h3 id="category-${category.id}-heading"><span class="category-pill">${category.label}</span></h3>${categoryProducts.length ? `<div class="product-grid">${categoryProducts.map(productCard).join('')}</div>` : `<p class="product-empty">${category.empty}</p>`}</section>`; }).join('')}</section>` : '';

  target.innerHTML = `<section class="guide-hero"><p class="eyebrow">${guide.readTime}</p><h1>${guide.title}</h1><p>${guide.intro}</p></section><section class="comparison"><h2>${comparison.question}</h2><p class="comparison-summary">${comparison.summary}</p><div class="comparison-grid">${comparison.items.map((item) => `<article><h3>${item.name}</h3><dl><div><dt>Passt gut</dt><dd>${item.best}</dd></div><div><dt>Stärke</dt><dd>${item.strength}</dd></div><div><dt>Beachten</dt><dd>${item.notice}</dd></div></dl></article>`).join('')}</div><p class="comparison-conclusion">${comparison.conclusion}</p></section>${productSection}`;
})();
