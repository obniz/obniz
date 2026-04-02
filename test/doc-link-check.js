/* eslint-env mocha */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const DOCS_DIR = path.resolve(__dirname, '../docs/obnizjs');

const collectHtmlFiles = (dir) => {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
};

// macOS is case-insensitive, but GitHub Pages (Linux) is case-sensitive.
// Build a Set of exact filenames per directory for fast case-sensitive lookup.
const dirCache = new Map();
const existsCaseSensitive = (filePath) => {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  let entries = dirCache.get(dir);
  if (!entries) {
    try {
      entries = new Set(fs.readdirSync(dir));
    } catch (e) {
      entries = new Set();
    }
    dirCache.set(dir, entries);
  }
  return entries.has(base);
};

const extractRelativeLinks = (html) => {
  const re = /href="([^"#?]+\.html)(?:[#?][^"]*)?"/g;
  const links = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://')) continue;
    links.push(href);
  }
  return links;
};

describe('Documentation internal links', () => {
  const htmlFiles = collectHtmlFiles(DOCS_DIR);
  const brokenLinks = [];

  before(() => {
    for (const file of htmlFiles) {
      const html = fs.readFileSync(file, 'utf-8');
      const dir = path.dirname(file);
      const seen = new Set();
      for (const href of extractRelativeLinks(html)) {
        const target = path.resolve(dir, href);
        if (seen.has(target)) continue;
        seen.add(target);
        if (!existsCaseSensitive(target)) {
          brokenLinks.push({
            source: path.relative(DOCS_DIR, file),
            href,
            expected: path.relative(DOCS_DIR, target),
          });
        }
      }
    }
  });

  it('should have no broken internal links', () => {
    if (brokenLinks.length > 0) {
      const summary = brokenLinks
        .map((b) => `  ${b.source} -> ${b.href} (missing: ${b.expected})`)
        .join('\n');
      assert.fail(`Found ${brokenLinks.length} broken link(s):\n${summary}`);
    }
  });
});
