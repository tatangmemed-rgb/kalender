import React, { useState } from 'react';
import { 
  X, Send, Copy, Check, Share2, Sparkles, MessageCircle, 
  Smartphone, Calendar, Users, Heart, ArrowUpRight 
} from 'lucide-react';
import { DayCalendarInfo } from '../types';

interface ShareWhatsAppModalProps {
  onClose: () => void;
  dayInfo?: DayCalendarInfo | null;
}

export const ShareWhatsAppModal: React.FC<ShareWhatsAppModalProps> = ({
  onClose,
  dayInfo
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'app' | 'family' | 'holidays' | 'date'>(
    dayInfo ? 'date' : 'app'
  );
  const [customNote, setCustomNote] = useState('');

  // Pre-configured message templates
  const getMessageText = () => {
    let baseText = '';

    if (selectedTemplate === 'app') {
      baseText = `*KALENDERKU (2025–2030)* 📅
Aplikasi kalender custom lengkap untuk keluarga!

✨ *Fitur Lengkap:*
• Kalender Masehi, Hijriyah & Kalender Jawa
• Pasaran Jawa (Legi, Pahing, Pon, Wage, Kliwon) & Neptu
• Hari Libur Nasional & Cuti Bersama Resmi RI 2025–2030
• Pasang Foto Kenangan Keluarga setiap bulan
• Catatan Harian, Agenda & Pengingat Alarm
• Bisa dipasang ke layar utama HP Android (PWA)

Yuk coba dan pasang sekarang di HP:
👉 ${currentUrl}`;
    } else if (selectedTemplate === 'family') {
      baseText = `Assalamu'alaikum / Halo semuanya! 🌸👨‍👩‍👧‍👦

Ini aplikasi *KALENDERKU* untuk keluarga kita. Di dalamnya sudah lengkap:
• Kalender 2025–2030
• Pasaran Jawa & Weton hari lahir
• Tanggal libur nasional & cuti bersama
• Foto kenangan dan catatan acara keluarga

Bisa langsung dibuka atau dipasang ke layar HP:
👉 ${currentUrl}`;
    } else if (selectedTemplate === 'holidays') {
      baseText = `*Info Kalender Indonesia 2025–2030 & Hari Libur Nasional* 🇮🇩
Cek tanggal merah, cuti bersama, kalender Hijriyah, dan pasaran Jawa lengkap di aplikasi KALENDERKU:

👉 Buka di sini: ${currentUrl}`;
    } else if (selectedTemplate === 'date' && dayInfo) {
      const monthName = dayInfo.date.toLocaleString('id-ID', { month: 'long' });
      const year = dayInfo.date.getFullYear();
      baseText = `📅 *Catatan Kalender:*
*${dayInfo.dayNameMasehi}, ${dayInfo.dayOfMonth} ${monthName} ${year}*
• Kalender Hijriyah: ${dayInfo.hijriDay} ${dayInfo.hijriMonthName} ${dayInfo.hijriYear} H
• Pasaran Jawa: ${dayInfo.pasaran} (Neptu ${dayInfo.neptu}) • Hari: ${dayInfo.dayNameJawa}
• Wuku: ${dayInfo.wuku}
${dayInfo.holidayName ? `🔴 *Hari Libur:* ${dayInfo.holidayName}\n` : ''}
Lihat kalender selengkapnya di aplikasi KALENDERKU:
👉 ${currentUrl}`;
    }

    if (customNote.trim()) {
      return `${customNote.trim()}\n\n${baseText}`;
    }
    return baseText;
  };

  const fullMessage = getMessageText();

  // Send to WhatsApp via web / mobile intent
  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KALENDERKU (2025–2030)',
          text: fullMessage,
          url: currentUrl,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      handleCopyMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in">
      <div 
        id="share-whatsapp-modal"
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[92vh] overflow-y-auto space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug flex items-center gap-1.5">
                <span>Bagikan ke WhatsApp</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  WA
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Kirim link dan info kalender ke keluarga, teman, atau grup WA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Pilih Format Pesan WhatsApp:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTemplate('app')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                selectedTemplate === 'app'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Rekomendasi</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('family')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                selectedTemplate === 'family'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px]">Keluarga</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate('holidays')}
              className={`p-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                selectedTemplate === 'holidays'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px]">Hari Libur</span>
            </button>

            {dayInfo && (
              <button
                type="button"
                onClick={() => setSelectedTemplate('date')}
                className={`p-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                  selectedTemplate === 'date'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px]">Tanggal Ini</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Custom Note Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
            Tambahkan salam / catatan pengantar (opsional):
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Contoh: Halo grup RT 05, mohon izin berbagi kalender ini ya..."
            className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* WhatsApp Chat Bubble Mockup */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            Pratinjau Pesan yang Akan Terkirim:
          </span>
          <div className="p-3.5 rounded-2xl bg-[#EFEAE2] dark:bg-[#0b141a] border border-stone-300 dark:border-stone-800 relative">
            {/* WhatsApp green message bubble */}
            <div className="max-w-[90%] bg-[#E7FFDB] dark:bg-[#005c4b] text-stone-800 dark:text-[#E9EDEF] p-3 rounded-2xl rounded-tl-xs shadow-xs text-xs whitespace-pre-wrap font-sans leading-relaxed select-text border border-emerald-200/50 dark:border-emerald-700/30">
              {fullMessage}
              <div className="text-[9px] text-right text-stone-400 dark:text-emerald-300/80 mt-1 font-mono">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            id="btn-send-whatsapp-now"
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim ke WhatsApp Sekarang</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-copy-wa-message"
              type="button"
              onClick={handleCopyMessage}
              className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Pesan Tersalin!' : 'Salin Teks Pesan'}</span>
            </button>

            <button
              id="btn-native-share-wa"
              type="button"
              onClick={handleNativeShare}
              className="py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Menu Bagikan HP</span>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-500 dark:text-stone-400">
          💡 <strong>Tips:</strong> Tombol di atas akan langsung membuka aplikasi WhatsApp di HP Anda (atau WhatsApp Web di laptop/komputer). Anda tinggal memilih kontak teman, keluarga, atau grup yang dituju.
        </div>
      </div>
    </div>
  );
};
