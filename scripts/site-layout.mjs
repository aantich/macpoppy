import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const magicBoxPage = 'magicbox/index.html';
const headerSlot = '<!-- Shared site header -->';
const footerSlot = '<!-- Shared site footer -->';

function rebaseHomepageLinks(markup) {
  // Rebase links and images from the homepage. The inline SVG symbols stay page-local.
  return markup.replace(
    /(<(?:a|img)\b[^>]*?\s(?:href|src)=")([^"/][^"]*)"/g,
    (attribute, prefix, reference) => /^[a-z][a-z\d+.-]*:/i.test(reference) ? attribute : `${prefix}/${reference}"`
  ).replaceAll('<a href="/magicbox/">', '<a href="/magicbox/" aria-current="page">');
}

export async function renderMagicBoxPage(root) {
  const [page, homepage] = await Promise.all([
    readFile(path.join(root, magicBoxPage), 'utf8'),
    readFile(path.join(root, 'index.html'), 'utf8')
  ]);
  const header = homepage.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
  const footer = homepage.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];
  if (!header || !footer || !page.includes(headerSlot) || !page.includes(footerSlot)) {
    throw new Error('Missing shared site header or footer markup');
  }

  const productFooter = rebaseHomepageLinks(footer).replaceAll('href="/#top"', 'href="#top"');
  return page.replace(headerSlot, () => rebaseHomepageLinks(header)).replace(footerSlot, () => productFooter);
}
