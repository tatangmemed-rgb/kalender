import { HeaderPhotoConfig, MemoryItem, NoteItem, ReminderItem, ThemePreference } from '../types';
import { scheduleReminderNotification, cancelReminderNotification } from './notification';

const STORAGE_KEYS = {
  NOTES: 'kalenderku_notes_v1',
  REMINDERS: 'kalenderku_reminders_v1',
  MEMORIES: 'kalenderku_memories_v1',
  PHOTO_CONFIG: 'kalenderku_header_photo_v1',
  THEME: 'kalenderku_theme_v1',
};

// Initial preset header photo (warm family / peaceful garden aesthetic)
export const DEFAULT_HEADER_PHOTO: HeaderPhotoConfig = {
  photoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop',
  style: 'header',
  overlayOpacity: 30,
  cropPosition: 'center',
  customCaption: 'Keluarga Bahagia & Harmonis'
};

// Sample realistic preset photos that users can pick with 1 click
export const PRESET_HEADER_PHOTOS = [
  {
    title: 'Keluarga Hangat',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Alam Pegunungan Asri',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Suasana Desa Tenang',
    url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Sunset Keemasan',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'Bunga Sakura Indah',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1200&auto=format&fit=crop'
  }
];

// Initial starter seed data for 2027
const SEED_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    dateString: '2027-01-01',
    title: 'Resolusi Tahun Baru 2027',
    content: 'Tahun ini fokus mempererat silaturahmi keluarga, menjaga kesehatan rutin olahraga pagi, dan menabung untuk umrah.',
    time: '08:00',
    category: 'Pribadi',
    photos: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop'],
    isImportant: true,
    createdAt: '2026-12-31T20:00:00.000Z',
    updatedAt: '2026-12-31T20:00:00.000Z'
  },
  {
    id: 'note-2',
    dateString: '2027-03-10',
    title: 'Silaturahmi Idul Fitri 1448 H',
    content: 'Kumpul keluarga besar di rumah Eyang. Menu opor ayam, rendang, dan lontong sayur komplit.',
    time: '09:00',
    category: 'Keluarga',
    photos: ['https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop'],
    isImportant: true,
    createdAt: '2027-03-01T10:00:00.000Z',
    updatedAt: '2027-03-01T10:00:00.000Z'
  },
  {
    id: 'note-3',
    dateString: '2027-08-17',
    title: 'Lomba HUT RI ke-82 di RT',
    content: 'Panitia lomba 17 Agustus: jalan santai keluarga, lomba balap karung anak-anak, dan tumpengan malam tirakatan.',
    time: '07:30',
    category: 'Keluarga',
    photos: [],
    isImportant: false,
    createdAt: '2027-08-10T12:00:00.000Z',
    updatedAt: '2027-08-10T12:00:00.000Z'
  }
];

const SEED_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Bayar Listrik & Token PLN',
    dateString: '2027-01-17',
    time: '19:00',
    repeat: 'monthly',
    isCompleted: false,
    isImportant: true,
    category: 'Keuangan',
    notes: 'Bayar lewat m-banking sebelum tanggal 20 agar tidak kena denda',
    createdAt: '2027-01-01T08:00:00.000Z'
  },
  {
    id: 'rem-2',
    title: 'Pengajian Rutin Malam Jumat',
    dateString: '2027-01-21',
    time: '19:30',
    repeat: 'weekly',
    isCompleted: false,
    isImportant: false,
    category: 'Ibadah',
    notes: 'Kajian kitab di Masjid Al-Ikhlas bersama tetangga',
    createdAt: '2027-01-01T08:00:00.000Z'
  },
  {
    id: 'rem-3',
    title: 'Ulang Tahun Ayah tercinta 🎉',
    dateString: '2027-05-12',
    time: '07:00',
    repeat: 'yearly',
    isCompleted: false,
    isImportant: true,
    category: 'Keluarga',
    notes: 'Siapkan kue ulang tahun dan kado spesial dari anak-anak',
    createdAt: '2027-01-01T08:00:00.000Z'
  },
  {
    id: 'rem-4',
    title: 'Medical Check-up Rutin',
    dateString: '2027-06-15',
    time: '08:30',
    repeat: 'once',
    isCompleted: false,
    isImportant: true,
    category: 'Kesehatan',
    notes: 'Pemeriksaan tensi darah, kolesterol, dan gula darah',
    createdAt: '2027-01-01T08:00:00.000Z'
  }
];

const SEED_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    dateString: '2026-08-17',
    title: 'Piknik Keluarga ke Kaliurang',
    story: 'Kenangan indah menikmati udara sejuk pegunungan bersama anak-anak dan kakek nenek. Anak-anak sangat senang naik mobil jeep dan makan jadah tempe.',
    location: 'Kaliurang, Sleman, Yogyakarta',
    attendees: 'Ayah, Ibu, Dimas, Rania, Eyang',
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop'
    ],
    createdAt: '2026-08-17T18:00:00.000Z'
  },
  {
    id: 'mem-2',
    dateString: '2027-01-01',
    title: 'Bakar Jagung Malam Tahun Baru',
    story: 'Malam tahun baru berkumpul di halaman rumah sambil bakar jagung dan sate ayam. Penuh canda tawa dan rasa syukur.',
    location: 'Halaman Rumah',
    attendees: 'Seluruh Keluarga Besar',
    photos: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop'
    ],
    createdAt: '2027-01-01T01:00:00.000Z'
  }
];

