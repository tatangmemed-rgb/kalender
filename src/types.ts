export type PasaranType = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

export interface DayCalendarInfo {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayOfMonth: number; // 1-31
  dayOfWeek: number; // 0=Minggu, 1=Senin, ..., 6=Sabtu
  dayNameMasehi: string; // 'Minggu', 'Senin', ...
  dayNameJawa: string; // 'Ahad', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jemuwah', 'Setu'
  pasaran: PasaranType;
  neptu: number;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  jawaMonthName: string;
  jawaYear: number;
  wuku: string;
  isHoliday: boolean;
  holidayName?: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type CategoryType = 
  | 'Keluarga' 
  | 'Pekerjaan' 
  | 'Pribadi' 
  | 'Ibadah' 
  | 'Kesehatan' 
  | 'Keuangan' 
  | 'Lainnya';

export interface NoteItem {
  id: string;
  dateString: string; // YYYY-MM-DD
  title: string;
  content: string;
  time?: string; // HH:mm
  category: CategoryType;
  photos: string[]; // data URLs or image URLs
  attachments?: string[];
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReminderRepeatType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReminderItem {
  id: string;
  title: string;
  dateString: string; // YYYY-MM-DD
  time: string; // HH:mm
  repeat: ReminderRepeatType;
  isCompleted: boolean;
  isImportant: boolean;
  category?: CategoryType;
  notes?: string;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  dateString: string; // YYYY-MM-DD
  title: string;
  story: string;
  location?: string;
  attendees?: string;
  photos: string[];
  createdAt: string;
}

export type HeaderPhotoStyle = 'header' | 'background' | 'card' | 'cover';

export interface HeaderPhotoConfig {
  photoUrl: string;
  style: HeaderPhotoStyle;
  overlayOpacity: number; // 0 to 100
  cropPosition: 'center' | 'top' | 'bottom';
  customCaption?: string;
}

export type WidgetSize = '1x1' | '2x2' | '4x2' | '4x4';

export type ActiveTab = 
  | 'home' 
  | 'calendar_year' 
  | 'notes' 
  | 'reminders' 
  | 'memories' 
  | 'agenda'
  | 'widget_preview';

export type FilterCategory = 'all' | 'notes' | 'reminders' | 'agenda' | 'memories' | 'important' | 'photos';

export type ThemePreference = 'light' | 'dark' | 'system';
