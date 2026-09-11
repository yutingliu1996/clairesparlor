#!/usr/bin/env node

// Install in <project>/scripts/. Only listed HTML files and the two manifests
// are written. No dependencies, clock values, or network access are used.
import { createHash, randomUUID } from 'node:crypto';
import { readFile, realpath, stat, writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const metadataPath = path.join(projectRoot, 'lib', 'learning-notes.json');
const hash = (value) => createHash('sha256').update(value).digest('hex');

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function htmlAttribute(value) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function attributes(tag) {
  const opening = tag.replace(/^<\s*[a-z][a-z0-9:-]*/i, '').replace(/\/?\s*>$/, '');
  const values = new Map();
  const expression = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of opening.matchAll(expression)) {
    values.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return values;
}

// A small lexical scan avoids touching tag-like strings inside comments,
// scripts, styles, or textarea/title content. Offsets always refer to the
// original string; no author-owned markup or whitespace is reserialized.
function scanTags(html) {
  const tokens = [];
  const rawText = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript']);
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf('<', cursor);
    if (start === -1) break;
    if (html.startsWith('<!--', start)) {
      const closing = html.indexOf('-->', start + 4);
      cursor = closing === -1 ? html.length : closing + 3;
      continue;
    }
    const prefix = html.slice(start).match(/^<(\/?)([a-z][a-z0-9:-]*)(?=[\s/>])/i);
    if (!prefix) { cursor = start + 1; continue; }
    let quote = null;
    let end = start + prefix[0].length;
    for (; end < html.length; end++) {
      const character = html[end];
      if (quote) { if (character === quote) quote = null; }
      else if (character === '"' || character === "'") quote = character;
      else if (character === '>') break;
    }
    if (end === html.length) break;
    end++;
    const token = { start, end, elementEnd: end, name: prefix[2].toLowerCase(), closing: prefix[1] === '/', tag: html.slice(start, end) };
    if (!token.closing && rawText.has(token.name)) {
      const closing = new RegExp(`<\\/${token.name}\\s*>`, 'gi');
      closing.lastIndex = end;
      const found = closing.exec(html);
      token.elementEnd = found ? closing.lastIndex : html.length;
    }
    tokens.push(token);
    cursor = token.elementEnd;
  }
  return tokens;
}

// Injection adds no whitespace, so removing the reserved tags restores the
// complete original HTML for an identical canonical hash on every run.
function removeGeneratedTags(html) {
  let result = '';
  let cursor = 0;
  for (const token of scanTags(html)) {
    if (token.closing) continue;
    const values = attributes(token.tag);
    const name = values.get('name')?.toLowerCase();
    const generatedMeta = token.name === 'meta' && (name === 'learning-note-revision' || name === 'learning-note-id');
    const generatedScript = token.name === 'script' && values.has('data-learning-live');
    if (generatedMeta || generatedScript) {
      result += html.slice(cursor, token.start);
      cursor = token.elementEnd;
    }
  }
  return result + html.slice(cursor);
}

