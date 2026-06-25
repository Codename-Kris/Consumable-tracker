// Consumable Tracker — local data layer
// Persists everything to localStorage so the app works with zero backend.
// Swap this module out later for real API calls without touching the UI.

const STORAGE_KEY = 'consumable_tracker_v1'

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

const today = () => new Date().toISOString().slice(0, 10)

function seed() {
  const items = [
    { id: uid('itm'), name: 'A4 Paper (Ream)', category: 'Stationery', unit: 'ream', quantity: 120, minStock: 30, supplier: 'PaperWorks Ltd' },
    { id: uid('itm'), name: 'Ballpoint Pens (Box of 50)', category: 'Stationery', unit: 'box', quantity: 18, minStock: 10, supplier: 'OfficeMart' },
    { id: uid('itm'), name: 'Toner Cartridge - HP 26A', category: 'Printing', unit: 'unit', quantity: 6, minStock: 5, supplier: 'PrintSource NG' },
    { id: uid('itm'), name: 'Notebooks (A5)', category: 'Stationery', unit: 'piece', quantity: 75, minStock: 20, supplier: 'OfficeMart' },
    { id: uid('itm'), name: 'Hand Sanitizer (500ml)', category: 'Cleaning Supplies', unit: 'bottle', quantity: 9, minStock: 15, supplier: 'CleanPro Supplies' },
    { id: uid('itm'), name: 'AA Batteries (Pack of 4)', category: 'Electrical', unit: 'pack', quantity: 22, minStock: 10, supplier: 'PowerCell NG' },
    { id: uid('itm'), name: 'Printer Ink - Black', category: 'Printing', unit: 'cartridge', quantity: 4, minStock: 6, supplier: 'PrintSource NG' },
    { id: uid('itm'), name: 'Envelopes (A4, Pack of 100)', category: 'Stationery', unit: 'pack', quantity: 30, minStock: 8, supplier: 'PaperWorks Ltd' },
  ]

  const departments = ['Sales', 'Finance', 'HR', 'Operations', 'IT', 'Marketing']

  const users = [
    { id: 'u-admin', name: 'Tayo Adeyemi', role: 'Super Administrator', department: 'Operations' },
    { id: 'u-inv', name: 'Chidinma Eze', role: 'Inventory Administrator', department: 'Operations' },
    { id: 'u-mgr', name: 'Bola Akintola', role: 'Department Manager', department: 'Sales' },
    { id: 'u-emp', name: 'Femi Okonji', role: 'Employee', department: 'Sales' },
  ]

  const requests = [
    {
      id: uid('req'), itemId: items[1].id, itemName: items[1].name, qty: 2, unit: items[1].unit,
      requestedBy: 'Femi Okonji', department: 'Sales', dateRequested: today(),
      status: 'Pending', comments: '', approverComments: '',
    },
    {
      id: uid('req'), itemId: items[4].id, itemName: items[4].name, qty: 5, unit: items[4].unit,
      requestedBy: 'Ngozi Bello', department: 'HR', dateRequested: today(),
      status: 'Approved', comments: 'For new starter kits', approverComments: 'Approved - within budget',
    },
    {
      id: uid('req'), itemId: items[2].id, itemName: items[2].name, qty: 1, unit: items[2].unit,
      requestedBy: 'Ifeanyi Obi', department: 'IT', dateRequested: today(),
      status: 'Rejected', comments: 'Spare cartridge', approverComments: 'Already issued one this month',
    },
  ]

  const issuances = []
  const receipts = [
    { id: uid('rcp'), itemId: items[0].id, itemName: items[0].name, qty: 50, supplier: 'PaperWorks Ltd', date: today() },
  ]
  const auditLog = [
    { id: uid('aud'), date: new Date().toISOString(), actor: 'Tayo Adeyemi', action: 'System initialised with starter inventory' },
  ]

  return { items, departments, users, requests, issuances, receipts, auditLog, currentUserId: 'u-admin' }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = seed()
      save(initial)
      return initial
    }
    return JSON.parse(raw)
  } catch (e) {
    const initial = seed()
    save(initial)
    return initial
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function resetAll() {
  const initial = seed()
  save(initial)
  return initial
}

export const db = { uid, today, load, save, resetAll }
