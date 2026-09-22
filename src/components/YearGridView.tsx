import React from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { MONTH_NAMES_ID, getMonthCalendar, SUPPORTED_YEARS, getDayInfo } from '../utils/calendarEngine';
import { NoteItem, ReminderItem, MemoryItem } from '../types';

interface YearGridViewProps {
  year: number;
  onSelectYear?: (year: number) => void;
  onSelectMonth: (monthIndex: number) => void;
  notes: NoteItem[];
  reminders: ReminderItem[];
  memories: MemoryItem[];
  onOpenShareModal?: () => void;
}

export const YearGridView: React.FC<YearGridViewProps> = ({
  year,
  onSelectYear,
  onSelectMonth,
  notes,
  reminders,
  memories,
  onOpenShareModal
}) => {
  // Pre-calculate items per month
  const countsByMonth = React.useMemo(() => {
    const counts = Array(12).fill(0);
    const processItem = (dateString: string) => {
      const [y, m] = dateString.split('-').map(Number);
      if (y === year && m >= 1 && m <= 12) {
        counts[m - 1]++;
      }
    };
    notes.forEach(n => processItem(n.dateString));
    reminders.forEach(r => processItem(r.dateString));
    memories.forEach(m => processItem(m.dateString));
    return counts;
  }, [year, notes, reminders, memories]);

  // Dynamic Hijri & Jawa range for current year
  const yearStartInfo = React.useMemo(() => getDayInfo(new Date(year, 0, 1)), [year]);
  const yearEndInfo = React.useMemo(() => getDayInfo(new Date(year, 11, 31)), [year]);
  const hijriYearText = `${yearStartInfo.hijriYear}–${yearEndInfo.hijriYear} Hijriyah`;
  const jawaYearText = `Tahun Jawa ${yearStartInfo.jawaYear}–${yearEndInfo.jawaYear}`;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span>KALENDER LENGKAP 12 BULAN (2025–2030)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              Tahun {year} Masehi
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {hijriYearText} • {jawaYearText} • Ketuk salah satu bulan untuk membuka tampilan tanggal harian.
            </p>
          </div>

          {/* Navigation Prev/Next Year */}
          {onSelectYear && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectYear(year - 1)}
                disabled={year <= 2025}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1 text-xs font-bold"
                title="Tahun Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{year - 1}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectYear(year + 1)}
                disabled={year >= 2030}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none border border-stone-200 dark:border-stone-700 transition-all flex items-center gap-1 text-xs font-bold"
                title="Tahun Berikutnya"
              >
                <span>{year + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {onOpenShareModal && (
                <button
                  type="button"
                  onClick={onOpenShareModal}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all flex items-center gap-1.5 text-xs font-bold"
                  title="Bagikan Kalender ke WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Bagi WA</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Year Pills 2025 - 2030 */}
        {onSelectYear && (
          <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider shrink-0">
              Pilih Tahun:
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {SUPPORTED_YEARS.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onSelectYear(yr)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all shrink-0 ${
                    yr === year
                      ? 'bg-amber-600 text-white shadow-xs scale-105'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 12 Months Grid (3x4 on desktop, 2x6 on tablet, 1x12 on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MONTH_NAMES_ID.map((monthName, mIdx) => {
          const days = getMonthCalendar(year, mIdx);
          const itemCount = countsByMonth[mIdx];

          return (
            <div
              key={mIdx}
              onClick={() => onSelectMonth(mIdx)}
              className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Month Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                    {mIdx + 1}
                  </span>
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {monthName}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {itemCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white shadow-xs">
                      {itemCount} agenda
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>

              {/* Day initials */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold mb-1.5 text-stone-400">
                <span className="text-rose-500">M</span>
                <span>S</span>
                <span>S</span>
                <span>R</span>
                <span>K</span>
                <span>J</span>
                <span>S</span>
              </div>

              {/* Mini Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className={`py-1 text-[11px] rounded-md transition-colors ${
                      !d.isCurrentMonth
                        ? 'opacity-20 text-stone-400'
                        : d.isToday
                        ? 'bg-amber-500 text-white font-black rounded-full'
                        : d.isHoliday
                        ? 'text-rose-600 font-bold'
                        : 'text-stone-700 dark:text-stone-300 font-medium'
                    }`}
                  >
                    {d.dayOfMonth}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
