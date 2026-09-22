import React, { useState } from 'react';
import { Search, X, Calendar, Bell, BookOpen, Camera, Star, ArrowRight } from 'lucide-react';
import { NoteItem, ReminderItem, MemoryItem } from '../types';
import { formatDateFullIndonesian } from '../utils/calendarEngine';

interface SearchModalProps {
  notes: NoteItem[];
  reminders: ReminderItem[];
  memories: MemoryItem[];
  onClose: () => void;
  onSelectDateString: (dateString: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  notes,
  reminders,
  memories,
  onClose,
  onSelectDateString
}) => {
  const [query, setQuery] = useState('');

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: Array<{
      type: 'note' | 'reminder' | 'memory';
      id: string;
      title: string;
      snippet: string;
      dateString: string;
      isImportant?: boolean;
    }> = [];

    // Search Notes
    notes.forEach(n => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.dateString.includes(q)
      ) {
        items.push({
          type: 'note',
          id: n.id,
          title: n.title,
          snippet: n.content,
          dateString: n.dateString,
          isImportant: n.isImportant
        });
      }
    });

    // Search Reminders
    reminders.forEach(r => {
      if (
        r.title.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        r.dateString.includes(q)
      ) {
        items.push({
          type: 'reminder',
          id: r.id,
          title: r.title,
          snippet: r.notes || `Waktu: ${r.time} WIB`,
          dateString: r.dateString,
          isImportant: r.isImportant
        });
      }
    });

    // Search Memories
    memories.forEach(m => {
      if (
        m.title.toLowerCase().includes(q) ||
        m.story.toLowerCase().includes(q) ||
        (m.location && m.location.toLowerCase().includes(q)) ||
        (m.attendees && m.attendees.toLowerCase().includes(q)) ||
        m.dateString.includes(q)
      ) {
        items.push({
          type: 'memory',
          id: m.id,
          title: m.title,
          snippet: m.story,
          dateString: m.dateString
        });
      }
    });

    return items;
  }, [query, notes, reminders, memories]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
      <div 
        id="search-modal"
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari catatan, reminder, kenangan, acara, atau tanggal..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden font-medium text-stone-900 dark:text-stone-100 placeholder-stone-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-2 py-1 rounded-lg"
          >
            Tutup
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-stone-400 space-y-2">
              <p>Ketik kata kunci pencarian, misalnya:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['ulang tahun', 'listrik', 'keluarga', '2027', 'pengajian', 'piknik'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setQuery(sug)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold hover:bg-amber-500/10 hover:text-amber-600"
                  >
                    "{sug}"
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Tidak ada hasil yang cocok dengan "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2">
                Ditemukan {results.length} hasil:
              </p>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectDateString(item.dateString);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border border-stone-200/80 dark:border-stone-700/80 hover:border-amber-400 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl mt-0.5 shrink-0 bg-white dark:bg-stone-700 shadow-xs text-amber-600">
                      {item.type === 'note' && <BookOpen className="w-4 h-4 text-blue-500" />}
                      {item.type === 'reminder' && <Bell className="w-4 h-4 text-amber-500" />}
                      {item.type === 'memory' && <Camera className="w-4 h-4 text-purple-500" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h4>
                        {item.isImportant && (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {item.snippet}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateFullIndonesian(item.dateString)}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 transition-colors shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
