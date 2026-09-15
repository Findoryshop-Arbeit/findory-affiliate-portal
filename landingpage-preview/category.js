(() => {
  const params = new URLSearchParams(location.search);
  const topics = window.FINDORY_TOPICS || [];
  const topic = topics.find((entry) => entry.id === params.get('thema'));
  const headline = document.querySelector('#category-view'); const list = document.querySelector('#subtopic-list'); const productArea = document.querySelector('#product-area');
  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-').replace(/^-|-$/g, '');
  if (!topic) { headline.innerHTML = '<h1>Themenwelt nicht gefunden</h1><p>Bitte wähle eine Themenwelt auf der Startseite.</p>'; return; }
  const selectedSlug = params.get('unterthema'); const selected = topic.items.find((item) => slug(item[0]) === selectedSlug);
  document.title = `Findory – ${selected ? selected[0] : topic.title}`;
  headline.innerHTML = `<p class="eyebrow">${topic.title}</p><h1>${selected ? selected[0] : topic.title}</h1><p>${selected ? selected[1] + ' Hier sammeln wir später geprüfte Lösungswege und passende Produktempfehlungen.' : topic.intro + ' Wähle ein Unterthema für den nächsten Schritt.'}</p>`;
  if (selected) productArea.innerHTML = `<div class="product-head"><p>Passende Lösungen</p><h2>Produktempfehlungen folgen nach Recherche</h2><span>Hier erscheinen später ausgewählte Produkte mit Preisstand, Einordnung und deinem Affiliate-Link.</span></div><div class="product-grid"><article><div class="product-image">Bild folgt</div><h3>Produktplatz 1</h3><p>Geeignete Lösung wird recherchiert und geprüft.</p></article><article><div class="product-image">Bild folgt</div><h3>Produktplatz 2</h3><p>Geeignete Alternative wird ergänzt.</p></article><article><div class="product-image">Bild folgt</div><h3>Produktplatz 3</h3><p>Weitere passende Option wird ergänzt.</p></article></div>`;
  list.innerHTML = topic.items.map((item) => `<a class="detail-link${selected && item[0] === selected[0] ? ' selected' : ''}" href="category.html?thema=${encodeURIComponent(topic.id)}&unterthema=${encodeURIComponent(slug(item[0]))}"><h2>${item[0]}</h2><p>${item[1]}</p><span>${selected ? 'Dieses Thema öffnen →' : 'Zur Detailseite →'}</span></a>`).join('');
})();
