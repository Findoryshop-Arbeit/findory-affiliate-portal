(async () => {
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
  const legacyProducts = (window.FINDORY_PRODUCTS || []).filter((product) => product.guideId === guide.id);
  let products = legacyProducts;
  if (guide.id === 'zugluft-stoppen-vergleichen') {
    try {
      const response = await fetch('../data/products.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`products.json konnte nicht geladen werden (${response.status})`);
      const sourceProducts = await response.json();
      const migratedProducts = sourceProducts
        .filter((product) => product.category === 'zugluft-stoppen' && product.subcategory === 'zugluftstopper' && product.status === 'active')
        .sort((left, right) => left.order - right.order)
        .map((product) => ({ ...product, guideId: guide.id, category: product.subcategory, title: product.productName }));
      products = [
        ...legacyProducts.filter((product) => product.category !== 'zugluftstopper'),
        ...migratedProducts
      ];
    } catch (error) {
      console.warn('[Findory] products.json nicht verfügbar; statische Fallback-Daten bleiben aktiv.', error);
    }
  }
  const isThermostatGuide = guide.id === 'heizkoerperthermostate-vergleichen';
  const categories = isThermostatGuide ? [
    { id: 'manual', label: 'Manuell', empty: 'Für diese Kategorie sind die fünf geprüften mechanischen Thermostatköpfe unten aufgeführt.' },
    { id: 'programmable', label: 'Programmierbar', empty: 'Für programmierbare Thermostate liegen derzeit noch keine einzeln geprüften Produkte vor.' },
    { id: 'smart', label: 'Smart', empty: 'Für smarte Thermostate liegen derzeit noch keine einzeln geprüften Produkte vor.' }
  ] : (guide.productCategories || []);
  const productImage = (product) => product.imageSrc ? `<figure class="product-image"><img src="${escapeHtml(product.imageSrc)}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy"></figure>` : '';
  const productCard = (product) => { const isDoorProduct = guide.id === 'zugluft-stoppen-vergleichen' && product.category === 'tuerbodendichtungen'; const showProductImage = isThermostatGuide || isDoorProduct; const advantages = product.advantages || product.pros || []; const disadvantages = product.disadvantages || product.cons || []; return `<article${isThermostatGuide ? ` data-asin="${escapeHtml(product.asin)}"` : ''}><h3>${escapeHtml(product.productName || product.title)}</h3>${showProductImage ? productImage(product) : ''}${isThermostatGuide && product.meta ? `<p class="product-meta">${escapeHtml(product.meta)}</p>` : ''}<section><h4>Beschreibung</h4><p>${escapeHtml(product.description)}</p></section>${isThermostatGuide && product.properties?.length ? `<section><h4>Eigenschaften</h4>${list(product.properties)}</section>` : ''}<section><h4>Vorteile</h4>${list(advantages)}</section><section><h4>Nachteile</h4>${list(disadvantages)}</section>${product.suitableFor ? `<section><h4>Geeignet für</h4><p>${escapeHtml(product.suitableFor)}</p></section>` : ''}${product.assessment ? `<section><h4>Unsere Einschätzung</h4><p>${escapeHtml(product.assessment)}</p></section>` : ''}<div class="affiliate-action" style="margin-top:20px;display:flex;align-items:center;justify-content:center;background:var(--green);border-radius:22px"><a class="amazon-link" style="margin-top:0;flex:1;background:transparent" href="${escapeHtml(product.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">Hier mehr erfahren</a><a class="affiliate-marker" style="color:#fff;font-size:.72rem;font-weight:800;padding:10px 13px 10px 0" href="../affiliate-hinweis.html#affiliate-links" aria-label="Affiliate-Hinweis">*</a></div></article>`; };
  const productSection = products.length ? `<section class="product-area" aria-labelledby="product-heading"><div class="product-head"><p>Geprüfte Produkte</p><h2 id="product-heading">${escapeHtml(guide.productSectionTitle || 'Konkrete Thermostatköpfe im Überblick')}</h2></div>${categories.map((category) => { const categoryProducts = products.filter((product) => product.category === category.id).sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER)); return `<section class="product-category" id="category-${category.id}" aria-labelledby="category-${category.id}-heading"><h3 id="category-${category.id}-heading"><span class="category-pill">${escapeHtml(category.label)}</span></h3>${categoryProducts.length ? `<div class="product-grid">${categoryProducts.map(productCard).join('')}</div>` : `<p class="product-empty">${escapeHtml(category.empty)}</p>`}</section>`; }).join('')}${isThermostatGuide ? `<section class="product-category product-conclusion" id="product-fazit" aria-labelledby="product-fazit-heading"><h3 id="product-fazit-heading"><span class="category-pill">Fazit</span></h3><div class="product-empty"><p><strong>Kurz gesagt:</strong> Für einen einzelnen Raum mit gleichbleibender Nutzung reicht ein manuelles Thermostat meist aus. Wer feste Heizzeiten automatisch steuern möchte, findet bei den programmierbaren Modellen den pragmatischen Mittelweg ohne App und Smart-Home-Zentrale.</p><p>Smart lohnt sich vor allem bei mehreren Räumen, Fernsteuerung oder einem bereits vorhandenen System. Dafür müssen Hub, Zentrale, Funkstandard und Ventil-Kompatibilität vor dem Kauf zusammenpassen.</p><p><strong>Die einfache Entscheidung:</strong> möglichst wenig Technik = manuell; Zeitpläne ohne Smart Home = programmierbar; zentrale Steuerung und mehr Komfort = smart. Prüfe unabhängig vom Typ immer den Ventilanschluss und die aktuell nötige Zusatzhardware.</p></div></section>` : guide.productConclusion ? `<section class="product-category product-conclusion" id="product-fazit" aria-labelledby="product-fazit-heading"><h3 id="product-fazit-heading"><span class="category-pill">Fazit</span></h3><div class="product-empty"><p>${escapeHtml(guide.productConclusion)}</p></div></section>` : ''}</section>` : '';
  const comparisonVisuals = guide.id === 'heizkoerperthermostate-vergleichen' ? {
    'Manuelles Thermostat': { src: 'assets/ventil.jpeg', alt: 'Manueller Heizkörperthermostatkopf an einem Heizkörperventil' },
    'Programmierbares Thermostat': { src: 'assets/thermostat-programmierbar.jpeg', alt: 'Programmierbarer Heizkörperthermostatkopf mit Display an einem Heizkörper' },
    'Smartes Thermostat': { src: 'assets/thermostat-smart.jpeg', alt: 'Smarter Heizkörperthermostatkopf mit digitaler Temperaturanzeige' }
  } : guide.id === 'zugluft-stoppen-vergleichen' ? {
    'Fensterdichtungen': { src: 'assets/dichtband.jpeg', alt: 'Selbstklebendes Dichtungsband zum Abdichten von Fenstern' },
    'Türbodendichtung': { src: 'assets/tuerbodendichtung.jpeg', alt: 'Türbodendichtung an einer Tür gegen Zugluft' },
    'Zugluftstopper': { src: 'assets/zugluftstopper.jpeg', alt: 'Textiler Zugluftstopper vor einer Tür' }
  } : {};
  const comparisonVisual = (item) => {
    const visual = comparisonVisuals[item.name];
    if (!visual) return '';
    return visual.src ? `<figure class="comparison-image"><img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt)}"></figure>` : `<div class="comparison-image comparison-image-placeholder" role="img" aria-label="${escapeHtml(visual.placeholder)}"><span>Bild folgt</span></div>`;
  };
  const comparisonCard = (item) => `<article><h3>${escapeHtml(item.name)}</h3>${comparisonVisual(item)}<dl><div><dt>Passt gut</dt><dd>${escapeHtml(item.best)}</dd></div><div><dt>Stärke</dt><dd>${escapeHtml(item.strength)}</dd></div><div><dt>Beachten</dt><dd>${escapeHtml(item.notice)}</dd></div></dl></article>`;

  target.innerHTML = `<section class="guide-hero"><p class="eyebrow">${guide.readTime}</p><h1>${guide.title}</h1><p>${guide.intro}</p></section><section class="comparison"><h2>${comparison.question}</h2><p class="comparison-summary">${comparison.summary}</p><div class="comparison-grid">${comparison.items.map(comparisonCard).join('')}</div><p class="comparison-conclusion">${comparison.conclusion}</p></section>${productSection}`;
})();
