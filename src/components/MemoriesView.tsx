import React, { useState } from 'react';
import { 
  Camera, Plus, Calendar, MapPin, Users, Trash2, 
  Sparkles, Image as ImageIcon, X, ChevronRight, Eye 
} from 'lucide-react';
import { MemoryItem } from '../types';
import { addMemory, deleteMemory } from '../utils/storage';
import { formatDateFullIndonesian, MONTH_NAMES_ID } from '../utils/calendarEngine';

interface MemoriesViewProps {
  memories: MemoryItem[];
  onRefreshData: () => void;
  onSelectDateString?: (dateString: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  memories,
  onRefreshData,
  onSelectDateString
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [dateString, setDateString] = useState('2027-01-01');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  // Check today throwback
  const today = new Date();
  const todayMonthStr = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDayStr = today.getDate().toString().padStart(2, '0');

  // Throwback memories: any memory whose month & day match today, or recent throwback
  const todayThrowbacks = memories.filter(m => {
    const [, mMonth, mDay] = m.dateString.split('-');
    return mMonth === todayMonthStr && mDay === todayDayStr;
  });

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

  const handleOpenAddModal = () => {
    setTitle('');
    setStory('');
    setDateString(new Date().toISOString().split('T')[0]);
    setLocation('');
    setAttendees('');
    setPhotos([]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMemory({
      title,
      story,
      dateString,
      location,
      attendees,
      photos
    });

    setIsModalOpen(false);
    onRefreshData();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4" />
              <span>ALBUM KENANGAN & MOMEN KELUARGA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              Kenangan Digital
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Simpan foto berharga, kisah manis, lokasi wisata, dan momen kebersamaan keluarga.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kenangan</span>
          </button>
        </div>

        {/* Kenangan Hari Ini / Throwback Feature */}
        {todayThrowbacks.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-transparent border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>KENANGAN PADA TANGGAL INI</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
              Momen manis yang terjadi pada tanggal hari ini di masa lalu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayThrowbacks.map(tb => (
                <div key={tb.id} className="p-3 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 flex gap-3 shadow-xs">
                  {tb.photos && tb.photos[0] && (
                    <img 
                      src={tb.photos[0]} 
                      alt={tb.title} 
                      onClick={() => setSelectedPhotoPreview(tb.photos[0])}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer" 
                    />
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">{tb.title}</h4>
                        <span className="text-[11px] font-bold text-amber-600">{tb.dateString.substring(0, 4)}</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">{tb.story}</p>
                    </div>
                    {tb.location && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 truncate mt-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{tb.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Memories Timeline & Gallery Cards */}
      {memories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Belum ada album kenangan</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Abadikan momen foto keluarga dan cerita bahagia Anda untuk dikenang selamanya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {memories.map(mem => (
            <div
              key={mem.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 leading-snug">
                      {mem.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onSelectDateString && onSelectDateString(mem.dateString)}
                      className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline mt-0.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDateFullIndonesian(mem.dateString)}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      deleteMemory(mem.id);
                      onRefreshData();
                    }}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    title="Hapus Kenangan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Story */}
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic bg-purple-50/40 dark:bg-purple-950/20 p-3 rounded-2xl border border-purple-100/80 dark:border-purple-900/40">
                  "{mem.story}"
                </p>

                {/* Location & Attendees */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                  {mem.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="font-medium">{mem.location}</span>
                    </div>
                  )}

                  {mem.attendees && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium">{mem.attendees}</span>
                    </div>
                  )}
                </div>

                {/* Photo Gallery Grid */}
                {mem.photos && mem.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {mem.photos.map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhotoPreview(photoUrl)}
                        className="relative h-28 rounded-2xl overflow-hidden shadow-xs cursor-pointer group border border-stone-200 dark:border-stone-700"
                      >
                        <img
                          src={photoUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Photo Preview */}
      {selectedPhotoPreview && (
        <div 
          onClick={() => setSelectedPhotoPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
            <img src={selectedPhotoPreview} alt="Pratinjau Foto" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            <button
              type="button"
              onClick={() => setSelectedPhotoPreview(null)}
              className="absolute top-3 right-3 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Tambah Kenangan Baru
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
                  Judul Kenangan:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Piknik Akhir Tahun ke Pantai, Sunatan Adik..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Kisah / Cerita Kenangan:
                </label>
                <textarea
                  rows={3}
                  required
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Ceritakan momen seru dan berharga yang dirasakan bersama keluarga..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Tanggal Kejadian:
                </label>
                <input
                  type="date"
                  required
                  value={dateString}
                  onChange={(e) => setDateString(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Lokasi:
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Malioboro, Rumah Eyang..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                    Orang yang Hadir:
                  </label>
                  <input
                    type="text"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="Contoh: Ayah, Ibu, Dimas..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              {/* Photos upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    Foto Kenangan (Bisa beberapa foto):
                  </span>
                  <label className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 cursor-pointer font-bold">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>+ Pilih Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
                {photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                        <img src={img} alt="kenangan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Simpan Kenangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
