(() => {
  const params = new URLSearchParams(location.search); const topic = (window.FINDORY_TOPICS || []).find((entry) => entry.id === params.get('thema')); const guides = window.FINDORY_GUIDES || [];
  const headline = document.querySelector('#category-view'); const list = document.querySelector('#subtopic-list'); const contentArea = document.querySelector('#content-area');
  if (!topic) { headline.innerHTML = '<h1>Themenwelt nicht gefunden</h1><p>Bitte wähle eine Themenwelt auf der Startseite.</p>'; return; }
  const link = (item, area) => `category.html?thema=${encodeURIComponent(topic.id)}&unterthema=${encodeURIComponent(item.id)}${area ? `&bereich=${encodeURIComponent(area.id)}` : ''}`;
  const guideLink = (item, area) => guides.find((guide) => guide.topicId === topic.id && guide.itemId === item.id && (guide.areaId === area.id || guide.areaIds?.includes(area.id))) || (area.guideId ? guides.find((guide) => guide.id === area.guideId) : null);
  const areaHref = (item, area) => { const guide = guideLink(item, area); return guide ? `ratgeber-beitrag.html?guide=${encodeURIComponent(guide.id)}` : link(item, area); };
  const areaCard = (item, area) => { const guide = guideLink(item, area); return `<a class="detail-link" href="${areaHref(item, area)}"><p class="detail-parent">${item.title}</p><h2>${area.title}</h2><p>${area.intro}</p><span>${guide ? 'Angebote ansehen →' : 'Bereich öffnen →'}</span></a>`; };
  const selected = topic.items.find((item) => item.id === params.get('unterthema')); const selectedArea = selected?.subtopics.find((area) => area.id === params.get('bereich')); const selectedAreaGuide = selected && selectedArea ? guideLink(selected, selectedArea) : null;
  if (selectedAreaGuide) { window.location.replace(`ratgeber-beitrag.html?guide=${encodeURIComponent(selectedAreaGuide.id)}`); return; }
  document.title = `Findory – ${selectedArea?.title || selected?.title || topic.title}`;
  if (!selected) { headline.innerHTML = `<p class="eyebrow">${topic.title}</p><h1>Alle Lösungsbereiche</h1><p>${topic.intro} Wähle ein konkretes Anliegen, damit du gezielt zu passenden Ratgebern und späteren Produktempfehlungen gelangst.</p>`; contentArea.innerHTML = '<div class="section-intro"><h2>Womit möchtest du anfangen?</h2><p>Jeder Bereich führt zu einer eigenen, später erweiterbaren Themenstruktur.</p></div>'; list.innerHTML = topic.items.flatMap((item) => item.subtopics.map((area) => areaCard(item, area))).join(''); return; }
  headline.innerHTML = `<p class="eyebrow">${topic.title}</p><h1>${selectedArea?.title || selected.title}</h1><p>${selectedArea?.intro || selected.intro} Hier entstehen Schritt für Schritt hilfreiche Ratgeber, Vergleiche und erst nach Prüfung konkrete Produktempfehlungen.</p>`;
  contentArea.innerHTML = '';
  list.innerHTML = selected.subtopics.map((area) => areaCard(selected, area)).join('');
})();
