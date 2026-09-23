import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, BookOpen, Bell, Camera, 
  Home, Search, Smartphone, Settings, Sparkles, Plus, 
  Moon, Sun, ListFilter, AlertCircle, Share2, Check, Download, FolderDown, MessageCircle 
} from 'lucide-react';
import { 
  ActiveTab, DayCalendarInfo, HeaderPhotoConfig, 
  MemoryItem, NoteItem, ReminderItem, ThemePreference 
} from './types';
import { 
  getStoredNotes, getStoredReminders, getStoredMemories, 
  getHeaderPhotoConfig, getThemePreference, STORAGE_CHANGE_EVENT, 
  saveThemePreference 
} from './utils/storage';
import { getDayInfo, MIN_YEAR, MAX_YEAR } from './utils/calendarEngine';
import { initNotifications } from './utils/notification';
import { MainCalendarView } from './components/MainCalendarView';
import { DateDetailModal } from './components/DateDetailModal';
import { AndroidWidgetSimulator } from './components/AndroidWidgetSimulator';
import { NotesView } from './components/NotesView';
import { RemindersView } from './components/RemindersView';
import { MemoriesView } from './components/MemoriesView';
import { AgendaView } from './components/AgendaView';
import { YearGridView } from './components/YearGridView';
import { BackupSettingsModal } from './components/BackupSettingsModal';
import { SearchModal } from './components/SearchModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ShareWhatsAppModal } from './components/ShareWhatsAppModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  // Initialize on 2027 as requested:
  const [currentYear, setCurrentYear] = useState<number>(2027);
  const [currentMonth, setCurrentMonth] = useState<number>(0); // 0 = Januari 2027
  
  // Data States
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [headerConfig, setHeaderConfig] = useState<HeaderPhotoConfig>(getHeaderPhotoConfig());
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference());

  // Modals
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<DayCalendarInfo | null>(null);
  const [initialActionForDetail, setInitialActionForDetail] = useState<'none' | 'add_note' | 'add_reminder' | 'add_memory'>('none');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBackupSettingsOpen, setIsBackupSettingsOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [installModalTab, setInstallModalTab] = useState<'apk' | 'pwa' | 'xiaomi' | 'whatsapp'>('apk');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  // Synchronize data from localStorage
  const reloadData = useCallback(() => {
    setNotes(getStoredNotes());
    setReminders(getStoredReminders());
    setMemories(getStoredMemories());
    setHeaderConfig(getHeaderPhotoConfig());
    setTheme(getThemePreference());
  }, []);

  useEffect(() => {
    reloadData();
    const handleStorageChange = () => reloadData();
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
  }, [reloadData]);

  // Handle dark mode theme application
  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    initNotifications();
  }, []);

  // Navigation handlers
  const handlePrevYear = () => {
    setCurrentYear(prev => Math.max(MIN_YEAR, prev - 1));
  };

  const handleNextYear = () => {
    setCurrentYear(prev => Math.min(MAX_YEAR, prev + 1));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => Math.max(MIN_YEAR, prev - 1));
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => Math.min(MAX_YEAR, prev + 1));
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    // Also highlight or open date
    setSelectedDayForDetail(getDayInfo(now));
  };

  const handleSelectMonthYear = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setActiveTab('home');
  };

  const handleSelectDate = (day: DayCalendarInfo) => {
    setSelectedDayForDetail(day);
    setInitialActionForDetail('none');
  };

  const handleSelectDateString = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    if (y && m && d) {
      const dateObj = new Date(y, m - 1, d);
      setCurrentYear(y);
      setCurrentMonth(m - 1);
      setSelectedDayForDetail(getDayInfo(dateObj));
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemePreference = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveThemePreference(nextTheme);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 flex flex-col font-sans pb-24 sm:pb-8">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg sm:text-xl tracking-tight text-stone-900 dark:text-white">
                  KALENDERKU
                </span>
                <span className="px-1.5 py-0.5 text-[11px] font-black rounded-md bg-amber-500 text-white shadow-xs">
                  {currentYear}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-700 dark:text-amber-400 leading-tight">
                Masehi • Hijriyah • Jawa
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Search */}
            <button
              id="btn-search-header"
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cari Catatan & Agenda"
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">Cari</span>
            </button>

            {/* Folder Download APK */}
            <button
              id="btn-install-apk-header"
              type="button"
              onClick={() => {
                setInstallModalTab('apk');
                setIsInstallModalOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all"
              title="Folder Berkas APK / Download Kalenderku"
            >
              <FolderDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Folder APK</span>
            </button>

            {/* Share to WhatsApp */}
            <button
              id="btn-share-whatsapp-header"
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
              title="Bagikan Aplikasi ke WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Bagi WA</span>
            </button>

            {/* Android Widget Simulator Button */}
            <button
              id="btn-widget-header"
              type="button"
              onClick={() => setActiveTab(activeTab === 'widget_preview' ? 'home' : 'widget_preview')}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                activeTab === 'widget_preview'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
              title="Pratinjau Widget Android"
            >
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Widget HP</span>
            </button>

            {/* Quick Agenda View Toggle */}
            <button
              id="btn-agenda-header"
              type="button"
              onClick={() => setActiveTab(activeTab === 'agenda' ? 'home' : 'agenda')}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                activeTab === 'agenda'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700'
              }`}
              title="Agenda Kronologis"
            >
              <ListFilter className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Agenda</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              title="Ganti Mode Terang/Gelap"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Settings & Backup */}
            <button
              id="btn-settings-header"
              type="button"
              onClick={() => setIsBackupSettingsOpen(true)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
              title="Pengaturan & Backup Data"
            >
              <Settings className="w-4 h-4 text-stone-500 hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex-1 w-full">
        {/* Quick Install & APK Download Banner */}
        <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                <span className="text-sm">Folder Download APK & Pemasangan HP Android</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                  v2.0 Lengkap
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
                Tersedia berkas <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 py-0.2 rounded text-[10px]">kalenderku-v2.0-release.apk</code> (3.5 KB) di folder download, serta cara pasang resmi di Layar Utama HP via Chrome tanpa risiko error mengurai paket.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setInstallModalTab('apk');
                setIsInstallModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-xs transition-all flex items-center gap-1.5"
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>Unduh Berkas APK</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setInstallModalTab('pwa');
                setIsInstallModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-all flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pasang di HP (PWA)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs shrink-0 transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Bagi WA</span>
            </button>
          </div>
        </div>

        {/* TAB 1: HOME (Main Calendar 2025-2050 + Header Photo) */}
        {activeTab === 'home' && (
          <MainCalendarView
            currentYear={currentYear}
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onPrevYear={handlePrevYear}
            onNextYear={handleNextYear}
            onGoToday={handleGoToday}
            onSelectMonthYear={handleSelectMonthYear}
            onSelectDate={handleSelectDate}
            headerConfig={headerConfig}
            onUpdateHeaderPhoto={setHeaderConfig}
            notes={notes}
            reminders={reminders}
            memories={memories}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {/* TAB 2: YEAR GRID (Kalender Tahunan 2025–2050) */}
        {activeTab === 'calendar_year' && (
          <YearGridView
            year={currentYear}
            onSelectYear={(yr) => setCurrentYear(yr)}
            onSelectMonth={(m) => {
              setCurrentMonth(m);
              setActiveTab('home');
            }}
            notes={notes}
            reminders={reminders}
            memories={memories}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {/* TAB 3: NOTES (Catatan Harian & Catatan Penting) */}
        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onRefreshData={reloadData}
            onSelectDateString={handleSelectDateString}
          />
        )}

        {/* TAB 4: REMINDERS (Reminder & Alarm Digital) */}
        {activeTab === 'reminders' && (
          <RemindersView
            reminders={reminders}
            onRefreshData={reloadData}
            onSelectDateString={handleSelectDateString}
          />
        )}

        {/* TAB 5: MEMORIES (Kenangan & Album Keluarga) */}
        {activeTab === 'memories' && (
          <MemoriesView
            memories={memories}
            onRefreshData={reloadData}
            onSelectDateString={handleSelectDateString}
          />
        )}

        {/* TAB 6: AGENDA (Agenda Kronologis) */}
        {activeTab === 'agenda' && (
          <AgendaView
            notes={notes}
            reminders={reminders}
            memories={memories}
            onSelectDateString={handleSelectDateString}
          />
        )}

        {/* TAB 7: WIDGET PREVIEW (Widget Android Interaktif) */}
        {activeTab === 'widget_preview' && (
          <AndroidWidgetSimulator
            headerConfig={headerConfig}
            reminders={reminders}
            onOpenDateDetail={handleSelectDate}
            onOpenReminders={() => setActiveTab('reminders')}
          />
        )}
      </main>

      {/* Detail Tanggal Modal */}
      {selectedDayForDetail && (
        <DateDetailModal
          dayInfo={selectedDayForDetail}
          notes={notes.filter(n => n.dateString === selectedDayForDetail.dateString)}
          reminders={reminders.filter(r => r.dateString === selectedDayForDetail.dateString)}
          memories={memories.filter(m => m.dateString === selectedDayForDetail.dateString)}
          allMemories={memories}
          onClose={() => setSelectedDayForDetail(null)}
          onRefreshData={reloadData}
          initialAction={initialActionForDetail}
        />
      )}

      {/* Global Search Modal */}
      {isSearchOpen && (
        <SearchModal
          notes={notes}
          reminders={reminders}
          memories={memories}
          onClose={() => setIsSearchOpen(false)}
          onSelectDateString={handleSelectDateString}
        />
      )}

      {/* Backup, Restore & Settings Modal */}
      {isBackupSettingsOpen && (
        <BackupSettingsModal
          currentTheme={theme}
          onThemeChange={setTheme}
          onClose={() => setIsBackupSettingsOpen(false)}
          onDataRestored={reloadData}
        />
      )}

      {/* Install App / APK Guide Modal */}
      {isInstallModalOpen && (
        <InstallAppModal
          defaultTab={installModalTab}
          deferredPrompt={deferredPrompt}
          onClose={() => setIsInstallModalOpen(false)}
          onInstallSuccess={() => setDeferredPrompt(null)}
          onOpenShareModal={() => {
            setIsInstallModalOpen(false);
            setIsShareModalOpen(true);
          }}
        />
      )}

      {/* Share to WhatsApp Modal */}
      {isShareModalOpen && (
        <ShareWhatsAppModal
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Bottom Smartphone Navigation Bar (Bagian O Desain UI) */}
      <nav 
        id="bottom-navigation-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800 shadow-lg px-2 py-1.5 sm:hidden"
      >
        <div className="grid grid-cols-5 items-center text-center">
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'home'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Beranda</span>
          </button>

          {/* 2. Kalender Tahunan */}
          <button
            type="button"
            onClick={() => setActiveTab('calendar_year')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'calendar_year'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <CalendarIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Kalender</span>
          </button>

          {/* 3. Catatan */}
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'notes'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Catatan</span>
          </button>

          {/* 4. Reminder */}
          <button
            type="button"
            onClick={() => setActiveTab('reminders')}
            className={`flex flex-col items-center justify-center py-1 transition-all relative ${
              activeTab === 'reminders'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5 mb-0.5" />
              {reminders.filter(r => !r.isCompleted).length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-stone-900" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Reminder</span>
          </button>

          {/* 5. Kenangan */}
          <button
            type="button"
            onClick={() => setActiveTab('memories')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              activeTab === 'memories'
                ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Kenangan</span>
          </button>
        </div>
      </nav>

      {/* Mobile Floating WhatsApp Share Button */}
      <button
        id="fab-whatsapp-share-mobile"
        type="button"
        onClick={() => setIsShareModalOpen(true)}
        className="sm:hidden fixed bottom-16 right-4 z-40 p-3 rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-95 transition-all"
        title="Bagikan ke WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Desktop/Tablet Bottom Floating Bar */}
      <div className="hidden sm:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/80 dark:border-stone-800 shadow-xl items-center gap-1">
        {[
          { id: 'home', label: 'Beranda', icon: Home },
          { id: 'calendar_year', label: 'Kalender 2027', icon: CalendarIcon },
          { id: 'notes', label: 'Catatan', icon: BookOpen },
          { id: 'reminders', label: 'Reminder', icon: Bell },
          { id: 'memories', label: 'Kenangan', icon: Camera },
          { id: 'agenda', label: 'Agenda', icon: ListFilter },
          { id: 'widget_preview', label: 'Widget HP', icon: Smartphone },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as ActiveTab)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}

        <div className="w-px h-5 bg-stone-200 dark:border-stone-700 mx-1" />
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all shadow-xs"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Bagi WA</span>
        </button>
      </div>
    </div>
  );
}
