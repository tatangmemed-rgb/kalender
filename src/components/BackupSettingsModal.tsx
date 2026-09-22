import React, { useRef, useState } from 'react';
import { 
  X, Download, Upload, ShieldCheck, Moon, Sun, 
  Monitor, RefreshCw, Check, AlertTriangle, Database, Info 
} from 'lucide-react';
import { ThemePreference } from '../types';
import { 
  exportAllData, importAllData, resetAllDataToDefault, 
  saveThemePreference 
} from '../utils/storage';

interface BackupSettingsModalProps {
  currentTheme: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
  onClose: () => void;
  onDataRestored: () => void;
}

export const BackupSettingsModal: React.FC<BackupSettingsModalProps> = ({
  currentTheme,
  onThemeChange,
  onClose,
  onDataRestored
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Export / Download JSON
  const handleExportBackup = () => {
    try {
      const dataStr = exportAllData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `KALENDERKU_2027_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage('File cadangan data berhasil diunduh ke perangkat Anda!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setErrorMessage('Gagal mengekspor data cadangan.');
    }
  };

  // Handle Import / Restore JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importAllData(text);
          if (success) {
            setSuccessMessage('Data berhasil dipulihkan (Restore Sukses)!');
            onDataRestored();
            setTimeout(() => setSuccessMessage(null), 4000);
          } else {
            setErrorMessage('Format file JSON tidak sesuai atau rusak.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan data ke sampel bawaan? Catatan yang baru dibuat akan digantikan.')) {
      resetAllDataToDefault();
      onDataRestored();
      setSuccessMessage('Data berhasil di-reset ke pengaturan awal.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in">
      <div 
        id="backup-settings-modal"
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Pengaturan & Backup Data
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Simpan cadangan lokal, privasi aman, dan tema tampilan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Theme Preference */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Mode Tampilan Aplikasi:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', label: 'Terang', icon: Sun },
              { id: 'dark', label: 'Gelap', icon: Moon },
              { id: 'system', label: 'Sistem HP', icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onThemeChange(id as ThemePreference);
                  saveThemePreference(id as ThemePreference);
                }}
                className={`py-3 px-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  currentTheme === id
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Privacy & Offline Guarantee */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Jaminan Privasi 100% Offline & Aman</span>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            Seluruh catatan pribadi, jadwal reminder, foto keluarga, dan kenangan tersimpan langsung di memori perangkat Anda secara lokal. Tidak ada data yang diunggah ke server pihak ketiga.
          </p>
        </div>

        {/* 3. Backup & Restore Data */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Cadangan & Pemulihan (Backup & Restore):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export */}
            <button
              type="button"
              onClick={handleExportBackup}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-amber-500 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                <Download className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Backup / Export Data</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Unduh seluruh data kalender, foto, dan catatan dalam bentuk file cadangan JSON.
              </p>
            </button>

            {/* Import */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 hover:border-blue-500 text-left transition-all flex flex-col justify-between gap-3 group cursor-pointer"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".json"
                className="hidden"
              />
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                <Upload className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <span>Restore / Import Data</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pulihkan file JSON cadangan Anda agar data tetap aman saat ganti perangkat.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Reset to Default Starter Samples */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sampel Bawaan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
