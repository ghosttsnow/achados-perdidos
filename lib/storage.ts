export interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  className?: string
  createdAt: string
}

export interface StoredItem {
  id: string
  title: string
  description: string
  category: string
  photo_url: string | null
  location: string
  status: 'perdido' | 'encontrado' | 'devolvido'
  reported_by: string
  contact: string
  created_at: string
}

export interface StoredNotification {
  id: string
  item_id: string
  message: string
  read: boolean
  created_at: string
}

function getCollection<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveCollection<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

const KEYS = {
  USERS: 'cbn_users',
  ITEMS: 'cbn_items',
  NOTIFICATIONS: 'cbn_notifications',
  SESSION: 'cbn_session',
}

// Auth
export function getUsers(): StoredUser[] {
  return getCollection<StoredUser>(KEYS.USERS)
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find(u => u.email === email)
}

export function createUser(email: string, password: string, name: string, className?: string): StoredUser {
  const users = getUsers()
  const user: StoredUser = {
    id: genId(), email, password, name, className,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveCollection(KEYS.USERS, users)
  return user
}

// Session
export function getSession(): StoredUser | null {
  const s = getCollection<StoredUser>(KEYS.SESSION)
  return s.length > 0 ? s[0] : null
}

export function saveSession(user: StoredUser): void {
  localStorage.setItem(KEYS.SESSION, JSON.stringify([user]))
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION)
}

// Items
export function getItems(): StoredItem[] {
  return getCollection<StoredItem>(KEYS.ITEMS)
}

export function createItem(item: Omit<StoredItem, 'id' | 'created_at'>): StoredItem {
  const items = getItems()
  const newItem: StoredItem = { ...item, id: genId(), created_at: new Date().toISOString() }
  items.unshift(newItem)
  saveCollection(KEYS.ITEMS, items)
  return newItem
}

export function updateItemStatus(id: string, status: StoredItem['status']): boolean {
  const items = getItems()
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return false
  items[idx].status = status
  saveCollection(KEYS.ITEMS, items)
  return true
}

// Notifications
export function getNotifications(): StoredNotification[] {
  return getCollection<StoredNotification>(KEYS.NOTIFICATIONS)
}

export function createNotification(notif: Omit<StoredNotification, 'id' | 'created_at'>): StoredNotification {
  const list = getNotifications()
  const n: StoredNotification = { ...notif, id: genId(), created_at: new Date().toISOString() }
  list.unshift(n)
  saveCollection(KEYS.NOTIFICATIONS, list)
  return n
}

export function markNotificationRead(id: string): boolean {
  const list = getNotifications()
  const idx = list.findIndex(n => n.id === id)
  if (idx === -1) return false
  list[idx].read = true
  saveCollection(KEYS.NOTIFICATIONS, list)
  return true
}