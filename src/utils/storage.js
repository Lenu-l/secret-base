/**
 * 🌙 Digital Garden — LocalStorage Data Layer
 *
 * All data is stored in localStorage with typed schemas.
 * Each collection is an array of records with id, createdAt, etc.
 */

const STORAGE_KEYS = {
  inspirations: 'dg_inspirations',
  diaries: 'dg_diaries',
  resources: 'dg_resources',
  media: 'dg_media',
  settings: 'dg_settings',
}

// ─── Generic CRUD ────────────────────────────────────

function readCollection(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

// ─── Inspiration ──────────────────────────────────────

export function getInspirations() {
  return readCollection(STORAGE_KEYS.inspirations)
}

export function addInspiration({ content, tags = [] }) {
  const items = getInspirations()
  const item = {
    id: generateId(),
    content,
    tags,
    createdAt: new Date().toISOString(),
  }
  items.unshift(item)
  writeCollection(STORAGE_KEYS.inspirations, items)
  return item
}

export function deleteInspiration(id) {
  const items = getInspirations().filter((i) => i.id !== id)
  writeCollection(STORAGE_KEYS.inspirations, items)
}

// ─── Diary ────────────────────────────────────────────

export function getDiaries() {
  return readCollection(STORAGE_KEYS.diaries)
}

export function addDiary({ date, content, mood }) {
  const items = getDiaries()
  // Replace existing entry for same date
  const existing = items.findIndex((d) => d.date === date)
  const item = {
    id: generateId(),
    date,
    content,
    mood: mood || 'calm',
    createdAt: new Date().toISOString(),
  }
  if (existing >= 0) {
    items[existing] = { ...items[existing], ...item, id: items[existing].id }
  } else {
    items.unshift(item)
  }
  writeCollection(STORAGE_KEYS.diaries, items)
  return item
}

export function deleteDiary(id) {
  const items = getDiaries().filter((d) => d.id !== id)
  writeCollection(STORAGE_KEYS.diaries, items)
}

export function getDiaryByDate(date) {
  return getDiaries().find((d) => d.date === date) || null
}

// ─── Resources ────────────────────────────────────────

export function getResources() {
  return readCollection(STORAGE_KEYS.resources)
}

export function addResource({ title, url, type, tags = [] }) {
  const items = getResources()
  const item = {
    id: generateId(),
    title,
    url,
    type: type || 'web',
    tags,
    createdAt: new Date().toISOString(),
  }
  items.unshift(item)
  writeCollection(STORAGE_KEYS.resources, items)
  return item
}

export function deleteResource(id) {
  const items = getResources().filter((r) => r.id !== id)
  writeCollection(STORAGE_KEYS.resources, items)
}

// ─── Media (Books/Movies/Music) ───────────────────────

export function getMedia() {
  return readCollection(STORAGE_KEYS.media)
}

export function addMedia({ title, type, status, rating, tags = [] }) {
  const items = getMedia()
  const item = {
    id: generateId(),
    title,
    type: type || 'book',
    status: status || 'want',
    rating: rating || 0,
    tags,
    createdAt: new Date().toISOString(),
  }
  items.unshift(item)
  writeCollection(STORAGE_KEYS.media, items)
  return item
}

export function updateMedia(id, updates) {
  const items = getMedia()
  const idx = items.findIndex((m) => m.id === id)
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...updates }
    writeCollection(STORAGE_KEYS.media, items)
    return items[idx]
  }
  return null
}

export function deleteMedia(id) {
  const items = getMedia().filter((m) => m.id !== id)
  writeCollection(STORAGE_KEYS.media, items)
}

// ─── Random Memory (for Home page) ────────────────────

export function getRandomMemory() {
  const inspirations = getInspirations()
  const diaries = getDiaries()
  const all = [
    ...inspirations.map((i) => ({ ...i, source: 'inspiration' })),
    ...diaries.map((d) => ({ ...d, source: 'diary' })),
  ]
  if (all.length === 0) return null
  return all[Math.floor(Math.random() * all.length)]
}

// ─── Recent Items (for Home page) ─────────────────────

export function getRecentItems(limit = 5) {
  const inspirations = getInspirations().map((i) => ({ ...i, source: 'inspiration' }))
  const diaries = getDiaries().map((d) => ({ ...d, source: 'diary' }))
  const resources = getResources().map((r) => ({ ...r, source: 'resource' }))
  const media = getMedia().map((m) => ({ ...m, source: 'media' }))

  const all = [...inspirations, ...diaries, ...resources, ...media]
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return all.slice(0, limit)
}

// ─── Settings ─────────────────────────────────────────

const DEFAULT_SETTINGS = {
  darkMode: false,
  userName: '',
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings) {
  const current = getSettings()
  writeCollection(STORAGE_KEYS.settings, { ...current, ...settings })
}