// Helper to broadcast storage changes across components
export const STORAGE_CHANGE_EVENT = 'kalenderku_storage_updated';

function notifyStorageChange() {
  window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
}

export function getStoredNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(SEED_NOTES));
      return SEED_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_NOTES;
  }
}

export function saveNotes(notes: NoteItem[]) {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  notifyStorageChange();
}

export function addNote(note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>): NoteItem {
  const notes = getStoredNotes();
  const newNote: NoteItem = {
    ...note,
    id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveNotes([newNote, ...notes]);
  return newNote;
}

export function updateNote(id: string, updates: Partial<NoteItem>) {
  const notes = getStoredNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveNotes(notes);
  }
}

export function deleteNote(id: string) {
  const notes = getStoredNotes().filter(n => n.id !== id);
  saveNotes(notes);
}

// Reminders
export function getStoredReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
      return SEED_REMINDERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderItem[]) {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  notifyStorageChange();
}

export function addReminder(rem: Omit<ReminderItem, 'id' | 'createdAt'>): ReminderItem {
  const reminders = getStoredReminders();
  const newRem: ReminderItem = {
    ...rem,
    id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString()
  };
  saveReminders([newRem, ...reminders]);
  scheduleReminderNotification(newRem);
  return newRem;
}

export function toggleReminderComplete(id: string) {
  const reminders = getStoredReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index].isCompleted = !reminders[index].isCompleted;
    saveReminders(reminders);
    if (reminders[index].isCompleted) {
      cancelReminderNotification(id);
    } else {
      scheduleReminderNotification(reminders[index]);
    }
  }
}

export function updateReminder(id: string, updates: Partial<ReminderItem>) {
  const reminders = getStoredReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index !== -1) {
    reminders[index] = { ...reminders[index], ...updates };
    saveReminders(reminders);
    scheduleReminderNotification(reminders[index]);
  }
}

export function deleteReminder(id: string) {
  const reminders = getStoredReminders().filter(r => r.id !== id);
  saveReminders(reminders);
  cancelReminderNotification(id);
}

// Memories
export function getStoredMemories(): MemoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(SEED_MEMORIES));
      return SEED_MEMORIES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_MEMORIES;
  }
}

export function saveMemories(memories: MemoryItem[]) {
  localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  notifyStorageChange();
}

export function addMemory(memory: Omit<MemoryItem, 'id' | 'createdAt'>): MemoryItem {
  const memories = getStoredMemories();
  const newMem: MemoryItem = {
    ...memory,
    id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString()
  };
  saveMemories([newMem, ...memories]);
  return newMem;
}

export function updateMemory(id: string, updates: Partial<MemoryItem>) {
  const memories = getStoredMemories();
  const index = memories.findIndex(m => m.id === id);
  if (index !== -1) {
    memories[index] = {
      ...memories[index],
      ...updates
    };
    saveMemories(memories);
  }
}

export function deleteMemory(id: string) {
  const memories = getStoredMemories().filter(m => m.id !== id);
  saveMemories(memories);
}

// Header Photo Config
export function getHeaderPhotoConfig(): HeaderPhotoConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PHOTO_CONFIG);
    if (!raw) return DEFAULT_HEADER_PHOTO;
    return { ...DEFAULT_HEADER_PHOTO, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_HEADER_PHOTO;
  }
}

export function saveHeaderPhotoConfig(config: HeaderPhotoConfig) {
  localStorage.setItem(STORAGE_KEYS.PHOTO_CONFIG, JSON.stringify(config));
  notifyStorageChange();
}

// Theme
export function getThemePreference(): ThemePreference {
  try {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemePreference) || 'light';
  } catch {
    return 'light';
  }
}

export function saveThemePreference(theme: ThemePreference) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  notifyStorageChange();
}

// Backup & Restore
export function exportAllData(): string {
  const backup = {
    appName: 'KALENDERKU 2027',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    notes: getStoredNotes(),
    reminders: getStoredReminders(),
    memories: getStoredMemories(),
    headerPhoto: getHeaderPhotoConfig(),
    theme: getThemePreference()
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.notes && Array.isArray(data.notes)) {
      saveNotes(data.notes);
    }
    if (data.reminders && Array.isArray(data.reminders)) {
      saveReminders(data.reminders);
    }
    if (data.memories && Array.isArray(data.memories)) {
      saveMemories(data.memories);
    }
    if (data.headerPhoto) {
      saveHeaderPhotoConfig(data.headerPhoto);
    }
    if (data.theme) {
      saveThemePreference(data.theme);
    }
    return true;
  } catch (err) {
    console.error('Failed to import data', err);
    return false;
  }
}

export function resetAllDataToDefault() {
  saveNotes(SEED_NOTES);
  saveReminders(SEED_REMINDERS);
  saveMemories(SEED_MEMORIES);
  saveHeaderPhotoConfig(DEFAULT_HEADER_PHOTO);
  saveThemePreference('light');
}
