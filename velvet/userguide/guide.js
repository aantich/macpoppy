const menu = document.querySelector('.section-menu');
const summary = menu.querySelector('summary');
const compact = window.matchMedia('(max-width: 860px)');
const links = [...menu.querySelectorAll('nav a')];
const sections = links.map(link => document.getElementById(link.hash.slice(1)));
const header = document.querySelector('.guide-header');

function fitMenu() {
  menu.open = !compact.matches;
}

fitMenu();
compact.addEventListener('change', fitMenu);
for (const link of links) {
  link.addEventListener('click', () => {
    if (compact.matches) menu.open = false;
  });
}

let frameRequested = false;
let currentSection = 0;
function markSection() {
  frameRequested = false;
  const navigation = compact.matches ? summary : header;
  const readingLine = navigation.getBoundingClientRect().bottom + 36;
  let active = 0;
  for (const [index, section] of sections.entries()) {
    if (section.getBoundingClientRect().top <= readingLine) active = index;
  }
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = links.length - 1;
  if (active === currentSection) return;
  links[currentSection].removeAttribute('aria-current');
  links[active].setAttribute('aria-current', 'location');
  currentSection = active;
}

function scheduleSectionCheck() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(markSection);
}

markSection();
for (const event of ['scroll', 'resize', 'hashchange', 'load']) {
  window.addEventListener(event, scheduleSectionCheck, { passive: true });
}