function validateItem(item, ids, hrefs) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Each learning note must be an object.');
  if (typeof item.id !== 'string' || !item.id.trim() || /[\u0000-\u001f\u007f]/.test(item.id)) throw new Error('Each note needs a nonempty id without control characters.');
  if (ids.has(item.id)) throw new Error(`Duplicate note id: ${item.id}`);
  if (typeof item.href !== 'string' || !item.href.startsWith('/studio/notes/') || !item.href.endsWith('/')) throw new Error(`Invalid note href for ${item.id}: expected /studio/notes/<path>/.`);
  // Reject encoded paths rather than risking a mismatch between filesystem
  // paths and browser/server URL decoding. Unicode directory names are fine.
  if (/[\\%?#\u0000-\u0020\u007f]/.test(item.href)) throw new Error(`Unsafe note href for ${item.id}.`);
  const segments = item.href.slice(1, -1).split('/');
  if (segments.length < 3 || segments.some((segment) => !segment || segment === '.' || segment === '..')) throw new Error(`Unsafe note path for ${item.id}.`);
  if (hrefs.has(item.href)) throw new Error(`Duplicate note href: ${item.href}`);
  if (typeof item.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt)) throw new Error(`Invalid updatedAt for ${item.id}: expected YYYY-MM-DD.`);
  const date = new Date(`${item.updatedAt}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== item.updatedAt) throw new Error(`Invalid calendar date for ${item.id}.`);
  ids.add(item.id);
  hrefs.add(item.href);
}

async function writeIfChanged(filename, content) {
  let previous;
  let mode = 0o644;
  try {
    previous = await readFile(filename, 'utf8');
    mode = (await stat(filename)).mode & 0o777;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (previous === content) return false;
  const temporary = path.join(path.dirname(filename), `.${path.basename(filename)}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, content, { flag: 'wx', mode });
    await rename(temporary, filename);
  } finally {
    await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
  return true;
}

async function main() {
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  if (!metadata || typeof metadata !== 'object' || !Array.isArray(metadata.items)) throw new Error('lib/learning-notes.json must contain an items array.');
  const publicRoot = await realpath(path.join(projectRoot, 'public'));
  const notesRoot = await realpath(path.join(publicRoot, 'studio', 'notes'));
  if (!inside(projectRoot, publicRoot) || !inside(publicRoot, notesRoot)) throw new Error('The public notes directory resolves outside the project.');

  const ids = new Set();
  const hrefs = new Set();
  const prepared = [];
  const notes = Object.create(null);

  // Validate and read every input before performing any writes. A missing or
  // unsafe listed file must not leave a partially prepared content set.
  for (const item of metadata.items) {
    validateItem(item, ids, hrefs);
    const filename = path.resolve(publicRoot, `.${item.href}`, 'index.html');
    if (!inside(notesRoot, filename)) throw new Error(`Note ${item.id} escapes /studio/notes/.`);
    let resolved;
    try {
      resolved = await realpath(filename);
    } catch (error) {
      throw new Error(`Cannot read listed HTML for ${item.id}: ${filename}`, { cause: error });
    }
    if (!inside(notesRoot, resolved)) throw new Error(`Note ${item.id} resolves outside /studio/notes/.`);
    if (!(await stat(resolved)).isFile()) throw new Error(`Listed HTML is not a file: ${item.id}`);
    const original = await readFile(resolved, 'utf8');
    const canonical = removeGeneratedTags(original);
    const headClosing = scanTags(canonical).find((token) => token.closing && token.name === 'head');
    if (!headClosing) throw new Error(`Listed HTML needs a closing head tag: ${item.id}`);
    const revision = hash(canonical);
    const tags = `<meta name="learning-note-id" content="${htmlAttribute(item.id)}"><meta name="learning-note-revision" content="${revision}"><script defer src="/studio/notes/live.js" data-learning-live></script>`;
    const html = canonical.slice(0, headClosing.start) + tags + canonical.slice(headClosing.start);
    prepared.push({ filename, html });
    notes[item.id] = { revision, href: item.href, updatedAt: item.updatedAt };
  }

  const manifest = {
    version: hash(JSON.stringify({ metadata, notes })),
    notes,
  };
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  let changed = 0;
  for (const entry of prepared) changed += Number(await writeIfChanged(entry.filename, entry.html));
  changed += Number(await writeIfChanged(path.join(projectRoot, 'lib', 'learning-note-versions.json'), serialized));
  changed += Number(await writeIfChanged(path.join(notesRoot, 'updates.json'), serialized));
  process.stdout.write(`Prepared ${prepared.length} learning note(s); ${changed} file(s) changed. Version ${manifest.version}\n`);
}

main().catch((error) => {
  process.stderr.write(`prepare-learning-notes: ${error.message}\n`);
  process.exitCode = 1;
});
