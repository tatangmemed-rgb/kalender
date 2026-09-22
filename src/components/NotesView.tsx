import React, { useState } from 'react';
import { 
  BookOpen, Star, Plus, Search, Trash2, Edit2, 
  Calendar, Clock, Tag, X, Image as ImageIcon, Sparkles 
} from 'lucide-react';
import { NoteItem, CategoryType } from '../types';
import { addNote, updateNote, deleteNote } from '../utils/storage';
import { formatDateFullIndonesian } from '../utils/calendarEngine';

interface NotesViewProps {
  notes: NoteItem[];
  onRefreshData: () => void;
  onSelectDateString?: (dateString: string) => void;
}

const CATEGORIES: CategoryType[] = ['Keluarga', 'Pekerjaan', 'Pribadi', 'Ibadah', 'Kesehatan', 'Keuangan', 'Lainnya'];

export const NotesView: React.FC<NotesViewProps> = ({ notes, onRefreshData, onSelectDateString }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyImportant, setOnlyImportant] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dateString, setDateString] = useState('2027-01-01');
  const [time, setTime] = useState('09:00');
  const [category, setCategory] = useState<CategoryType>('Keluarga');
  const [isImportant, setIsImportant] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setDateString(new Date().toISOString().split('T')[0]);
    setTime('09:00');
    setCategory('Keluarga');
    setIsImportant(false);
    setPhotos([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setDateString(note.dateString);
    setTime(note.time || '09:00');
    setCategory(note.category);
    setIsImportant(note.isImportant);
    setPhotos(note.photos || []);
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos([...photos, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, {
        title,
        content,
        dateString,
        time,
        category,
        isImportant,
        photos
      });
    } else {
      addNote({
        title,
        content,
        dateString,
        time,
        category,
        isImportant,
        photos
      });
    }

    setIsModalOpen(false);
    onRefreshData();
  };

  // Filter notes
  const filteredNotes = notes.filter(n => {
    if (onlyImportant && !n.isImportant) return false;
    if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchDate = n.dateString.includes(q);
      const matchCat = n.category.toLowerCase().includes(q);
      return matchTitle || matchContent || matchDate || matchCat;
    }
    return true;
  });

  const importantCount = notes.filter(n => n.isImportant).length;

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>CATATAN HARIAN & PENTING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              Buku Catatan Digital
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Simpan catatan kegiatan, informasi keluarga, pekerjaan, dan catatan penting tahun 2027.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catatan Baru</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, isi catatan, kategori, atau tanggal..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:border-blue-500 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setOnlyImportant(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all' && !onlyImportant
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            Semua ({notes.length})
          </button>

          <button
            type="button"
            onClick={() => setOnlyImportant(!onlyImportant)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
              onlyImportant
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Penting ({importantCount})</span>
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => { setSelectedCategory(cat); setOnlyImportant(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat && !onlyImportant
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Tidak ada catatan ditemukan</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {searchQuery ? 'Coba ubah kata kunci pencarian.' : 'Ketuk tombol "+ Catatan Baru" untuk membuat catatan pertama Anda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`p-5 rounded-3xl bg-white dark:bg-stone-900 border transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-3 ${
                note.isImportant
                  ? 'border-amber-400 dark:border-amber-600/70 bg-gradient-to-br from-amber-50/20 via-white to-transparent dark:from-amber-950/10'
                  : 'border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50 leading-snug">
                      {note.title}
                    </h3>
                    {note.isImportant && (
                      <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </span>
                    )}
                  </div>

                  {/* Date & Category */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <button
                      type="button"
                      onClick={() => onSelectDateString && onSelectDateString(note.dateString)}
                      className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateFullIndonesian(note.dateString)}</span>
                    </button>
                    {note.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{note.time}</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold text-[11px]">
                      {note.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(note)}
                    className="p-1.5 text-stone-400 hover:text-blue-600 rounded-lg transition-colors"
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
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                {note.content}
              </p>

              {/* Photos attached */}
              {note.photos && note.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-1 pb-1">
                  {note.photos.map((img, i) => (
                    <div key={i} className="h-20 w-24 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                      <img src={img} alt="lampiran" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {editingNote ? 'Edit Catatan' : 'Tambah Catatan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Judul Catatan:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rapat Wali Murid, Arisan Keluarga..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Isi Catatan:
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan catatan harian secara rinci di sini..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Tanggal:
                  </label>
                  <input
                    type="date"
                    required
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Waktu:
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Kategori:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2 font-bold text-amber-700 dark:text-amber-400">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="rounded accent-amber-500 w-4 h-4"
                    />
                    <span>⭐ Tandai Penting</span>
                  </label>
                </div>
              </div>

              {/* Photos */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Foto Lampiran:</span>
                  <label className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-bold">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ Unggah Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
                {photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                        <img src={img} alt="lampiran" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  {editingNote ? 'Perbarui' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
