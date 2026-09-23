import { ApiKeyItem, DailyUsage, RequestLogItem, SystemSettings, UserProfile, VoicePreset } from '../types';
import { DEFAULT_PRESETS } from '../data/voices';

const STORAGE_KEYS = {
  PRESETS: 'axitex_voice_presets',
  API_KEYS: 'axitex_api_keys',
  USAGE_STATS: 'axitex_usage_stats',
  REQUEST_LOGS: 'axitex_request_logs',
  SYSTEM_SETTINGS: 'axitex_system_settings',
  USER_PROFILE: 'axitex_user_profile',
};

const DEFAULT_SETTINGS: SystemSettings = {
  freeDailyLimit: 50,
  maxCharactersPerRequest: 2000,
  rateLimitPerMinute: 60,
  geminiTtsModel: 'gemini-2.5-flash',
  maintenanceMode: false,
  enabledLanguages: [
    'en-US', 'en-IN', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN',
    'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'
  ],
  enabledVoices: ['Kore', 'Puck', 'Aoede', 'Charon', 'Fenrir', 'Zephyr', 'Orpheus', 'Leda'],
};

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export class StorageService {
  // --- Voice Presets ---
  static getPresets(): VoicePreset[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
      if (stored) {
        const customPresets: VoicePreset[] = JSON.parse(stored);
        // Combine default presets and custom presets, avoiding duplicates
        const map = new Map<string, VoicePreset>();
        DEFAULT_PRESETS.forEach(p => map.set(p.id, p));
        customPresets.forEach(p => map.set(p.id, p));
        return Array.from(map.values());
      }
    } catch (e) {
      console.error('Failed to load presets from localStorage', e);
    }
    return DEFAULT_PRESETS;
  }

  static savePreset(preset: Omit<VoicePreset, 'id' | 'createdAt' | 'isCustom'>): VoicePreset {
    const allPresets = this.getPresets();
    const newPreset: VoicePreset = {
      ...preset,
      id: `preset_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const customOnly = allPresets.filter(p => p.isCustom);
    customOnly.push(newPreset);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customOnly));
    
    // Also sync to active profile
    this.syncPresetToProfile(newPreset);
    return newPreset;
  }

  static deletePreset(presetId: string): boolean {
    const allPresets = this.getPresets();
    const target = allPresets.find(p => p.id === presetId);
    if (!target || !target.isCustom) {
      // Cannot delete default built-in presets
      return false;
    }
    const customOnly = allPresets.filter(p => p.isCustom && p.id !== presetId);
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customOnly));
    return true;
  }

  private static syncPresetToProfile(preset: VoicePreset) {
    const profile = this.getUserProfile();
    if (profile) {
      profile.presets = (profile.presets || []).filter(p => p.id !== preset.id);
      profile.presets.push(preset);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }
  }

  // --- User Profile ---
  static getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) return JSON.parse(stored);
    } catch {}

    const defaultProfile: UserProfile = {
      id: 'usr_guest_demo',
      email: 'developer@axitex.ai',
      name: 'AxiTex Developer',
      plan: 'free',
      dailyLimit: 50,
      createdAt: new Date().toISOString(),
      presets: [],
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  static updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  }

  // --- API Keys ---
  static getApiKeys(): ApiKeyItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      if (stored) return JSON.parse(stored);
    } catch {}

    // Initial sample key
    const initialKeys: ApiKeyItem[] = [
      {
        id: 'key_live_default',
        name: 'Default Production Key',
        prefix: 'ax_live_',
        maskedKey: 'ax_live_98ab••••••••••••••••••••34ef',
        keyHash: 'sha256_mock_hash_axitex_prod',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastUsedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        revoked: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(initialKeys));
    return initialKeys;
  }

  static createApiKey(name: string): { item: ApiKeyItem; secretKey: string } {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const fullKey = `ax_live_${randomHex}`;
    const maskedKey = `ax_live_${randomHex.substring(0, 4)}••••••••••••••••••••${randomHex.substring(randomHex.length - 4)}`;

    const newItem: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: name.trim() || 'API Key',
      prefix: 'ax_live_',
      maskedKey,
      keyHash: `hash_${randomHex.substring(0, 16)}`,
      createdAt: new Date().toISOString(),
      revoked: false,
    };

    const keys = this.getApiKeys();
    keys.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));

    return { item: newItem, secretKey: fullKey };
  }

  static revokeApiKey(id: string): boolean {
    const keys = this.getApiKeys();
    const idx = keys.findIndex(k => k.id === id);
    if (idx === -1) return false;
    keys[idx].revoked = true;
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    return true;
  }

  // --- Daily Usage & Quotas ---
  static getDailyUsage(): DailyUsage {
    const today = getTodayString();
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.USAGE_STATS}_${today}`);
      if (stored) return JSON.parse(stored);
    } catch {}

    const fresh: DailyUsage = {
      date: today,
      requests: 3,
      characters: 342,
      successfulRequests: 3,
      failedRequests: 0,
    };
    localStorage.setItem(`${STORAGE_KEYS.USAGE_STATS}_${today}`, JSON.stringify(fresh));
    return fresh;
  }

  static incrementUsage(characters: number, isSuccess = true): DailyUsage {
    const usage = this.getDailyUsage();
    usage.requests += 1;
    usage.characters += characters;
    if (isSuccess) {
      usage.successfulRequests += 1;
    } else {
      usage.failedRequests += 1;
    }
    const today = getTodayString();
    localStorage.setItem(`${STORAGE_KEYS.USAGE_STATS}_${today}`, JSON.stringify(usage));
    return usage;
  }

  // --- Request Logs ---
  static getRequestLogs(): RequestLogItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REQUEST_LOGS);
      if (stored) return JSON.parse(stored);
    } catch {}

    const sampleLogs: RequestLogItem[] = [
      {
        id: 'req_1001',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
        endpoint: '/v1/text-to-speech',
        status: 200,
        durationMs: 412,
        characters: 142,
        voice: 'Kore',
        language: 'en-IN',
      },
      {
        id: 'req_1002',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString(),
        endpoint: '/v1/text-to-speech',
        status: 200,
        durationMs: 388,
        characters: 84,
        voice: 'Aoede',
        language: 'hi-IN',
      },
      {
        id: 'req_1003',
        timestamp: new Date(Date.now() - 1000 * 60 * 62).toLocaleTimeString(),
        endpoint: '/v1/text-to-speech',
        status: 200,
        durationMs: 495,
        characters: 116,
        voice: 'Charon',
        language: 'en-US',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REQUEST_LOGS, JSON.stringify(sampleLogs));
    return sampleLogs;
  }

  static addRequestLog(item: Omit<RequestLogItem, 'id' | 'timestamp'>): RequestLogItem {
    const logs = this.getRequestLogs();
    const newLog: RequestLogItem = {
      ...item,
      id: `req_${Date.now().toString(36)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    logs.unshift(newLog);
    if (logs.length > 50) logs.length = 50; // keep last 50
    localStorage.setItem(STORAGE_KEYS.REQUEST_LOGS, JSON.stringify(logs));
    return newLog;
  }

  // --- Admin System Settings ---
  static getSystemSettings(): SystemSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SETTINGS;
  }

  static saveSystemSettings(settings: SystemSettings): void {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(settings));
  }
}
