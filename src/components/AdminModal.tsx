import React, { useState } from 'react';
import { X, Settings, ShieldAlert, Save, RotateCcw, Check, UserX } from 'lucide-react';
import { SystemSettings, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, SUPPORTED_VOICES } from '../data/voices';
import { StorageService } from '../services/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSettingsSaved: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSettingsSaved,
}) => {
  const [settings, setSettings] = useState<SystemSettings>(StorageService.getSystemSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [userDisabled, setUserDisabled] = useState(currentUser.disabled || false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSystemSettings(settings);
    StorageService.updateUserProfile({ disabled: userDisabled });
    setIsSaved(true);
    onSettingsSaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const toggleLanguage = (code: any) => {
    const current = settings.enabledLanguages || [];
    if (current.includes(code)) {
      setSettings({ ...settings, enabledLanguages: current.filter((c) => c !== code) });
    } else {
      setSettings({ ...settings, enabledLanguages: [...current, code] });
    }
  };

  const toggleVoice = (vId: string) => {
    const current = settings.enabledVoices || [];
    if (current.includes(vId)) {
      setSettings({ ...settings, enabledVoices: current.filter((v) => v !== vId) });
    } else {
      setSettings({ ...settings, enabledVoices: [...current, vId] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Administrator Console</h3>
              <p className="text-xs text-neutral-500">
                Configure global quotas, Gemini TTS models, and security rules without frontend redeploys.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* Quotas & Limits */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Quota & Abuse Protection Limits
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Free Daily Requests Limit (per user/IP)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={settings.freeDailyLimit}
                  onChange={(e) =>
                    setSettings({ ...settings, freeDailyLimit: parseInt(e.target.value, 10) || 50 })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Maximum Characters per Request
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={settings.maxCharactersPerRequest}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxCharactersPerRequest: parseInt(e.target.value, 10) || 2000,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Burst Rate Limit (requests / min)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={settings.rateLimitPerMinute}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      rateLimitPerMinute: parseInt(e.target.value, 10) || 60,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Configurable Google Gemini TTS Model
                </label>
                <select
                  value={settings.geminiTtsModel}
                  onChange={(e) => setSettings({ ...settings, geminiTtsModel: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended)</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                  <option value="gemini-3.1-flash-tts-preview">gemini-3.1-flash-tts-preview</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enabled Voices & Languages */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Enabled Voice Models ({settings.enabledVoices.length} active)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_VOICES.map((v) => {
                  const isChecked = settings.enabledVoices.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleVoice(v.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-400 border-neutral-200 line-through'
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Enabled Languages ({settings.enabledLanguages.length} active)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isChecked = settings.enabledLanguages.includes(l.code);
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => toggleLanguage(l.code)}
                      className={`px-2 py-1 rounded text-xs border transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                      }`}
                    >
                      {l.flag} {l.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Switches & Account Control */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900">Maintenance Mode</span>
                <p className="text-[11px] text-neutral-500">Temporarily pause public API generation requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-4 w-4 accent-neutral-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
              <div>
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <UserX className="h-3.5 w-3.5" />
                  Suspend Abusive Account
                </span>
                <p className="text-[11px] text-neutral-500">
                  Block the active user from making requests
                </p>
              </div>
              <input
                type="checkbox"
                checked={userDisabled}
                onChange={(e) => setUserDisabled(e.target.checked)}
                className="h-4 w-4 accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
            >
              {isSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5" />}
              {isSaved ? 'Settings Saved' : 'Save System Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
