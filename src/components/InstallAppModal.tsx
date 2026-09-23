import React, { useState, useEffect } from 'react';
import { 
  X, Download, Smartphone, Check, ExternalLink, 
  Copy, ShieldCheck, Sparkles, HelpCircle, CheckCircle2, 
  AlertTriangle, ArrowRight, MessageCircle, Settings, 
  Lock, Share2, Info, Compass, Folder, FileText, Code
} from 'lucide-react';

interface InstallAppModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
  onOpenShareModal?: () => void;
  defaultTab?: 'apk' | 'pwa' | 'xiaomi' | 'whatsapp';
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  onClose,
  deferredPrompt,
  onInstallSuccess,
  onOpenShareModal,
  defaultTab = 'apk'
}) => {
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'xiaomi' | 'whatsapp'>(defaultTab);
  const [copied, setCopied] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<{
    isInApp: boolean;
    isXiaomi: boolean;
    isChrome: boolean;
    browserName: string;
  }>({
    isInApp: false,
    isXiaomi: false,
    isChrome: true,
    browserName: 'Chrome'
  });

  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Line|wv/i.test(ua) || (window.navigator as any).standalone === false;
      const isXiaomi = /Xiaomi|Redmi|POCO|MIUI|HyperOS/i.test(ua);
      const isMiBrowser = /MiuiBrowser|Mint Browser/i.test(ua);
      const isChrome = /Chrome/i.test(ua) && !isMiBrowser && !/Edge|OPR/i.test(ua);

      let name = 'Google Chrome';
      if (/WhatsApp/i.test(ua)) name = 'Browser Internal WhatsApp';
      else if (isMiBrowser) name = 'Mi Browser (Browser Bawaan Xiaomi)';
      else if (/Line/i.test(ua)) name = 'Browser Internal LINE';
      else if (/FBAN|FBAV|Instagram/i.test(ua)) name = 'Browser Media Sosial';
      else if (isChrome) name = 'Google Chrome';
      else name = 'Web Browser';

      setBrowserInfo({
        isInApp,
        isXiaomi,
        isChrome,
        browserName: name
      });
    }
  }, []);

  const handlePromptInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          onInstallSuccess();
          onClose();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setActiveTab('pwa');
    }
  };

  const handleOpenInAndroidChrome = () => {
    if (typeof window !== 'undefined') {
      const urlWithoutProtocol = window.location.href.replace(/^https?:\/\//, '');
      const chromeIntent = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = chromeIntent;
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = `Halo! Pasang aplikasi KALENDERKU (2025–2030) di HP Anda:
1. Buka link ini di Google Chrome:
👉 ${currentUrl}
2. Ketuk Titik Tiga (⋮) di kanan atas
3. Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi"
Selesai! Ikon kalender akan langsung muncul di HP Anda.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs animate-in fade-in">
      <div 
        id="install-apk-modal"
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[92vh] overflow-y-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                Folder Download APK & Pemasangan HP
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Berkas rilis resmi KALENDERKU v2.0 (2025–2030)
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

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'apk'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Folder className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Unduh APK</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'pwa'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Pasang di HP</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('xiaomi')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'xiaomi'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">HP Xiaomi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Buka di WA</span>
          </button>
        </div>

        {/* TAB 1: UNDUH BERKAS APK */}
        {activeTab === 'apk' && (
          <div className="space-y-3.5 animate-in fade-in">
            {/* Folder Header Info */}
            <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-stone-700 dark:text-stone-300">
                  📁 Lokasi: /public/download/ & /public/apk/
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Tersedia 3 Berkas
              </span>
            </div>

            {/* Primary File: kalenderku-v2.0-release.apk */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/40 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm shadow-amber-500/30">
                    APK
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      kalenderku-v2.0-release.apk
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Versi 2.0.0 • Ukuran: ~3.5 KB • Paket Lengkap 2025–2030
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shrink-0">
                  Rilis Resmi
                </span>
              </div>

              {/* Direct Download Link */}
              <a
                href="/download/kalenderku-v2.0-release.apk"
                download="kalenderku-v2.0-release.apk"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas APK Sekarang (3.5 KB)</span>
              </a>
            </div>

            {/* Warning Box: Solusi "Ada masalah saat mengurai paket" */}
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-200 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>MENGAPA MUNCUL "ADA MASALAH SAAT MENGURAI PAKET"?</span>
              </p>
              <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                Pada sistem operasi Android modern (terutama <strong>Xiaomi, Redmi, POCO, Samsung</strong>), berkas APK yang diunduh langsung dari web sering kali ditolak secara otomatis oleh keamanan sistem saat dibuka lewat Pengelola Berkas (File Manager).
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-[11px] space-y-1.5">
                <p className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Solusi Pasti Berhasil Tanpa Error Mengurai Paket:</span>
                </p>
                <p className="leading-relaxed">
                  Buka aplikasi ini di <strong>Google Chrome HP</strong> &gt; ketuk <strong>Titik Tiga (⋮)</strong> di kanan atas &gt; pilih <strong>"Tambahkan ke Layar Utama"</strong>. Aplikasi langsung terpasang resmi di HP Anda dengan ikon dan bekerja offline!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('pwa')}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Lihat Cara Pasang di Layar Utama (100% Berhasil)</span>
                </button>
              </div>
            </div>

            {/* Other Files in folder */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                Berkas Pendukung Lainnya di Folder:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-bold text-stone-800 dark:text-stone-200 truncate">panduan-instalasi.txt</p>
                    <p className="text-[10px] text-stone-500">Teks petunjuk resmi</p>
                  </div>
                  <a
                    href="/download/panduan-instalasi.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-[11px] font-semibold hover:bg-stone-300"
                  >
                    Buka
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div className="truncate">
                    <p className="font-bold text-stone-800 dark:text-stone-200 truncate">version.json</p>
                    <p className="text-[10px] text-stone-500">Metadata rilis v2.0.0</p>
                  </div>
                  <a
                    href="/download/version.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 text-[11px] font-semibold hover:bg-stone-300"
                  >
                    Info
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PASANG VIA CHROME (PWA) */}
        {activeTab === 'pwa' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CARA RESMI STANDAR GOOGLE
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Instan & Bebas Error
                </span>
              </div>

              {/* Direct Install prompt button if available */}
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handlePromptInstall}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 active:scale-98 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Pasang ke Layar Utama Sekarang</span>
                </button>
              )}

              {/* 3 Step Visual Guide */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Buka di Aplikasi Google Chrome HP
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Pastikan tautan aplikasi dibuka menggunakan browser Google Chrome di HP Anda.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Ketuk Menu Titik Tiga (⋮) di Kanan Atas
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Di pojok kanan atas browser Google Chrome, ketuk ikon titik tiga (⋮).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi"
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Ketuk menu tersebut, lalu tekan tombol <strong>"Instal"</strong> atau <strong>"Tambah"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-300 dark:border-emerald-800/80 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      Selesai! Ikon KALENDERKU Muncul di HP Anda
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">
                      Ikon aplikasi langsung muncul di layar smartphone Anda, dapat dibuka layar penuh, dan bisa digunakan tanpa internet!
                    </p>
                  </div>
                </div>
              </div>

              {/* Open in Android Chrome Intent button */}
              <button
                type="button"
                onClick={handleOpenInAndroidChrome}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Tekan di Sini untuk Membuka Langsung di Chrome HP</span>
              </button>

              {/* Copy URL */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-hidden font-mono text-stone-600 dark:text-stone-300 px-2 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KHUSUS HP XIAOMI / REDMI */}
        {activeTab === 'xiaomi' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                <Settings className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Solusi Ikon Tidak Muncul di HP Xiaomi / Redmi</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                HP Xiaomi (Redmi & POCO) memiliki fitur proteksi MIUI/HyperOS yang secara otomatis <strong>menolak pembuatan ikon di layar utama</strong>. Aktifkan izinnya dengan langkah berikut:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    Buka <strong>Setelan (Settings)</strong> di HP Xiaomi Anda.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    Pilih menu <strong>Aplikasi</strong> &gt; <strong>Kelola Aplikasi (Manage apps)</strong>.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    Cari dan ketuk aplikasi <strong>Chrome</strong>.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0">4</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    Pilih menu <strong>Perizinan lainnya (Other permissions)</strong>.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">5</span>
                  <p className="text-stone-700 dark:text-stone-300 font-semibold text-emerald-800 dark:text-emerald-300">
                    Ketuk <strong>Pintasan layar utama (Home screen shortcuts)</strong> dan pilih <strong>"Selalu izinkan" (Always allow)</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-orange-200 dark:border-orange-800/80 text-[11px] text-stone-600 dark:text-stone-400">
                Setelah izin diaktifkan, buka kembali Chrome &gt; ketuk Titik Tiga (⋮) &gt; pilih <strong>"Tambahkan ke Layar Utama"</strong>. Ikon KALENDERKU dijamin langsung muncul di layar HP Anda!
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BUKA DI WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kirim Link ke WhatsApp Diri Sendiri</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                Kirimkan tautan aplikasi ini ke nomor WhatsApp Anda sendiri. Di HP Anda, tinggal ketuk link tersebut untuk langsung terbuka di Chrome.
              </p>

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Tautan ke WhatsApp Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-stone-100 dark:border-stone-800">
          <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center sm:text-left">
            Aplikasi KALENDERKU siap digunakan langsung di browser maupun diinstal.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
