(() => {
  const topics = window.FINDORY_TOPICS || [];
  const target = document.querySelector('#topic-groups');
  const result = document.querySelector('#search-result');
  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-').replace(/^-|-$/g, '');
  const card = (topic, item) => `<a class="topic-card" href="category.html?thema=${encodeURIComponent(topic.id)}&unterthema=${encodeURIComponent(slug(item[0]))}"><img src="${item[2]}" alt="" loading="lazy"><span class="copy"><h3>${item[0]}</h3><p>${item[1]}</p><span>Thema öffnen</span></span></a>`;
  const group = (topic) => `<section class="topic-group ${topic.tone}" data-topic="${topic.id}"><div class="group-heading"><span class="group-icon" aria-hidden="true">${topic.icon}</span><div><h2>${topic.title}</h2><p>${topic.intro}</p></div><a class="group-link" href="category.html?thema=${encodeURIComponent(topic.id)}">Alle Themen ansehen →</a></div><div class="cards">${topic.items.map((item) => card(topic, item)).join('')}</div><p class="side-note">${topic.note}</p></section>`;
  if (target) target.innerHTML = topics.map(group).join('');
  const showSearch = (raw) => { const query = raw.trim().toLocaleLowerCase('de'); if (!query) { result.textContent = ''; document.querySelectorAll('.topic-card').forEach((el) => el.hidden = false); return; } let hits = 0; document.querySelectorAll('.topic-card').forEach((el) => { const match = el.textContent.toLocaleLowerCase('de').includes(query); el.hidden = !match; if (match) hits += 1; }); result.textContent = hits ? `${hits} passende${hits === 1 ? ' Lösung' : ' Lösungen'} für „${raw}“` : `Noch keine passende Lösung für „${raw}“.`; document.querySelector('#themen')?.scrollIntoView({behavior:'smooth',block:'start'}); };
  document.querySelector('#hero-search')?.addEventListener('submit', (event) => { event.preventDefault(); showSearch(document.querySelector('#hero-query').value); });
  document.querySelector('.header-search')?.addEventListener('submit', (event) => { event.preventDefault(); showSearch(document.querySelector('#header-search').value); });
})();
