// Simple client-side router for panels
const content = document.getElementById('content');
const panels = [...content.querySelectorAll('.panel')];
const links = [...document.querySelectorAll('[data-route]')];

function show(route) {
  panels.forEach(p => p.classList.add('hidden'));
  const target = content.querySelector(`[data-panel="${route}"]`);
  if (target) target.classList.remove('hidden');
  // Active nav state
  links.forEach(a => a.classList.toggle('active', a.dataset.route === route));
  // Close sidebar on mobile
  sidebar.classList.remove('open');
}

// Default route
show('overview');

// Link handling
links.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  show(a.dataset.route);
  history.replaceState({}, '', `#${a.dataset.route}`);
}));

// Restore from hash on load
window.addEventListener('load', () => {
  const hash = location.hash.replace('#', '');
  if (hash) show(hash);
});

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
document.getElementById('menuToggle').addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Simple “search” that filters sections by title and link text
const overlay = document.getElementById('searchOverlay');
const openBtn = document.getElementById('openSearch');
const closeBtn = document.getElementById('closeSearch');
const input = document.getElementById('searchInput');
const results = document.getElementById('searchResults');

function indexSections() {
  return panels.map(p => ({
    route: p.dataset.panel,
    title: p.querySelector('h1')?.textContent || p.dataset.panel
  }));
}
const index = indexSections();

openBtn.addEventListener('click', () => {
  overlay.classList.remove('hidden');
  input.value = '';
  results.innerHTML = '';
  input.focus();
});

closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault(); openBtn.click();
  }
  if (e.key === 'Escape') overlay.classList.add('hidden');
});

input.addEventListener('input', () => {
  const q = input.value.toLowerCase().trim();
  const hits = index.filter(it => it.title.toLowerCase().includes(q) || it.route.includes(q));
  results.innerHTML = hits.map(h => `<button class="btn-ghost result" data-route="${h.route}">${h.title}</button>`).join('') || '<p class="muted">No matches</p>';
  results.querySelectorAll('.result').forEach(btn => btn.addEventListener('click', () => {
    show(btn.dataset.route);
    overlay.classList.add('hidden');
  }));
});
