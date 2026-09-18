(async () => {
  const id = new URLSearchParams(location.search).get('guide');
  const guide = [...(window.FINDORY_GUIDES || [])].reverse().find((entry) => entry.id === id);
  const target = document.querySelector('#guide-article');
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

  if (!guide) {
    target.innerHTML = '<section class="guide-hero"><h1>Ratgeber nicht gefunden</h1><p>Bitte wähle einen Vergleich aus der Ratgeberübersicht.</p></section>';
    return;
  }

  document.title = `Findory – ${guide.title}`;
  if (guide.id === 'zugluft-stoppen-vergleichen') {
    guide.productConclusion = 'Die beste Lösung hängt von der undichten Stelle, der Spaltgröße und der gewünschten Montage ab. Für eine dauerhaft befestigte und eher unauffällige Lösung ist die Vellure Türdichtung naheliegend; die shinfly Silikon-Dichtung passt besser, wenn eine dünne und flexible Bauform wichtig ist. Wer nicht kleben oder bohren möchte, findet mit BKSAI eine reversible Lösung, die besonders für Mietwohnungen interessant ist. Die com-four-Doppeldichtung ist praktisch, wenn beide Seiten der Tür abgedichtet oder gleich zwei Türen ausgestattet werden sollen, kann aber sichtbarer sein und passt nicht zu jeder Tür-Boden-Kombination. Der Praknu-Zugluftstopper ist die klassische Wahl für eine schwere, waschbare Stoffrolle ohne feste Montage, benötigt aber mehr Platz und muss passend positioniert werden. Entscheidend ist: erst den Eintritt der kalten Luft prüfen, dann den Spalt messen und die Tür nach der Montage auf leichtes Schließen testen. Bei sehr großen Spalten, beschädigten Rahmen oder Zugluft aus Rollladenkästen reicht ein Zugluftstopper allein möglicherweise nicht.';
  }
  const fallbackComparisons = {
    'heizkoerper-effizienter-nutzen-vergleichen': {
      question: 'Welche Lösung passt zum Heizkörper?',
      summary: 'Reflexionsfolie und Heizkörperventilator setzen an unterschiedlichen Stellen an. Entscheidend ist zuerst die konkrete Ursache.',
      items: [
        { name: 'Heizkörper-Reflexionsfolie', best: 'Wenn die Wand hinter dem Heizkörper auffällig kalt ist.', strength: 'Kann die Wärmeabgabe zur Raumseite unterstützen.', notice: 'Nur sinnvoll, wenn Montage, Wandabstand und Untergrund passen.' },
        { name: 'Heizkörperventilator', best: 'Wenn sich warme Luft im Raum langsam verteilt.', strength: 'Unterstützt die Luftzirkulation direkt am Heizkörper.', notice: 'Strombedarf, Geräusch und Kompatibilität vorher prüfen.' },
        { name: 'Erst prüfen und pflegen', best: 'Wenn der Heizkörper gluckert, staubig ist oder teilweise kalt bleibt.', strength: 'Eine Ursachenprüfung kostet zunächst kein zusätzliches Produkt.', notice: 'Bei technischen Problemen oder fehlender Heizleistung fachlich prüfen lassen.' }
      ],
      conclusion: 'Erst die Wärmequelle und ihre Umgebung prüfen, dann gezielt vergleichen: kalte Wand eher Reflexionsfolie, langsame Luftverteilung eher Heizkörperventilator.'
    },
    'warmwasser-sparen-vergleichen': {
      question: 'Welche Warmwasser-Lösung passt zu deiner Nutzung?',
      summary: 'Duschköpfe sind für die Dusche gedacht, Strahlregler für Wasserhähne. Anschluss, Durchfluss und Wasserdruck entscheiden mehr als ein pauschales Sparversprechen.',
      items: [
        { name: 'Wasserspar-Duschkopf', best: 'Wenn beim Duschen viel warmes Wasser verbraucht wird.', strength: 'Verbindet einen begrenzten Durchfluss mit verschiedenen Strahlbildern.', notice: 'Gewinde, Durchfluss und vorhandenen Wasserdruck prüfen.' },
        { name: 'Wasserspar-Perlator', best: 'Wenn der Verbrauch am Waschbecken oder an der Spüle auffällt.', strength: 'Kann den Wasserstrahl am Wasserhahn gezielt verändern.', notice: 'M24/M22-Gewinde und Armatur müssen zusammenpassen.' },
        { name: 'Nutzungsverhalten prüfen', best: 'Wenn Duschdauer oder sehr hoher Durchfluss die Hauptursache sind.', strength: 'Setzt ohne Umbau an der täglichen Nutzung an.', notice: 'Zu starke Begrenzung kann Komfort und Funktion beeinträchtigen.' }
      ],
      conclusion: 'Für die Dusche ist ein passender Duschkopf die naheliegende Lösung, am Waschbecken ein passender Perlator. Vor dem Kauf Anschluss und Wasserdruck prüfen und den tatsächlichen Durchfluss nachvollziehbar vergleichen.'
    },
    'luftfeuchte-messen-vergleichen': {
      question: 'Wie lässt sich Luftfeuchte sinnvoll beobachten?',
      summary: 'Ein einzelner Wert ist nur eine Momentaufnahme. Entscheidend sind Messort, Raumtemperatur und der Verlauf über mehrere Tage.',
      items: [
        { name: 'Einfaches Hygrometer', best: 'Für einen schnellen Überblick in einem Raum.', strength: 'Direkt ablesbar und ohne Einrichtung nutzbar.', notice: 'Keine Verlaufskurve und meist keine Fernwarnung.' },
        { name: 'Mehrfachpack', best: 'Wenn mehrere Räume verglichen werden sollen.', strength: 'Macht Unterschiede zwischen Zimmern sichtbar.', notice: 'Geräte möglichst ähnlich platzieren und regelmäßig prüfen.' },
        { name: 'Smarter Feuchtigkeitssensor', best: 'Wenn Verlauf, Benachrichtigung oder mehrere Messorte wichtig sind.', strength: 'Kann Werte über längere Zeit dokumentieren.', notice: 'App, Batterie, Hub und Datenschutz vorher prüfen.' }
      ],
      conclusion: 'Für die meisten Haushalte ist ein gut platziertes Thermo-Hygrometer der vernünftige Einstieg. Smarte Sensoren bieten mehr Komfort, sind aber nicht automatisch genauer oder notwendig.'
    },
    'richtig-lueften-vergleichen': {
      question: 'Woran erkenne ich, dass Lüften sinnvoll ist?',
      summary: 'CO₂ zeigt vor allem die Belastung durch Personen; Luftfeuchte und Temperatur müssen separat betrachtet werden.',
      items: [
        { name: 'CO₂-Messgerät', best: 'Für Räume mit wechselnder Personenbelegung.', strength: 'Gibt einen zusätzlichen Hinweis auf verbrauchte Raumluft.', notice: 'Verbessert die Luft nicht selbst und ersetzt kein Hygrometer.' },
        { name: 'Raumluft-Monitor', best: 'Wenn CO₂, Temperatur und Feuchte zusammen beobachtet werden sollen.', strength: 'Mehrere Werte helfen beim Einordnen.', notice: 'Messort und Alarmgrenzen sinnvoll wählen.' },
        { name: 'Smarte Luftqualitätssensoren', best: 'Wenn Verlauf und Benachrichtigungen gewünscht sind.', strength: 'Kann Lüftungsroutinen über Zeit sichtbar machen.', notice: 'App, Hub und laufende Strom- oder Batteriekosten beachten.' }
      ],
      conclusion: 'Ein CO₂-Messgerät ist eine Entscheidungshilfe und kein Lüftungsautomat. Lüfte abhängig von Raum, Nutzung, Jahreszeit und Feuchte; starre Zeitversprechen passen nicht zu jeder Wohnung.'
    },
    'bad-schlafzimmer-vergleichen': {
      question: 'Wann reicht Granulat und wann braucht es ein Gerät?',
      summary: 'Passive Entfeuchter sind leise und einfach, elektrische Geräte leisten deutlich mehr und benötigen dafür Strom, Platz und Pflege.',
      items: [
        { name: 'Passiver Luftentfeuchter', best: 'Für Schränke, kleine Bereiche und leichte Feuchte.', strength: 'Ohne Strom und nahezu geräuschlos.', notice: 'Bei hoher Raumfeuchte schnell überfordert.' },
        { name: 'Kompakter elektrischer Entfeuchter', best: 'Für wiederkehrende Feuchte in Bad, Schlafzimmer oder Wohnraum.', strength: 'Kann die Raumfeuchte aktiver beeinflussen.', notice: 'Tank, Geräusch, Stromverbrauch und Raumgröße prüfen.' },
        { name: 'Erst messen', best: 'Wenn die Feuchtebelastung noch unklar ist.', strength: 'Verhindert einen unnötigen Fehlkauf.', notice: 'Bei feuchten Wänden reicht ein Messgerät allein nicht.' }
      ],
      conclusion: 'Beginne mit Messen und Lüften. Granulat passt zu leichter Feuchte und kleinen Bereichen; ein elektrisches Gerät ist bei wiederkehrend hoher Raumfeuchte die leistungsfähigere, aber aufwendigere Lösung.'
    },
    'kondenswasser-reduzieren-vergleichen': {
      question: 'Was hilft bei beschlagenen Fenstern?',
      summary: 'Ein Abzieher oder Fenstersauger entfernt Wasser sofort. Die Ursache liegt aber meist im Zusammenspiel aus Luftfeuchte, Temperatur und Oberfläche.',
      items: [
        { name: 'Fenstersauger', best: 'Wenn regelmäßig Wasser auf größeren glatten Flächen steht.', strength: 'Nimmt Kondenswasser schnell und sauber auf.', notice: 'Verhindert keine neue Kondensation.' },
        { name: 'Kondenswasserabzieher', best: 'Für einzelne Fensterbereiche und eine einfache Sofortmaßnahme.', strength: 'Günstig, schnell und ohne Akku nutzbar.', notice: 'Wasser anschließend aufnehmen und Rahmen trocknen.' },
        { name: 'Luftfeuchte messen', best: 'Wenn die Ursache des Beschlagens unklar ist.', strength: 'Hilft, Lüften und Raumklima einzuordnen.', notice: 'Bei baulichen Ursachen reicht Messen allein nicht.' }
      ],
      conclusion: 'Für das sichtbare Wasser ist ein Fenstersauger praktisch. Dauerhaft besser wird die Situation erst, wenn Luftfeuchte, Lüftung, Raumtemperatur und mögliche kalte oder undichte Bauteile zusammen geprüft werden.'
    }
  };
  const comparison = guide.comparison || fallbackComparisons[guide.id];
  if (!comparison) {
    target.innerHTML = '<section class="guide-hero"><h1>Vergleich wird vorbereitet</h1><p>Für diesen Ratgeber liegt noch kein Vergleichsblock vor.</p></section>';
    return;
  }
  const legacyProducts = (window.FINDORY_PRODUCTS || []).filter((product) => product.guideId === guide.id);
  const productDataCategories = {
    'heizkoerper-effizienter-nutzen-vergleichen': 'heizkoerper-effizienter-nutzen-vergleichen',
    'warmwasser-sparen-vergleichen': 'warmwasser-sparen-vergleichen',
    'zugluft-stoppen-vergleichen': 'zugluft-stoppen'
  };
  let products = legacyProducts;
  if (guide.dataProductCategory || productDataCategories[guide.id]) {
    try {
      const response = await fetch('../data/products.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`products.json konnte nicht geladen werden (${response.status})`);
      const sourceProducts = await response.json();
      const dataCategory = guide.dataProductCategory || productDataCategories[guide.id];
      const dataSubcategory = guide.dataProductSubcategory || (guide.id === 'zugluft-stoppen-vergleichen' ? 'zugluftstopper' : null);
      const migratedProducts = sourceProducts
        .filter((product) => product.category === dataCategory && (!dataSubcategory || product.subcategory === dataSubcategory) && product.status === 'active')
        .sort((left, right) => (left.subcategory || '').localeCompare(right.subcategory || '') || left.order - right.order)
        .map((product) => ({ ...product, guideId: guide.id, category: product.subcategory, title: product.productName, affiliateUrl: product.affiliateUrl || product.amazonUrl }));
      products = [
        ...legacyProducts.filter((product) => guide.id !== 'zugluft-stoppen-vergleichen' || product.category !== 'zugluftstopper'),
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
  const productCard = (product) => { const isDoorProduct = guide.id === 'zugluft-stoppen-vergleichen' && product.category === 'tuerbodendichtungen'; const showProductImage = isThermostatGuide || isDoorProduct; const advantages = product.advantages || product.pros || []; const disadvantages = product.disadvantages || product.cons || []; return `<article${isThermostatGuide ? ` data-asin="${escapeHtml(product.asin)}"` : ''}><h3>${escapeHtml(product.productName || product.title)}</h3>${showProductImage ? productImage(product) : ''}${isThermostatGuide && product.meta ? `<p class="product-meta">${escapeHtml(product.meta)}</p>` : ''}<section><h4>Beschreibung</h4><p>${escapeHtml(product.description)}</p></section>${isThermostatGuide && product.properties?.length ? `<section><h4>Eigenschaften</h4>${list(product.properties)}</section>` : ''}<section><h4>Vorteile</h4>${list(advantages)}</section><section><h4>Nachteile</h4>${list(disadvantages)}</section>${product.suitableFor ? `<section><h4>Geeignet für</h4><p>${escapeHtml(product.suitableFor)}</p></section>` : ''}${product.assessment ? `<section><h4>Unsere Einschätzung</h4><p>${escapeHtml(product.assessment)}</p></section>` : ''}<div class="affiliate-action" style="margin-top:20px;display:flex;align-items:center;justify-content:center;background:var(--green);border-radius:22px"><a class="amazon-link" style="margin-top:0;flex:1;background:transparent" href="${escapeHtml(product.affiliateUrl || product.amazonUrl || '#')}" rel="sponsored nofollow noopener" target="_blank">${escapeHtml(guide.productButtonLabel || 'Hier mehr erfahren')}</a><a class="affiliate-marker" style="color:#fff;font-size:.72rem;font-weight:800;padding:10px 13px 10px 0" href="../affiliate-hinweis.html#affiliate-links" aria-label="Affiliate-Hinweis">*</a></div></article>`; };
  const relatedLinks = guide.relatedLinks?.length ? `<nav class="advisor-links" aria-label="Verwandte Ratgeber"><p><strong>Passt thematisch dazu:</strong></p><ul>${guide.relatedLinks.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)} →</a></li>`).join('')}</ul></nav>` : '';
  const advisorSection = guide.advisorSections?.length ? `<section class="advisor-area comparison" aria-labelledby="advisor-heading"><h2 id="advisor-heading">Ratgeber: ${escapeHtml(guide.title)}</h2>${guide.advisorSections.map((section) => `<section class="advisor-block"><h3>${escapeHtml(section.title)}</h3>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.bullets?.length ? list(section.bullets) : ''}</section>`).join('')}${relatedLinks}</section>` : relatedLinks;
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

  target.innerHTML = `<section class="guide-hero"><p class="eyebrow">${guide.readTime}</p><h1>${guide.title}</h1><p>${guide.intro}</p></section><section class="comparison"><h2>${comparison.question}</h2><p class="comparison-summary">${comparison.summary}</p><div class="comparison-grid">${comparison.items.map(comparisonCard).join('')}</div><p class="comparison-conclusion">${comparison.conclusion}</p></section>${advisorSection}${productSection}`;
})();
