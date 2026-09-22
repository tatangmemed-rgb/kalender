import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Bell, BookOpen, Camera, 
  Star, Search, Filter, AlertCircle, Clock, MapPin, CheckCircle2 
} from 'lucide-react';
import { NoteItem, ReminderItem, MemoryItem, FilterCategory } from '../types';
import { formatDateFullIndonesian, HOLIDAYS_2027 } from '../utils/calendarEngine';

interface AgendaViewProps {
  notes: NoteItem[];
  reminders: ReminderItem[];
  memories: MemoryItem[];
  onSelectDateString?: (dateString: string) => void;
}

interface UnifiedAgendaItem {
  id: string;
  type: 'note' | 'reminder' | 'memory' | 'holiday';
  title: string;
  description?: string;
  dateString: string;
  time?: string;
  isImportant: boolean;
  category?: string;
  photos?: string[];
  isCompleted?: boolean;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  notes,
  reminders,
  memories,
  onSelectDateString
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterCategory>('all');

  // Compile unified chronological list
  const unifiedItems: UnifiedAgendaItem[] = React.useMemo(() => {
    const list: UnifiedAgendaItem[] = [];

    // 1. Reminders
    reminders.forEach(r => {
      list.push({
        id: 'r_' + r.id,
        type: 'reminder',
        title: r.title,
        description: r.notes,
        dateString: r.dateString,
        time: r.time,
        isImportant: r.isImportant,
        category: r.category,
        isCompleted: r.isCompleted
      });
    });

    // 2. Notes
    notes.forEach(n => {
      list.push({
        id: 'n_' + n.id,
        type: 'note',
        title: n.title,
        description: n.content,
        dateString: n.dateString,
        time: n.time,
        isImportant: n.isImportant,
        category: n.category,
        photos: n.photos
      });
    });

    // 3. Memories
    memories.forEach(m => {
      list.push({
        id: 'm_' + m.id,
        type: 'memory',
        title: m.title,
        description: m.story,
        dateString: m.dateString,
        isImportant: false,
        category: m.location,
        photos: m.photos
      });
    });

    // 4. National Holidays 2027
    Object.entries(HOLIDAYS_2027).forEach(([dateStr, name]) => {
      list.push({
        id: 'h_' + dateStr,
        type: 'holiday',
        title: name,
        description: 'Hari Libur Nasional Republik Indonesia',
        dateString: dateStr,
        isImportant: true,
        category: 'Libur Nasional'
      });
    });

    // Sort by dateString ascending
    list.sort((a, b) => a.dateString.localeCompare(b.dateString));
    return list;
  }, [notes, reminders, memories]);

  // Apply filters & search
  const filteredItems = unifiedItems.filter(item => {
    // Filter Category
    if (filterType === 'notes' && item.type !== 'note') return false;
    if (filterType === 'reminders' && item.type !== 'reminder') return false;
    if (filterType === 'memories' && item.type !== 'memory') return false;
    if (filterType === 'agenda' && (item.type !== 'reminder' && item.type !== 'note')) return false;
    if (filterType === 'important' && !item.isImportant) return false;
    if (filterType === 'photos' && (!item.photos || item.photos.length === 0)) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchDate = item.dateString.includes(q);
      const matchCat = item.category?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchDate || matchCat;
    }

    return true;
  });

  // Group filtered items by month/year for aesthetic chronological timeline
  const groupedByDate = React.useMemo(() => {
    const groups: { [dateStr: string]: UnifiedAgendaItem[] } = {};
    filteredItems.forEach(item => {
      if (!groups[item.dateString]) groups[item.dateString] = [];
      groups[item.dateString].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span>AGENDA & JADWAL KRONOLOGIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              Agenda Seluruh Kegiatan
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Urutan lengkap seluruh pengingat, catatan, hari libur, dan kenangan keluarga tahun 2027.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di semua agenda, reminder, catatan, dan libur..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:border-amber-500 font-medium"
          />
        </div>

        {/* Filter Chips (Semua, Catatan, Reminder, Agenda, Kenangan, Penting, Foto) */}
        <div className="flex gap-2 overflow-x-auto mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Semua Agenda' },
            { id: 'reminders', label: '🔔 Reminder' },
            { id: 'notes', label: '📝 Catatan' },
            { id: 'memories', label: '📸 Kenangan' },
            { id: 'important', label: '⭐ Penting' },
            { id: 'photos', label: '🖼️ Berfoto' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterType(item.id as FilterCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterType === item.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline Groups */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Tidak ada agenda sesuai filter</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Coba pilih filter lain atau hapus kata kunci di kolom pencarian.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateStr, items]) => (
            <div key={dateStr} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectDateString && onSelectDateString(dateStr)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-amber-500/20 transition-colors cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-amber-600" />
                  <span>{formatDateFullIndonesian(dateStr)}</span>
                </button>
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
              </div>

              {/* Items for this date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map(item => {
                  const isReminder = item.type === 'reminder';
                  const isNote = item.type === 'note';
                  const isMemory = item.type === 'memory';
                  const isHoliday = item.type === 'holiday';

                  const badgeColor = 
                    isHoliday ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' :
                    isReminder ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' :
                    isNote ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' :
                    'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectDateString && onSelectDateString(item.dateString)}
                      className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/60 transition-all cursor-pointer flex items-start gap-3 group"
                    >
                      {/* Icon */}
                      <div className={`p-2.5 rounded-2xl shrink-0 ${badgeColor} border`}>
                        {isHoliday && <AlertCircle className="w-4 h-4" />}
                        {isReminder && <Bell className="w-4 h-4" />}
                        {isNote && <BookOpen className="w-4 h-4" />}
                        {isMemory && <Camera className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate group-hover:text-amber-600 transition-colors">
                            {item.title}
                          </h4>
                          {item.isImportant && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-2 font-medium">
                          {item.time && (
                            <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
                              <Clock className="w-3 h-3" />
                              <span>{item.time} WIB</span>
                            </span>
                          )}
                          {item.category && (
                            <span className="truncate">{item.category}</span>
                          )}
                          {item.photos && item.photos.length > 0 && (
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              📷 {item.photos.length} Foto
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
