import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const domain = (await readFile(path.join(root, 'CNAME'), 'utf8')).trim();
if (domain !== 'macpoppy.com') throw new Error('Unexpected publication domain');

const files = ['index.html', 'styles.css', 'app.js', 'CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml'];
const assets = ['assets/poppy-mark-transparent.png', 'assets/icons', 'assets/fonts'];
for (const file of [...files, ...assets]) await stat(path.join(root, file));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(path.join(root, file), path.join(output, file));
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const asset of assets) await cp(path.join(root, asset), path.join(output, asset), { recursive: true });

const html = await readFile(path.join(output, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const reference = match[1];
  if (/^[a-z][a-z\d+.-]*:/i.test(reference)) continue;
  await stat(path.join(output, reference));
}
const css = await readFile(path.join(output, 'styles.css'), 'utf8');
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  if (!/^[a-z][a-z\d+.-]*:/i.test(match[1])) await stat(path.join(output, match[1]));
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
