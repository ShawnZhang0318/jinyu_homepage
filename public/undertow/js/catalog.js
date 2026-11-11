import { NF, MAX_CHAPTERS } from './stories.js';

// Keep the upstream catalog constraints, with the site's same-origin asset paths.
function validateCatalog(catalog, data) {
  const fail = message => { throw new Error(message); };
  const text = value => typeof value === 'string' && value.trim().length > 0;
  if (!Array.isArray(catalog?.photos) || !catalog.photos.length) fail('photos.json must contain at least one photo.');
  if (!Array.isArray(data?.stories)) fail('stories.json must contain a stories array.');
  const ids = new Set();
  const photos = catalog.photos.map(p => {
    if (!text(p?.id) || ids.has(p.id)) fail(`Missing or duplicate photo id: ${p?.id}`);
    if (!text(p.src) || new URL(p.src).origin !== location.origin) {
      fail(`Photo ${p.id}: src must be a same-origin photo URL.`);
    }
    ids.add(p.id);
    return { ...p, description: p.description ?? '', photographer: p.photographer ?? '', avg: [0.5, 0.5, 0.5] };
  });
  const lines = new Set(), storyIds = new Set();
  const authored = data.stories.map((s, k) => {
    if (!text(s?.id) || storyIds.has(s.id)) fail(`Missing or duplicate story id: ${s?.id}`);
    if (/^line-\d+$/.test(s.id)) fail(`Story ${s.id}: line-N ids are reserved for generated stories.`);
    if (!text(s.title)) fail(`Story ${s.id} needs a title.`);
    const line = s.line ?? Math.min(NF - 1, Math.round((k + 0.5) * NF / data.stories.length));
    if (!Number.isInteger(line) || line < 0 || line >= NF || lines.has(line)) fail(`Story ${s.id}: invalid or occupied line ${line}.`);
    if (!Array.isArray(s.chapters) || s.chapters.length < 1 || s.chapters.length > MAX_CHAPTERS) {
      fail(`Story ${s.id} must have 1–${MAX_CHAPTERS} chapters.`);
    }
    for (const c of s.chapters) {
      if (!ids.has(String(c?.photo))) fail(`Story ${s.id} references an unknown photo: ${c?.photo}`);
    }
    lines.add(line); storyIds.add(s.id);
    return { ...s, line };
  });
  const journal = data.journal ?? [];
  if (!Array.isArray(journal) || journal.some(entry => !entry || typeof entry !== 'object')) {
    fail('journal must be an array of date/text entries.');
  }
  return { photos, authored, journal };
}

export function loadCatalog() {
  const records = portfolioContent.photography.filter(record => record.src);
  if (!records.length) {
    // A single neutral layer keeps the original texture array valid. It is never shown as a photo.
    const neutral = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Cpath fill=%22%233a4058%22 d=%22M0 0h1v1H0z%22/%3E%3C/svg%3E';
    return { photos: [{ id: 'neutral', src: neutral }], authored: [], journal: [], empty: true };
  }
  const root = new URL('../../', location.href);
  const photos = records.map((record, index) => ({
    id: `photo-${index + 1}`,
    src: new URL(record.src, root).href,
    description: record.alt || record.title || ''
  }));
  const stories = records.map((record, index) => ({
    id: photos[index].id,
    title: record.title || '摄影作品',
    chapters: [{ photo: photos[index].id, caption: record.alt || record.title, text: record.description }]
  }));
  return validateCatalog({ photos }, { stories });
}
