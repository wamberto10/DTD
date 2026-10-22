import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const localAsset = (url, parent = path.join(dist, 'index.html')) => {
  if (/^[a-z]+:/i.test(url) || url.startsWith('//')) throw new Error(`Recurso externo não suportado: ${url}`);
  const resolved = url.startsWith('/')
    ? path.resolve(dist, url.slice(1))
    : path.resolve(path.dirname(parent), url);
  if (!resolved.startsWith(`${dist}${path.sep}`)) throw new Error(`Recurso fora da versão publicada: ${url}`);
  return resolved;
};
const toDataUrl = async (url, mime, parent) => `data:${mime};base64,${(await readFile(localAsset(url, parent))).toString('base64')}`;
let html = await readFile(path.join(dist, 'index.html'), 'utf8');
const cssUrl = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)?.[1];
const jsUrl = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)?.[1];
if (!cssUrl || !jsUrl) throw new Error('Execute npm run build antes de gerar a versão portátil.');

const cssFile = localAsset(cssUrl);
let css = await readFile(cssFile, 'utf8');
for (const match of [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]) {
  const url = match[1];
  if (url.startsWith('data:')) continue;
  const mime = url.endsWith('.woff2') ? 'font/woff2' : url.endsWith('.woff') ? 'font/woff' : null;
  if (!mime) throw new Error(`Formato de recurso não suportado: ${url}`);
  css = css.replaceAll(match[0], `url("${await toDataUrl(url, mime, cssFile)}")`);
}
const js = (await readFile(localAsset(jsUrl), 'utf8')).replace(/<\/script/gi, '<\\/script');
html = html.replace(/<link rel="stylesheet"[^>]*>/, () => `<style>${css}</style>`);
html = html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/, () => `<script type="module">${js}</script>`);
// The painted art (dist/arte) travels inside the page; src/chibi-art.js reads it from window.DTD_ART.
const artFiles = [];
const collect = async dir => {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full);
    else if (entry.name.endsWith('.webp')) artFiles.push(full);
  }
};
await collect(path.join(dist, 'arte'));
const art = {};
for (const file of artFiles) {
  art[path.relative(dist, file).split(path.sep).join('/')] = `data:image/webp;base64,${(await readFile(file)).toString('base64')}`;
}
html = html.replace(/<script type="module">/, () => `<script>window.DTD_ART=${JSON.stringify(art)};</script><script type="module">`);
const faviconUrl = html.match(/<link rel="icon"[^>]*href="([^"]+)"/)?.[1];
if (faviconUrl) html = html.replace(`href="${faviconUrl}"`, `href="${await toDataUrl(faviconUrl, 'image/svg+xml')}"`);
const output = path.join(dist, 'DTD-Dao-Tower-Defense.html');
await writeFile(output, html);
console.log(`Jogo portátil criado: ${output}`);
