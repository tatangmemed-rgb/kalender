import React, { useState } from 'react';
import { 
  X, Calendar, Clock, Star, Bell, BookOpen, Camera, 
  MapPin, Users, Plus, CheckCircle2, Circle, Trash2, Edit2, 
  AlertCircle, Sparkles, Image as ImageIcon, MessageCircle 
} from 'lucide-react';
import { DayCalendarInfo, NoteItem, ReminderItem, MemoryItem, CategoryType } from '../types';
import { 
  addNote, addReminder, addMemory, 
  deleteNote, deleteReminder, deleteMemory, 
  toggleReminderComplete, updateNote 
} from '../utils/storage';

interface DateDetailModalProps {
  dayInfo: DayCalendarInfo;
  notes: NoteItem[];
  reminders: ReminderItem[];
  memories: MemoryItem[];
  allMemories: MemoryItem[]; // For checking on this day from other years
  onClose: () => void;
  onRefreshData: () => void;
  initialAction?: 'none' | 'add_note' | 'add_reminder' | 'add_memory';
}

const CATEGORIES: CategoryType[] = ['Keluarga', 'Pekerjaan', 'Pribadi', 'Ibadah', 'Kesehatan', 'Keuangan', 'Lainnya'];

export const DateDetailModal: React.FC<DateDetailModalProps> = ({
  dayInfo,
  notes,
  reminders,
  memories,
  allMemories,
  onClose,
  onRefreshData,
  initialAction = 'none'
}) => {
  const [activeForm, setActiveForm] = useState<'none' | 'note' | 'reminder' | 'memory'>(
    initialAction === 'add_note' ? 'note' :
    initialAction === 'add_reminder' ? 'reminder' :
    initialAction === 'add_memory' ? 'memory' : 'none'
  );

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTime, setNoteTime] = useState('09:00');
  const [noteCategory, setNoteCategory] = useState<CategoryType>('Keluarga');
  const [noteIsImportant, setNoteIsImportant] = useState(false);
  const [notePhotos, setNotePhotos] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Reminder form state
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('19:00');
  const [reminderRepeat, setReminderRepeat] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('once');
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderIsImportant, setReminderIsImportant] = useState(false);

  // Memory form state
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryStory, setMemoryStory] = useState('');
  const [memoryLocation, setMemoryLocation] = useState('');
  const [memoryAttendees, setMemoryAttendees] = useState('');
  const [memoryPhotos, setMemoryPhotos] = useState<string[]>([]);

  // Check throwback memories (same month & day, but different year!)
  const [, targetMonthStr, targetDayStr] = dayInfo.dateString.split('-');
  const throwbackMemories = allMemories.filter(m => {
    const [mYear, mMonth, mDay] = m.dateString.split('-');
    return mMonth === targetMonthStr && mDay === targetDayStr && mYear !== dayInfo.dateString.substring(0, 4);
  });

  const handlePhotoUploadForNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNotePhotos([...notePhotos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUploadForMemory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMemoryPhotos([...memoryPhotos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: noteTitle,
        content: noteContent,
        time: noteTime,
        category: noteCategory,
        isImportant: noteIsImportant,
        photos: notePhotos
      });
    } else {
      addNote({
        dateString: dayInfo.dateString,
        title: noteTitle,
        content: noteContent,
        time: noteTime,
        category: noteCategory,
        isImportant: noteIsImportant,
        photos: notePhotos
      });
    }

    setNoteTitle('');
    setNoteContent('');
    setNotePhotos([]);
    setEditingNoteId(null);
    setActiveForm('none');
    onRefreshData();
  };

  const handleStartEditNote = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTime(note.time || '09:00');
    setNoteCategory(note.category);
    setNoteIsImportant(note.isImportant);
    setNotePhotos(note.photos || []);
    setActiveForm('note');
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    addReminder({
      title: reminderTitle,
      dateString: dayInfo.dateString,
      time: reminderTime,
      repeat: reminderRepeat,
      isCompleted: false,
      isImportant: reminderIsImportant,
      notes: reminderNotes
    });

    setReminderTitle('');
    setReminderNotes('');
    setActiveForm('none');
    onRefreshData();
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryTitle.trim()) return;

    addMemory({
      dateString: dayInfo.dateString,
      title: memoryTitle,
      story: memoryStory,
      location: memoryLocation,
      attendees: memoryAttendees,
      photos: memoryPhotos
    });

    setMemoryTitle('');
    setMemoryStory('');
    setMemoryLocation('');
    setMemoryAttendees('');
    setMemoryPhotos([]);
    setActiveForm('none');
    onRefreshData();
  };

  const handleShareDateToWA = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
    const text = `📅 *Info Kalender:*
*${dayInfo.dayNameMasehi}, ${dayInfo.dayOfMonth} ${dayInfo.date.toLocaleString('id-ID', { month: 'long' })} ${dayInfo.date.getFullYear()}*
• Kalender Hijriyah: ${dayInfo.hijriDay} ${dayInfo.hijriMonthName} ${dayInfo.hijriYear} H
• Pasaran Jawa: ${dayInfo.pasaran} (Neptu ${dayInfo.neptu})
• Hari Jawa: ${dayInfo.dayNameJawa} | Wuku: ${dayInfo.wuku}
${dayInfo.holidayName ? `🔴 *Hari Libur:* ${dayInfo.holidayName}\n` : ''}${notes.length > 0 ? `📝 *Catatan:* ${notes.map(n => n.title).join(', ')}\n` : ''}
Buka aplikasi KALENDERKU:
👉 ${currentUrl}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
      <div 
        id="date-detail-modal"
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-stone-200 dark:border-stone-800">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShareDateToWA}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              title="Bagikan Info Tanggal ini ke WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagi WA</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
            <Calendar className="w-4 h-4" />
            <span>DETAIL TANGGAL</span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                {dayInfo.dayNameMasehi}, {dayInfo.dayOfMonth} {dayInfo.date.toLocaleString('id-ID', { month: 'long' })} {dayInfo.date.getFullYear()}
              </h2>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mt-1">
                Pasaran: {dayInfo.pasaran} (Neptu {dayInfo.neptu}) • Hari Jawa: {dayInfo.dayNameJawa} • Wuku: {dayInfo.wuku}
              </p>
            </div>
          </div>

          {/* Hijri & Javanese Badges */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20">
              🌙 {dayInfo.hijriDay} {dayInfo.hijriMonthName} {dayInfo.hijriYear} H
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/20">
              🌾 {dayInfo.hijriDay} {dayInfo.jawaMonthName} {dayInfo.jawaYear} Jawa
            </span>
            {dayInfo.holidayName && (
              <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{dayInfo.holidayName}</span>
              </span>
            )}
            {dayInfo.isToday && (
              <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold shadow-xs">
                Hari Ini
              </span>
            )}
          </div>

          {/* Quick Action Bar (+ Tambah Catatan, Reminder, Kenangan, Foto, Agenda) */}
          <div className="mt-4 pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingNoteId(null);
                setNoteTitle('');
                setNoteContent('');
                setActiveForm(activeForm === 'note' ? 'none' : 'note');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeForm === 'note'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Catatan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveForm(activeForm === 'reminder' ? 'none' : 'reminder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeForm === 'reminder'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Reminder</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveForm(activeForm === 'memory' ? 'none' : 'memory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeForm === 'memory'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200 dark:border-purple-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kenangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingNoteId(null);
                setNoteTitle('Foto Baru ' + dayInfo.dayOfMonth);
                setNoteCategory('Keluarga');
                setActiveForm('note');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-200 dark:border-stone-700"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Tambah Foto</span>
            </button>

            <button
              type="button"
              onClick={handleShareDateToWA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bagikan ke WA</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Active Forms */}
          {activeForm === 'note' && (
            <form onSubmit={handleSaveNote} className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                  {editingNoteId ? 'Edit Catatan' : 'Catatan Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveForm('none')}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Batal
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Judul catatan (Contoh: Acara keluarga)..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Isi catatan (Contoh: Hari ini berkumpul bersama keluarga)..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Waktu:</label>
                  <input
                    type="time"
                    value={noteTime}
                    onChange={(e) => setNoteTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Kategori:</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as CategoryType)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2 text-stone-700 dark:text-stone-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={noteIsImportant}
                      onChange={(e) => setNoteIsImportant(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span>⭐ Tandai Penting</span>
                  </label>
                </div>
              </div>

              {/* Photos in Note */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Lampiran Foto:</span>
                  <label className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ Unggah Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUploadForNote} className="hidden" />
                  </label>
                </div>
                {notePhotos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {notePhotos.map((photo, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                        <img src={photo} alt="lampiran" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setNotePhotos(notePhotos.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  {editingNoteId ? 'Perbarui Catatan' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          )}

          {activeForm === 'reminder' && (
            <form onSubmit={handleSaveReminder} className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Reminder / Pengingat Baru
                </span>
                <button
                  type="button"
                  onClick={() => setActiveForm('none')}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Batal
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder="Judul reminder (Contoh: Bayar listrik)..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Waktu Alarm:</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Ulangi:</label>
                  <select
                    value={reminderRepeat}
                    onChange={(e) => setReminderRepeat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="once">Sekali</option>
                    <option value="daily">Setiap hari</option>
                    <option value="weekly">Setiap minggu</option>
                    <option value="monthly">Setiap bulan</option>
                    <option value="yearly">Setiap tahun</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="Keterangan tambahan (opsional)..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <input
                    type="checkbox"
                    checked={reminderIsImportant}
                    onChange={(e) => setReminderIsImportant(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>⭐ Prioritas Utama</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Pasang Pengingat
                </button>
              </div>
            </form>
          )}

          {activeForm === 'memory' && (
            <form onSubmit={handleSaveMemory} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                  📸 Tambah Kenangan / Album
                </span>
                <button
                  type="button"
                  onClick={() => setActiveForm('none')}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Batal
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={memoryTitle}
                  onChange={(e) => setMemoryTitle(e.target.value)}
                  placeholder="Judul kenangan (Contoh: Acara keluarga di rumah)..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-purple-500 font-semibold"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  value={memoryStory}
                  onChange={(e) => setMemoryStory(e.target.value)}
                  placeholder="Cerita atau kenangan berharga yang terjadi..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Lokasi:</label>
                  <input
                    type="text"
                    value={memoryLocation}
                    onChange={(e) => setMemoryLocation(e.target.value)}
                    placeholder="Contoh: Kaliurang, Sleman"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1 font-medium">Orang yang hadir:</label>
                  <input
                    type="text"
                    value={memoryAttendees}
                    onChange={(e) => setMemoryAttendees(e.target.value)}
                    placeholder="Contoh: Ayah, Ibu, Adik"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Foto Kenangan:</span>
                  <label className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 cursor-pointer font-bold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>+ Pilih Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUploadForMemory} className="hidden" />
                  </label>
                </div>
                {memoryPhotos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {memoryPhotos.map((photo, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                        <img src={photo} alt="kenangan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setMemoryPhotos(memoryPhotos.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Simpan Kenangan
                </button>
              </div>
            </form>
          )}

          {/* Section: Throwback Memories (Kenangan Pada Tanggal Ini di Tahun Sebelumnya) */}
          {throwbackMemories.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>KENANGAN PADA TANGGAL INI</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">Foto dan catatan berharga di tanggal yang sama di tahun sebelumnya:</p>
              
              <div className="space-y-2.5">
                {throwbackMemories.map(m => (
                  <div key={m.id} className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex gap-3">
                    {m.photos && m.photos[0] && (
                      <img src={m.photos[0]} alt={m.title} className="w-16 h-16 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate">{m.title}</h4>
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{m.dateString.substring(0, 4)}</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-0.5">{m.story}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Reminders list on this date */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Pengingat & Alarm ({reminders.length})</span>
              </h3>
            </div>

            {reminders.length === 0 ? (
              <p className="text-xs text-stone-400 dark:text-stone-500 italic py-1">Tidak ada reminder untuk tanggal ini.</p>
            ) : (
              <div className="space-y-2">
                {reminders.map(rem => (
                  <div 
                    key={rem.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      rem.isCompleted 
                        ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60' 
                        : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-900/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        toggleReminderComplete(rem.id);
                        onRefreshData();
                      }}
                      className="mt-0.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      title={rem.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
                    >
                      {rem.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${rem.isCompleted ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-100'}`}>
                          {rem.title}
                        </span>
                        {rem.isImportant && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          {rem.time}
                        </span>
                        {rem.repeat !== 'once' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-medium">
                            {rem.repeat === 'daily' ? 'Harian' : rem.repeat === 'weekly' ? 'Mingguan' : rem.repeat === 'monthly' ? 'Bulanan' : 'Tahunan'}
                          </span>
                        )}
                        {rem.notes && <span className="truncate max-w-xs">{rem.notes}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteReminder(rem.id);
                        onRefreshData();
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded-lg"
                      title="Hapus reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Notes list on this date */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Catatan Harian ({notes.length})</span>
              </h3>
            </div>

            {notes.length === 0 ? (
              <p className="text-xs text-stone-400 dark:text-stone-500 italic py-1">Belum ada catatan pada tanggal ini.</p>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div 
                    key={note.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            {note.title}
                          </h4>
                          {note.isImportant && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                              ⭐ Penting
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{note.category}</span>
                          {note.time && <span>• {note.time}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditNote(note)}
                          className="p-1.5 text-stone-400 hover:text-blue-600 rounded-lg"
                          title="Edit Catatan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteNote(note.id);
                            onRefreshData();
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                      {note.content}
                    </p>

                    {note.photos && note.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {note.photos.map((imgUrl, i) => (
                          <div key={i} className="h-24 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                            <img src={imgUrl} alt={note.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Memories on this date */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                <Camera className="w-4 h-4 text-purple-500" />
                <span>Kenangan & Foto ({memories.length})</span>
              </h3>
            </div>

            {memories.length === 0 ? (
              <p className="text-xs text-stone-400 dark:text-stone-500 italic py-1">Belum ada album kenangan untuk tanggal ini.</p>
            ) : (
              <div className="space-y-3">
                {memories.map(mem => (
                  <div 
                    key={mem.id}
                    className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {mem.title}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          deleteMemory(mem.id);
                          onRefreshData();
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      "{mem.story}"
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                      {mem.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {mem.location}
                        </span>
                      )}
                      {mem.attendees && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-500" />
                          {mem.attendees}
                        </span>
                      )}
                    </div>

                    {mem.photos && mem.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                        {mem.photos.map((photoUrl, i) => (
                          <div key={i} className="h-28 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700">
                            <img src={photoUrl} alt="kenangan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
