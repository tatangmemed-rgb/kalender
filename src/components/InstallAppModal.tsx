import React, { useState } from 'react';
import { 
  X, Download, Smartphone, Check, ExternalLink, 
  Copy, ShieldCheck, Sparkles, HelpCircle, CheckCircle2, 
  AlertTriangle, ArrowRight, MessageCircle, Settings, 
  Lock, Share2, Info
} from 'lucide-react';

interface InstallAppModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
  onOpenShareModal?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  onClose,
  deferredPrompt,
  onInstallSuccess,
  onOpenShareModal
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'xiaomi' | 'whatsapp'>('pwa');
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

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

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = `Yuk pasang aplikasi KALENDERKU (2025–2030) di HP Anda:
1. Buka tautan ini di browser Google Chrome:
👉 ${currentUrl}
2. Ketuk Titik Tiga (⋮) di kanan atas browser Chrome
3. Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi"
Selesai! Ikon aplikasi akan langsung terpasang di HP Anda.`;
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
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                Panduan Pasang KALENDERKU ke HP
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Solusi resmi 100% berhasil untuk semua HP Android & Xiaomi
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

        {/* ALERT KHUSUS: Mengapa Muncul "Ada Masalah Saat Mengurai Paket" */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900/60 text-rose-950 dark:text-rose-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>PENTING: JANGAN BUKA BERKAS .APK DI FILE MANAGER HP!</span>
          </div>
          <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
            Pesan error <strong className="text-rose-700 dark:text-rose-400">"Ada masalah saat mengurai paket"</strong> muncul karena Anda mencoba mengklik berkas <code className="bg-rose-100 dark:bg-rose-900/50 px-1 py-0.5 rounded text-[11px] font-mono">.apk</code> mentah di Pengelola File HP. Sistem Android secara otomatis menolaknya.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CARA RESMI GOOGLE (100% PASTI BERHASIL):</span>
            </p>
            <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
              Aplikasi ini <strong>tidak perlu diinstal lewat file APK</strong>. Cukup buka di <strong>Google Chrome HP</strong> lalu pilih menu <strong>"Tambahkan ke Layar Utama"</strong>. Ikon resmi KALENDERKU langsung muncul di layar utama HP Anda dan bekerja offline!
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'pwa'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">1. Lewat Chrome</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('xiaomi')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'xiaomi'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">2. Khusus Xiaomi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'whatsapp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">3. Buka di WA</span>
          </button>
        </div>

        {/* TAB 1: METODE PWA CHROME */}
        {activeTab === 'pwa' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> BEBAS ERROR
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Langkah Mudah (10 Detik)
                </span>
              </div>

              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Langkah-langkah Memasang ke Layar HP:
              </h4>

              {/* One-click install prompt if supported */}
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

              {/* Step by Step Visual Guide */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Buka Browser Google Chrome di HP Anda
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Pastikan tautan aplikasi KALENDERKU ini dibuka menggunakan browser <strong>Google Chrome</strong> di HP Anda.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      Ketuk Ikon Menu Titik Tiga (⋮) di Kanan Atas
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Lihat pojok kanan atas browser Google Chrome, ada ikon titik tiga (⋮). Ketuk ikon tersebut untuk membuka menu.
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
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Pilih menu bertuliskan <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home screen) atau <strong>"Instal Aplikasi"</strong>, lalu ketuk tombol <strong>"Instal"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      Selesai! Ikon KALENDERKU Muncul di HP
                    </p>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                      Ikon aplikasi langsung muncul di layar depan smartphone Anda. Dapat dibuka layar penuh (tanpa bilah browser) dan bisa dibuka secara offline!
                    </p>
                  </div>
                </div>
              </div>

              {/* Copy URL */}
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                  Tautan web aplikasi KALENDERKU:
                </span>
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
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 hover:bg-amber-600 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>

              {/* Direct WhatsApp Share */}
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Link Ini ke WhatsApp Diri Sendiri / Keluarga</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold px-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Metode ini 100% aman, resmi standar Google, bebas virus, dan hemat memori HP.</span>
            </div>
          </div>
        )}

        {/* TAB 2: KHUSUS HP XIAOMI / REDMI (MIUI & HYPEROS) */}
        {activeTab === 'xiaomi' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                <Settings className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Khusus HP Xiaomi, Redmi & POCO (MIUI / HyperOS)</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                Pada HP Xiaomi/Redmi, sistem keamanan sering <strong>mematikan izin pembuatan ikon layar utama</strong> secara bawaan. Jika Anda sudah menekan <em>"Tambahkan ke Layar Utama"</em> tapi ikon belum muncul, lakukan langkah 1 menit ini:
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
                  <p className="text-stone-700 dark:text-stone-300">
                    Ketuk <strong>Pintasan layar utama (Home screen shortcuts)</strong> dan pilih <strong>"Selalu izinkan" (Always allow)</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-orange-200 dark:border-orange-800/80 text-[11px] text-stone-600 dark:text-stone-400">
                Setelah izin diaktifkan, buka kembali Google Chrome &gt; ketuk Titik Tiga (⋮) &gt; pilih <strong>"Tambahkan ke Layar Utama"</strong>. Ikon KALENDERKU dijamin langsung muncul di layar HP Anda!
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('pwa')}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Lihat Panduan Chrome Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BUKA DI WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-3.5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kirim Link ke WhatsApp Diri Sendiri</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                Kirimkan tautan aplikasi ini ke ruang obrolan WhatsApp Anda. Di HP Anda, tinggal ketuk link tersebut untuk langsung terbuka di Chrome dan ditambahkan ke Layar Utama.
              </p>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Tautan Resmi:</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800 font-mono text-[11px] text-stone-600 dark:text-stone-300 break-all select-all">
                  {currentUrl}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buka WhatsApp & Kirim Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-between items-center border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            ← Kembali ke Panduan Chrome
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
