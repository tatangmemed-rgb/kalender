import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, Clock, Star, Sparkles, Smartphone, 
  Wifi, Battery, CheckCircle2, ChevronRight, Eye, RefreshCw 
} from 'lucide-react';
import { WidgetSize, HeaderPhotoConfig, ReminderItem, DayCalendarInfo } from '../types';
import { getDayInfo, MONTH_NAMES_ID } from '../utils/calendarEngine';

interface AndroidWidgetSimulatorProps {
  headerConfig: HeaderPhotoConfig;
  reminders: ReminderItem[];
  onOpenDateDetail: (day: DayCalendarInfo) => void;
  onOpenReminders: () => void;
}

const WALLPAPERS = [
  { name: 'Gradient Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop' },
  { name: 'Dark Twilight', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop' },
  { name: 'Alam Pegunungan', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' },
];

export const AndroidWidgetSimulator: React.FC<AndroidWidgetSimulatorProps> = ({
  headerConfig,
  reminders,
  onOpenDateDetail,
  onOpenReminders
}) => {
  const [selectedSize, setSelectedSize] = useState<WidgetSize>('4x2');
  const [wallpaperIdx, setWallpaperIdx] = useState(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [simulatedTime, setSimulatedTime] = useState<string>('09:41');

  // Automatic real-time clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now);
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setSimulatedTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayInfo = getDayInfo(currentDate);

  // Active uncompleted reminders
  const activeReminders = reminders.filter(r => !r.isCompleted);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>WIDGET ANDROID HOME SCREEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50">
              Simulasi Widget Smartphone
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Lihat tampilan widget interaktif dalam berbagai ukuran di layar utama Android.
            </p>
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            {(['1x1', '2x2', '4x2', '4x4'] as WidgetSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedSize === size
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Wallpaper Picker */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Ganti Wallpaper Layar HP:</span>
          <div className="flex gap-2">
            {WALLPAPERS.map((wp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setWallpaperIdx(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  wallpaperIdx === idx
                    ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                {wp.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Android Device Mockup Frame */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-[390px] h-[680px] rounded-[44px] p-3.5 bg-stone-900 shadow-2xl border-4 border-stone-800 overflow-hidden ring-1 ring-white/10 flex flex-col select-none">
          {/* Wallpaper background */}
          <img
            src={WALLPAPERS[wallpaperIdx].url}
            alt="Android Wallpaper"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dimming */}
          <div className="absolute inset-0 bg-stone-950/25 pointer-events-none" />

          {/* Android Status Bar */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-1 text-white text-xs font-semibold">
            <span>{simulatedTime}</span>
            <div className="w-20 h-4 bg-stone-950/80 rounded-full mx-auto" /> {/* Camera cutout pill */}
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Home Screen Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-between py-4 px-2">
            {/* Top Google Search bar mockup */}
            <div className="px-3 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white/90 text-xs flex items-center justify-between shadow-sm">
              <span className="font-medium text-white/80">Google</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/70">🎤</span>
                <span className="text-[10px] text-white/70">📷</span>
              </div>
            </div>

            {/* THE WIDGET CONTAINER */}
            <div className="my-auto">
              {/* SIZE: 1x1 */}
              {selectedSize === '1x1' && (
                <div 
                  onClick={() => onOpenDateDetail(todayInfo)}
                  className="mx-auto w-32 h-32 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl p-3 shadow-xl border border-white/40 dark:border-stone-700/60 cursor-pointer hover:scale-105 transition-all text-center flex flex-col justify-between"
                >
                  <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    {todayInfo.dayNameMasehi}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-stone-900 dark:text-stone-50 leading-none">
                      {todayInfo.dayOfMonth}
                    </div>
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {todayInfo.pasaran}
                    </div>
                  </div>
                  <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                    {todayInfo.hijriDay} {todayInfo.hijriMonthName.split(' ')[0]}
                  </div>
                </div>
              )}

              {/* SIZE: 2x2 */}
              {selectedSize === '2x2' && (
                <div 
                  onClick={() => onOpenDateDetail(todayInfo)}
                  className="mx-auto w-48 h-48 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl p-4 shadow-xl border border-white/40 dark:border-stone-700/60 cursor-pointer hover:scale-105 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      {todayInfo.dayNameMasehi}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-full">
                      {todayInfo.pasaran}
                    </span>
                  </div>

                  <div className="text-center my-1">
                    <div className="text-5xl font-black text-stone-900 dark:text-stone-50 leading-none">
                      {todayInfo.dayOfMonth}
                    </div>
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mt-1">
                      {MONTH_NAMES_ID[todayInfo.date.getMonth()]} {todayInfo.date.getFullYear()}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-stone-200/60 dark:border-stone-800">
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                      🌙 {todayInfo.hijriDay} {todayInfo.hijriMonthName} {todayInfo.hijriYear} H
                    </div>
                    {activeReminders.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        <Bell className="w-3 h-3" />
                        <span>{activeReminders.length} Reminder aktif</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SIZE: 4x2 (Wide Layout - Exactly as in Prompt Diagram!) */}
              {selectedSize === '4x2' && (
                <div 
                  className="w-full rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl p-4 shadow-2xl border border-white/40 dark:border-stone-700/60 transition-all hover:border-amber-400"
                >
                  <div className="flex gap-4">
                    {/* Left: Custom Family Photo or Calendar Graphic */}
                    <div 
                      onClick={() => onOpenDateDetail(todayInfo)}
                      className="relative w-28 h-32 rounded-2xl overflow-hidden shrink-0 shadow-md cursor-pointer group"
                    >
                      <img
                        src={headerConfig.photoUrl}
                        alt="Widget Foto"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-[9px] font-bold text-amber-300">KALENDERKU</span>
                        <span className="text-[10px] font-extrabold truncate">2027</span>
                      </div>
                    </div>

                    {/* Right: Date Info & Reminders */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div onClick={() => onOpenDateDetail(todayInfo)} className="cursor-pointer">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-black text-stone-900 dark:text-stone-50 leading-none">
                            {todayInfo.dayOfMonth}
                          </span>
                          <span className="text-xs font-bold text-rose-600 uppercase">
                            {todayInfo.dayNameMasehi}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                          {MONTH_NAMES_ID[todayInfo.date.getMonth()]} {todayInfo.date.getFullYear()}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold">
                          <span className="text-emerald-700 dark:text-emerald-400 truncate">
                            {todayInfo.hijriDay} {todayInfo.hijriMonthName.split(' ')[0]}
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-amber-700 dark:text-amber-400">
                            {todayInfo.pasaran}
                          </span>
                        </div>
                      </div>

                      {/* Reminder status / trigger */}
                      <div 
                        onClick={onOpenReminders}
                        className="mt-2 pt-2 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Bell className="w-3.5 h-3.5" />
                          <span>{activeReminders.length} Reminder</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIZE: 4x4 (Full Rich Calendar Widget) */}
              {selectedSize === '4x4' && (
                <div className="w-full rounded-3xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl p-4 shadow-2xl border border-white/40 dark:border-stone-700/60 space-y-3">
                  {/* Top Photo Cover */}
                  <div className="relative h-24 rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={headerConfig.photoUrl}
                      alt="Widget Cover"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/40 p-2.5 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[10px] text-amber-300 font-bold block">KALENDERKU 2027</span>
                        <span className="text-xs font-extrabold">{headerConfig.customCaption || 'Keluarga Harmonis'}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/30 backdrop-blur-xs font-bold">
                        {todayInfo.pasaran}
                      </span>
                    </div>
                  </div>

                  {/* Date details */}
                  <div onClick={() => onOpenDateDetail(todayInfo)} className="cursor-pointer flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-stone-900 dark:text-stone-50 leading-none">
                        {todayInfo.dayNameMasehi}, {todayInfo.dayOfMonth} {MONTH_NAMES_ID[todayInfo.date.getMonth()]}
                      </div>
                      <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                        🌙 {todayInfo.hijriDay} {todayInfo.hijriMonthName} {todayInfo.hijriYear} H • Pasaran: {todayInfo.pasaran}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
                      {todayInfo.dayOfMonth}
                    </div>
                  </div>

                  {/* Active Reminders List */}
                  <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800 space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-600 dark:text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Bell className="w-3 h-3 text-amber-500" />
                        <span>Pengingat ({activeReminders.length})</span>
                      </span>
                      <button onClick={onOpenReminders} className="text-[10px] text-amber-600 font-bold hover:underline">
                        Lihat Semua
                      </button>
                    </div>

                    {activeReminders.slice(0, 2).map(r => (
                      <div key={r.id} className="p-2 rounded-xl bg-amber-500/10 text-xs flex items-center justify-between">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">{r.title}</span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 shrink-0 ml-2">{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom App Dock Icons (Android standard) */}
            <div className="grid grid-cols-4 gap-3 px-3 py-2 rounded-3xl bg-white/20 backdrop-blur-md border border-white/20 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-md text-sm font-bold">
                  📞
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md text-sm font-bold">
                  💬
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md text-sm font-bold">
                  📅
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md text-sm font-bold">
                  📷
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Guide */}
      <div className="p-4 rounded-3xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 space-y-1">
        <p className="font-bold text-stone-800 dark:text-stone-100">
          💡 Fitur Widget Otomatis:
        </p>
        <p>
          Widget ini selalu tersinkronisasi otomatis dengan tanggal perangkat, memperbarui hitungan Pasaran Jawa dan Hijriyah setiap pergantian hari secara real-time.
        </p>
      </div>
    </div>
  );
};
