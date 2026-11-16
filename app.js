const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 721px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const tabs = [...document.querySelectorAll('.tool-tab')];
const panels = [...document.querySelectorAll('.tool-panel')];
const horizontalTabs = matchMedia('(max-width: 720px)');
const tabList = document.querySelector('.tool-tabs');

function updateTabOrientation() {
  tabList.setAttribute('aria-orientation', horizontalTabs.matches ? 'horizontal' : 'vertical');
}
updateTabOrientation();
horizontalTabs.addEventListener('change', updateTabOrientation);

function selectTool(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  if (focus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTool(tab));
  tab.addEventListener('keydown', event => {
    const nextKey = horizontalTabs.matches ? 'ArrowRight' : 'ArrowDown';
    const previousKey = horizontalTabs.matches ? 'ArrowLeft' : 'ArrowUp';
    let target = null;
    if (event.key === nextKey) target = (index + 1) % tabs.length;
    if (event.key === previousKey) target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;
    if (target !== null) {
      event.preventDefault();
      selectTool(tabs[target], true);
    }
  });
});

const productInfo = {
  deep: {
    name: 'Poppy Deep',
    image: 'assets/icons/deep.svg',
    background: '#eaf2f2',
    description: 'Backup and security, thoughtfully connected. Deep is being designed to make looking after your digital life feel a little less complicated.',
    features: ['A focused home for your Mac’s backup.', 'A clear view of protection and security.', 'A calmer way to look after important files.']
  },
  velvet: {
    name: 'Poppy Velvet',
    image: 'assets/icons/velvet.svg',
    background: '#ece6f4',
    description: 'A Mac-native home for your Linux workflows. Velvet brings our focus on performance and a considered developer experience to virtual machines and containers.',
    features: ['Linux virtual machines, with a native Mac feel.', 'A home for container and project workflows.', 'A focus on reducing the friction between environments.']
  }
};

const dialog = document.querySelector('#product-dialog');
let dialogTrigger = null;

document.querySelectorAll('[data-open-product]').forEach(button => {
  button.addEventListener('click', () => {
    const product = productInfo[button.dataset.openProduct];
    if (!product) return;
    dialogTrigger = button;
    dialog.querySelector('#dialog-title').textContent = product.name;
    dialog.querySelector('#dialog-description').textContent = product.description;
    const image = dialog.querySelector('#dialog-image');
    image.src = product.image;
    dialog.querySelector('.dialog-art').style.background = product.background;
    const list = dialog.querySelector('#dialog-features');
    list.replaceChildren(...product.features.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    closeMenu();
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
  });
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('.dialog-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => { dialogTrigger?.focus(); });
