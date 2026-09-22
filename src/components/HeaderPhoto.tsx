import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Sliders, Check, RefreshCw, X, Sparkles } from 'lucide-react';
import { HeaderPhotoConfig, HeaderPhotoStyle } from '../types';
import { PRESET_HEADER_PHOTOS, saveHeaderPhotoConfig, DEFAULT_HEADER_PHOTO } from '../utils/storage';

interface HeaderPhotoProps {
  config: HeaderPhotoConfig;
  onUpdate: (newConfig: HeaderPhotoConfig) => void;
  compact?: boolean;
}

export const HeaderPhoto: React.FC<HeaderPhotoProps> = ({ config, onUpdate, compact = false }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'style'>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const updated: HeaderPhotoConfig = {
            ...config,
            photoUrl: result,
            customCaption: file.name.replace(/\.[^/.]+$/, '')
          };
          onUpdate(updated);
          saveHeaderPhotoConfig(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string, title: string) => {
    const updated: HeaderPhotoConfig = {
      ...config,
      photoUrl: url,
      customCaption: title
    };
    onUpdate(updated);
    saveHeaderPhotoConfig(updated);
  };

  const handleStyleChange = (style: HeaderPhotoStyle) => {
    const updated: HeaderPhotoConfig = { ...config, style };
    onUpdate(updated);
    saveHeaderPhotoConfig(updated);
  };

  const handlePositionChange = (cropPosition: 'center' | 'top' | 'bottom') => {
    const updated: HeaderPhotoConfig = { ...config, cropPosition };
    onUpdate(updated);
    saveHeaderPhotoConfig(updated);
  };

  const handleOpacityChange = (opacity: number) => {
    const updated: HeaderPhotoConfig = { ...config, overlayOpacity: opacity };
    onUpdate(updated);
    saveHeaderPhotoConfig(updated);
  };

  const handleReset = () => {
    onUpdate(DEFAULT_HEADER_PHOTO);
    saveHeaderPhotoConfig(DEFAULT_HEADER_PHOTO);
  };

  const positionClass = 
    config.cropPosition === 'top' ? 'object-top' :
    config.cropPosition === 'bottom' ? 'object-bottom' : 'object-center';

  return (
    <div id="header-photo-wrapper" className="relative group w-full overflow-hidden rounded-2xl transition-all">
      {/* Photo Render */}
      <div className={`relative w-full ${compact ? 'h-36 sm:h-44' : 'h-48 sm:h-64'} overflow-hidden rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800`}>
        <img
          src={config.photoUrl}
          alt={config.customCaption || 'Foto Utama Kalender'}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${positionClass}`}
          referrerPolicy="no-referrer"
        />

        {/* Customizable Overlay for guaranteed readability */}
        <div 
          className="absolute inset-0 bg-stone-950 transition-opacity"
          style={{ opacity: (config.overlayOpacity ?? 30) / 100 }}
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/20 pointer-events-none" />

        {/* Photo Title and Status Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none text-white">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium tracking-wide drop-shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foto Keluarga / Kenangan</span>
            </div>
            <p className="text-base sm:text-lg font-bold tracking-tight drop-shadow-md text-stone-50">
              {config.customCaption || 'Keluarga Bahagia & Berkah'}
            </p>
          </div>

          <button
            id="btn-edit-header-photo"
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 shadow-md transition-all active:scale-95 cursor-pointer"
            title="Ubah Foto dan Gaya Tampilan"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Ganti Foto</span>
          </button>
        </div>
      </div>

      {/* Editor Modal Sheet */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div 
            id="photo-editor-modal"
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Atur Foto Kalender</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Pilih foto pribadi atau keluarga untuk kalender 2027</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1 mt-4 bg-stone-100 dark:bg-stone-800/80 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                  activeTab === 'presets'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Pilihan Foto
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Unggah Sendiri
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-2 px-3 rounded-xl transition-all ${
                  activeTab === 'style'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                Gaya & Posisi
              </button>
            </div>

            {/* Tab 1: Presets */}
            {activeTab === 'presets' && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-stone-500 dark:text-stone-400">Pilih dari koleksi foto estetis pilihan:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_HEADER_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url, preset.title)}
                      className={`group relative h-24 rounded-2xl overflow-hidden border-2 text-left transition-all ${
                        config.photoUrl === preset.url
                          ? 'border-amber-500 ring-2 ring-amber-500/20 scale-[0.98]'
                          : 'border-transparent hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[11px] font-semibold text-white leading-tight">{preset.title}</span>
                      </div>
                      {config.photoUrl === preset.url && (
                        <div className="absolute top-1.5 right-1.5 p-1 bg-amber-500 text-white rounded-full shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Upload */}
            {activeTab === 'upload' && (
              <div className="mt-4 space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-3xl p-8 text-center cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-all flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      Klik untuk Ambil dari Galeri atau Kamera
                    </p>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                      Mendukung JPG, PNG, WEBP (Privasi 100% aman tersimpan lokal)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                    Keterangan / Judul Foto:
                  </label>
                  <input
                    type="text"
                    value={config.customCaption || ''}
                    onChange={(e) => {
                      const updated = { ...config, customCaption: e.target.value };
                      onUpdate(updated);
                      saveHeaderPhotoConfig(updated);
                    }}
                    placeholder="Contoh: Keluarga Besar Bpk. Ahmad"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Style & Positioning */}
            {activeTab === 'style' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-2">
                    Model Tampilan Foto:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['header', 'background', 'card', 'cover'] as HeaderPhotoStyle[]).map((styleOpt) => (
                      <button
                        key={styleOpt}
                        type="button"
                        onClick={() => handleStyleChange(styleOpt)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          config.style === styleOpt
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {styleOpt === 'header' && '1. Foto sebagai Header'}
                        {styleOpt === 'background' && '2. Foto sebagai Background'}
                        {styleOpt === 'card' && '3. Foto sebagai Kartu Kalender'}
                        {styleOpt === 'cover' && '4. Foto Keluarga sebagai Cover'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                    Posisi Fokus Gambar (Crop):
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handlePositionChange(pos)}
                        className={`py-2 px-3 rounded-xl border text-center transition-all ${
                          config.cropPosition === pos
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {pos === 'top' ? 'Atas' : pos === 'center' ? 'Tengah' : 'Bawah'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                    <span>Transparansi Overlay Kegelapan:</span>
                    <span className="text-amber-600 dark:text-amber-400">{config.overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={config.overlayOpacity}
                    onChange={(e) => handleOpacityChange(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Membantu menjaga tulisan dan kalender tetap jelas dan kontras tinggi.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-medium px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Foto Bawaan</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
