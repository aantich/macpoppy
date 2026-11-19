import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const domain = (await readFile(path.join(root, 'CNAME'), 'utf8')).trim();
if (domain !== 'macpoppy.com') throw new Error('Unexpected publication domain');

const files = ['index.html', 'styles.css', 'app.js', 'monitor.css', 'monitor.js', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml'];
const assets = ['assets/poppy-mark-transparent.png', 'assets/icons', 'assets/fonts', 'assets/social'];
const pageDirectories = ['velvet/userguide', 'privacypolicy'];
for (const file of [...files, ...assets, ...pageDirectories]) await stat(path.join(root, file));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(path.join(root, file), path.join(output, file));
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const asset of assets) await cp(path.join(root, asset), path.join(output, asset), { recursive: true });
for (const directory of pageDirectories) await cp(path.join(root, directory), path.join(output, directory), { recursive: true });

const site = new URL(`https://${domain}/`);
async function verifyReferences(file, pattern) {
  const source = await readFile(path.join(output, file), 'utf8');
  const page = new URL(file, site);
  for (const [, reference] of source.matchAll(pattern)) {
    const url = new URL(reference, page);
    if (url.origin !== site.origin) continue;
    const target = path.join(output, decodeURIComponent(url.pathname));
    if ((await stat(target)).isDirectory()) await stat(path.join(target, 'index.html'));
  }
}
for (const file of ['index.html', ...pageDirectories.map(directory => `${directory}/index.html`)]) {
  await verifyReferences(file, /(?:src|href)="([^"#]+)(?:#[^"]*)?"/g);
  await verifyReferences(file, /<meta\s+(?:property|name)="(?:og:image|twitter:image)"\s+content="([^"]+)"/g);
}
for (const file of [...files.filter(file => file.endsWith('.css')), 'velvet/userguide/guide.css', 'privacypolicy/policy.css']) {
  await verifyReferences(file, /url\(["']?([^"')]+)["']?\)/g);
}

async function summarize(directory) {
  let count = 0, bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await summarize(target);
      count += nested.count; bytes += nested.bytes;
    } else {
      count += 1; bytes += (await stat(target)).size;
    }
  }
  return { count, bytes };
}
const result = await summarize(output);
console.log(`Built ${domain}: ${result.count} files, ${(result.bytes / 1024).toFixed(1)} KiB in dist/`);
