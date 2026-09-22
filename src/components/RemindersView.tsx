import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, Circle, Clock, Calendar, 
  Plus, Trash2, Repeat, Volume2, Star, X, Check, AlertCircle 
} from 'lucide-react';
import { ReminderItem, ReminderRepeatType } from '../types';
import { addReminder, toggleReminderComplete, deleteReminder } from '../utils/storage';
import { formatDateFullIndonesian } from '../utils/calendarEngine';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onRefreshData: () => void;
  onSelectDateString?: (dateString: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onRefreshData,
  onSelectDateString
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'important'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [dateString, setDateString] = useState('2027-01-17');
  const [time, setTime] = useState('19:00');
  const [repeat, setRepeat] = useState<ReminderRepeatType>('monthly');
  const [isImportant, setIsImportant] = useState(false);
  const [notes, setNotes] = useState('');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Web Audio chime generator (runs purely offline in any browser)
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, audioCtx.currentTime + 0.3); // D6

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch {
      // Audio fallback
    }
  };

  const handleTestNotification = () => {
    playChime();
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3500);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('KALENDERKU 2027 - Pengingat', {
        body: 'Waktunya reminder: Bayar Listrik & Token PLN!',
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleOpenAddModal = () => {
    setTitle('');
    setDateString(new Date().toISOString().split('T')[0]);
    setTime('19:00');
    setRepeat('once');
    setIsImportant(false);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title,
      dateString,
      time,
      repeat,
      isCompleted: false,
      isImportant,
      notes
    });

    playChime();
    setIsModalOpen(false);
    onRefreshData();
  };

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted);

  const displayedReminders = reminders.filter(r => {
    if (filter === 'active') return !r.isCompleted;
    if (filter === 'completed') return r.isCompleted;
    if (filter === 'important') return r.isImportant;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>REMINDER & ALARM DIGITAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">
              Pengingat Jadwal
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Kelola jadwal pembayaran, ulang tahun keluarga, janji temu, dan agenda berulang.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestNotification}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-all active:scale-95"
              title="Cek Suara & Notifikasi Pengingat"
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              <span>Tes Alarm</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pasang Reminder</span>
            </button>
          </div>
        </div>

        {/* Test Notification Banner */}
        {testNotificationSent && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>
                <strong>🔔 Alarm Berbunyi!</strong> Simulasi notifikasi pengingat kalender berhasil dijalankan.
              </span>
            </div>
            <button onClick={() => setTestNotificationSent(false)} className="text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80">
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'active'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            Aktif ({activeReminders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            Semua ({reminders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('important')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'important'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Penting ({reminders.filter(r => r.isImportant).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            Selesai ({completedReminders.length})
          </button>
        </div>
      </div>

      {/* Reminder Items List */}
      {displayedReminders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-stone-200">Tidak ada reminder di kategori ini</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Gunakan tombol "+ Pasang Reminder" untuk membuat pengingat bayar listrik, ultah, atau ibadah.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReminders.map(rem => (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-4 shadow-xs hover:shadow-md ${
                rem.isCompleted
                  ? 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                  : rem.isImportant
                  ? 'bg-gradient-to-r from-amber-50/40 via-white to-amber-50/10 dark:from-amber-950/20 dark:via-stone-900 border-amber-300 dark:border-amber-700/60'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800'
              }`}
            >
              {/* Checkbox Complete */}
              <button
                type="button"
                onClick={() => {
                  toggleReminderComplete(rem.id);
                  onRefreshData();
                }}
                className="mt-1 text-stone-400 hover:text-amber-500 transition-transform active:scale-90"
                title={rem.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
              >
                {rem.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-base font-bold leading-snug ${
                    rem.isCompleted ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-50'
                  }`}>
                    {rem.title}
                  </h3>

                  {rem.isImportant && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Prioritas</span>
                    </span>
                  )}

                  {rem.repeat !== 'once' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                      <Repeat className="w-3 h-3" />
                      <span>
                        {rem.repeat === 'daily' ? 'Harian' : rem.repeat === 'weekly' ? 'Mingguan' : rem.repeat === 'monthly' ? 'Bulanan' : 'Tahunan'}
                      </span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-2">
                  <button
                    type="button"
                    onClick={() => onSelectDateString && onSelectDateString(rem.dateString)}
                    className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateFullIndonesian(rem.dateString)}</span>
                  </button>

                  <span className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pukul {rem.time} WIB</span>
                  </span>
                </div>

                {rem.notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 italic">
                    "{rem.notes}"
                  </p>
                )}
              </div>

              {/* Delete action */}
              <button
                type="button"
                onClick={() => {
                  deleteReminder(rem.id);
                  onRefreshData();
                }}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Hapus reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Pasang Reminder Baru
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
                  Judul Pengingat:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Bayar listrik, Tagihan air, Ulang tahun..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
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
                    Waktu Alarm:
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Pengulangan Jadwal:
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as ReminderRepeatType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-medium"
                >
                  <option value="once">Sekali Saja</option>
                  <option value="daily">Setiap Hari</option>
                  <option value="weekly">Setiap Minggu</option>
                  <option value="monthly">Setiap Bulan (misal tanggal yang sama)</option>
                  <option value="yearly">Setiap Tahun (Ulang tahun / Peringatan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Catatan / Keterangan Tambahan (opsional):
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: No pelanggan PLN 123456789..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-700 dark:text-amber-400">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4"
                  />
                  <span>⭐ Tandai Sebagai Pengingat Prioritas Utama</span>
                </label>
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
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                >
                  Simpan Pengingat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
