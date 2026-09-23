import React from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar as CalendarIcon, 
  Sparkles, Star, Bell, BookOpen, Camera, Info, MessageCircle 
} from 'lucide-react';
import { DayCalendarInfo, HeaderPhotoConfig, NoteItem, ReminderItem, MemoryItem } from '../types';
import { HeaderPhoto } from './HeaderPhoto';
import { MONTH_NAMES_ID, getMonthCalendar, SUPPORTED_YEARS, getDayInfo } from '../utils/calendarEngine';

interface MainCalendarViewProps {
  currentYear: number;
  currentMonth: number; // 0-11
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear?: () => void;
  onNextYear?: () => void;
  onGoToday: () => void;
  onSelectMonthYear: (year: number, month: number) => void;
  onSelectDate: (day: DayCalendarInfo) => void;
  headerConfig: HeaderPhotoConfig;
  onUpdateHeaderPhoto: (cfg: HeaderPhotoConfig) => void;
  notes: NoteItem[];
  reminders: ReminderItem[];
  memories: MemoryItem[];
  onOpenShareModal?: () => void;
}

export const MainCalendarView: React.FC<MainCalendarViewProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onGoToday,
  onSelectMonthYear,
  onSelectDate,
  headerConfig,
  onUpdateHeaderPhoto,
  notes,
  reminders,
  memories,
  onOpenShareModal,
}) => {
  const days = getMonthCalendar(currentYear, currentMonth);

  // Group items by dateString for ultra-fast lookup
  const notesByDate = React.useMemo(() => {
    const map = new Map<string, NoteItem[]>();
    notes.forEach(n => {
      const arr = map.get(n.dateString) || [];
      arr.push(n);
      map.set(n.dateString, arr);
    });
    return map;
  }, [notes]);

  const remindersByDate = React.useMemo(() => {
    const map = new Map<string, ReminderItem[]>();
    reminders.forEach(r => {
      const arr = map.get(r.dateString) || [];
      arr.push(r);
      map.set(r.dateString, arr);
    });
    return map;
  }, [reminders]);

  const memoriesByDate = React.useMemo(() => {
    const map = new Map<string, MemoryItem[]>();
    memories.forEach(m => {
      const arr = map.get(m.dateString) || [];
      arr.push(m);
      map.set(m.dateString, arr);
    });
    return map;
  }, [memories]);

  // Javanese and national holidays for this month
  const monthHolidays = days.filter(d => d.isCurrentMonth && d.holidayName);

  // Dynamic Hijri and Jawa calendar info for current month and year
  const firstDayInfo = React.useMemo(() => getDayInfo(new Date(currentYear, currentMonth, 1)), [currentYear, currentMonth]);
  const lastDayInfo = React.useMemo(() => getDayInfo(new Date(currentYear, currentMonth + 1, 0)), [currentYear, currentMonth]);
  const hijriSubtitle = firstDayInfo.hijriYear === lastDayInfo.hijriYear
    ? `${firstDayInfo.hijriMonthName} – ${lastDayInfo.hijriMonthName} ${firstDayInfo.hijriYear} H`
    : `${firstDayInfo.hijriMonthName} ${firstDayInfo.hijriYear} H – ${lastDayInfo.hijriMonthName} ${lastDayInfo.hijriYear} H`;
  const jawaSubtitle = `Tahun Jawa ${firstDayInfo.jawaYear}`;

  return (
    <div id="main-calendar-container" className="space-y-4">
      {/* 1. Header Photo Section */}
      <HeaderPhoto
        config={headerConfig}
        onUpdate={onUpdateHeaderPhoto}
      />

      {/* 2. Month Navigation & Controls Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Month & Year Title with Selectors */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <select
                  value={currentMonth}
                  aria-label="Pilih Bulan"
                  onChange={(e) => onSelectMonthYear(currentYear, parseInt(e.target.value, 10))}
                  className="text-xl sm:text-2xl font-black bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 rounded-xl px-2 py-1 border border-stone-300 dark:border-stone-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {MONTH_NAMES_ID.map((mName, mIdx) => (
                    <option key={mIdx} value={mIdx} className="bg-white dark:bg-stone-900 text-sm font-semibold">
                      {mName}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  aria-label="Pilih Tahun"
                  onChange={(e) => onSelectMonthYear(parseInt(e.target.value, 10), currentMonth)}
                  className="text-xl sm:text-2xl font-black bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl px-2 py-1 border border-amber-500/30 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {SUPPORTED_YEARS.map((yVal) => (
                    <option key={yVal} value={yVal} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm font-bold">
                      {yVal}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">
                {hijriSubtitle} • {jawaSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
            {onPrevYear && (
              <button
                type="button"
                onClick={onPrevYear}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center gap-1"
                title="Tahun Sebelumnya"
              >
                <ChevronsLeft className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                <span className="text-xs font-semibold hidden md:inline">Thn Lalu</span>
              </button>
            )}

            <button
              type="button"
              onClick={onPrevMonth}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center gap-1"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={onGoToday}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
              title="Kembali ke Tanggal Hari Ini"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Hari Ini</span>
            </button>

            <button
              type="button"
              onClick={onNextMonth}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center gap-1"
              title="Bulan Berikutnya"
            >
              <span className="text-xs font-semibold hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onNextYear && (
              <button
                type="button"
                onClick={onNextYear}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-all active:scale-95 flex items-center gap-1"
                title="Tahun Berikutnya"
              >
                <span className="text-xs font-semibold hidden md:inline">Thn Depan</span>
                <ChevronsRight className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              </button>
            )}

            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all active:scale-95 flex items-center gap-1.5"
                title="Bagikan ke WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold hidden md:inline">Bagi WA</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Year Selector Pills 2025 - 2050 */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider shrink-0">
            Tahun (2025–2050):
          </span>
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
            {SUPPORTED_YEARS.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => onSelectMonthYear(yr, currentMonth)}
                className={`px-3 py-1 text-xs rounded-xl font-bold transition-all shrink-0 ${
                  yr === currentYear
                    ? 'bg-amber-600 text-white shadow-xs scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Month Selector Buttons */}
        <div className="flex gap-1.5 overflow-x-auto pt-1 no-scrollbar pb-0.5">
          {MONTH_NAMES_ID.map((name, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectMonthYear(currentYear, idx)}
              className={`px-2.5 py-1 text-xs rounded-xl font-semibold shrink-0 transition-all ${
                idx === currentMonth
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {name.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Calendar Grid Card */}
      <div className="p-3 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        {/* Day-of-week Headers (Starting Sunday / Minggu) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {[
            { label: 'MINGGU', jawa: 'Ahad', isRed: true },
            { label: 'SENIN', jawa: 'Senen', isRed: false },
            { label: 'SELASA', jawa: 'Seloso', isRed: false },
            { label: 'RABU', jawa: 'Rebo', isRed: false },
            { label: 'KAMIS', jawa: 'Kemis', isRed: false },
            { label: 'JUMAT', jawa: 'Jemuwah', isRed: false },
            { label: 'SABTU', jawa: 'Setu', isRed: false },
          ].map((col, idx) => (
            <div
              key={idx}
              className={`py-2 px-1 rounded-xl text-center ${
                col.isRed 
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold' 
                  : 'bg-stone-50/80 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 font-semibold'
              }`}
            >
              <div className="text-[11px] sm:text-xs tracking-wider">{col.label}</div>
              <div className="text-[9px] sm:text-[10px] opacity-75 font-normal">{col.jawa}</div>
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day) => {
            const dayNotes = notesByDate.get(day.dateString) || [];
            const dayReminders = remindersByDate.get(day.dateString) || [];
            const dayMemories = memoriesByDate.get(day.dateString) || [];
            const hasImportant = dayNotes.some(n => n.isImportant) || dayReminders.some(r => r.isImportant);
            const totalItems = dayNotes.length + dayReminders.length + dayMemories.length;

            const isSunday = day.dayOfWeek === 0;
            const isNationalHoliday = !!day.holidayName;
            const isRedDate = isSunday || isNationalHoliday;

            return (
              <div
                key={day.dateString}
                onClick={() => onSelectDate(day)}
                className={`relative min-h-[78px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left select-none group active:scale-[0.97] ${
                  !day.isCurrentMonth
                    ? 'opacity-35 bg-stone-50/30 dark:bg-stone-900/30 border-dashed border-stone-200 dark:border-stone-800'
                    : day.isToday
                    ? 'bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent border-2 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                    : isNationalHoliday
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                    : 'bg-white dark:bg-stone-800/60 border-stone-200/90 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-xs'
                }`}
              >
                {/* Top: Date Numbers and Indicators */}
                <div className="flex items-start justify-between">
                  {/* Masehi Large Number */}
                  <span
                    className={`text-base sm:text-xl font-black leading-none ${
                      day.isToday
                        ? 'text-amber-600 dark:text-amber-400'
                        : isRedDate
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-stone-800 dark:text-stone-100'
                    }`}
                  >
                    {day.dayOfMonth}
                  </span>

                  {/* Star or Holiday indicator */}
                  <div className="flex items-center gap-0.5">
                    {hasImportant && (
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                    )}
                    {isNationalHoliday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title={day.holidayName} />
                    )}
                  </div>
                </div>

                {/* Middle: Hijriyah and Pasaran Jawa (Stacked neatly, non-overlapping) */}
                <div className="my-1 space-y-0.5">
                  {/* Tanggal Hijriyah */}
                  <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate leading-tight">
                    {day.hijriDay} {day.hijriMonthName.split(' ')[0]}
                  </div>

                  {/* Pasaran Jawa */}
                  <div className="text-[9px] sm:text-[10px] font-medium text-amber-800 dark:text-amber-300 leading-tight">
                    {day.pasaran}
                  </div>

                  {/* Hari Jawa */}
                  <div className="text-[8px] sm:text-[9px] text-stone-400 dark:text-stone-500 leading-none hidden sm:block">
                    {day.dayNameJawa}
                  </div>
                </div>

                {/* Bottom: Event Badges & Dots */}
                <div className="flex items-center gap-1 min-h-[14px]">
                  {dayReminders.length > 0 && (
                    <span 
                      className="flex items-center gap-0.5 px-1 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      title={`${dayReminders.length} Reminder`}
                    >
                      <Bell className="w-2.5 h-2.5" />
                      <span>{dayReminders.length}</span>
                    </span>
                  )}

                  {dayNotes.length > 0 && (
                    <span 
                      className="flex items-center gap-0.5 px-1 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300"
                      title={`${dayNotes.length} Catatan`}
                    >
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>{dayNotes.length}</span>
                    </span>
                  )}

                  {dayMemories.length > 0 && (
                    <span 
                      className="flex items-center gap-0.5 px-1 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300"
                      title={`${dayMemories.length} Kenangan`}
                    >
                      <Camera className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Holiday & Legend Footer for this month */}
        {monthHolidays.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-500" />
              <span>Hari Libur Nasional Bulan Ini:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {monthHolidays.map(h => (
                <div 
                  key={h.dateString}
                  onClick={() => onSelectDate(h)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 cursor-pointer hover:bg-rose-100/80 transition-colors"
                >
                  <span className="font-extrabold shrink-0 w-6 text-center">{h.dayOfMonth}</span>
                  <span className="font-medium truncate">{h.holidayName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Summary Info Banner */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Ketuk tanggal mana saja</strong> untuk melihat detail Hijriyah, Pasaran Jawa, serta menambah catatan, reminder, foto, dan kenangan keluarga.
          </span>
        </div>
      </div>
    </div>
  );
};
