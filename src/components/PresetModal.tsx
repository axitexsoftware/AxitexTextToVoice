import React, { useState } from 'react';
import { X, BookmarkPlus, Check, Sparkles } from 'lucide-react';
import { AudioFormat, LanguageCode, SpeechStyle, VoicePreset } from '../types';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreset: (preset: Omit<VoicePreset, 'id' | 'createdAt' | 'isCustom'>) => void;
  currentConfig: {
    language: LanguageCode;
    voice: string;
    style: SpeechStyle;
    naturalStylePrompt: string;
    speed: number;
    pitch: number;
    format: AudioFormat;
  };
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSavePreset,
  currentConfig,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Preset name is required.');
      return;
    }

    onSavePreset({
      name: name.trim(),
      description: description.trim() || undefined,
      language: currentConfig.language,
      voice: currentConfig.voice,
      style: currentConfig.style,
      naturalStylePrompt: currentConfig.naturalStylePrompt.trim() || undefined,
      speed: currentConfig.speed,
      pitch: currentConfig.pitch,
      format: currentConfig.format,
    });

    setName('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-neutral-900">Save Voice Preset</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Preset Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Friendly Tech Support, Storyteller Beta"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Calibrated for outbound customer notifications"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Current Settings Summary */}
          <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1.5">
            <div className="font-semibold text-neutral-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Settings to be saved:
            </div>
            <div className="grid grid-cols-2 gap-2 text-neutral-600 pt-1">
              <div>
                <span className="text-neutral-400">Language:</span> {currentConfig.language}
              </div>
              <div>
                <span className="text-neutral-400">Voice:</span> {currentConfig.voice}
              </div>
              <div>
                <span className="text-neutral-400">Style:</span> {currentConfig.style}
              </div>
              <div>
                <span className="text-neutral-400">Speed / Pitch:</span> {currentConfig.speed}x / {currentConfig.pitch}st
              </div>
            </div>
            {currentConfig.naturalStylePrompt && (
              <div className="pt-1 text-neutral-600 border-t border-neutral-200 truncate">
                <span className="text-neutral-400">Prompt:</span> "{currentConfig.naturalStylePrompt}"
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              <Check className="h-4 w-4" />
              Save Preset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
