export type LanguageCode =
  | 'en-US'
  | 'en-IN'
  | 'hi-IN'
  | 'bn-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'mr-IN'
  | 'gu-IN'
  | 'kn-IN'
  | 'ml-IN'
  | 'es-ES'
  | 'fr-FR'
  | 'de-DE'
  | 'ja-JP';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type VoiceGender = 'Female' | 'Male';

export interface Voice {
  id: string;
  name: string;
  gender: VoiceGender;
  description: string;
  recommendedStyles: string[];
  isGeminiNative: boolean;
}

export type AudioFormat = 'wav' | 'mp3';

export type SpeechStyle =
  | 'Natural'
  | 'Friendly'
  | 'Professional'
  | 'Calm'
  | 'Energetic'
  | 'Narration'
  | 'News'
  | 'Storytelling'
  | 'Conversational'
  | 'Warm'
  | 'Excited';

export interface VoicePreset {
  id: string;
  name: string;
  description?: string;
  language: LanguageCode;
  voice: string;
  style: SpeechStyle;
  naturalStylePrompt?: string;
  speed: number;
  pitch: number;
  format: AudioFormat;
  isCustom?: boolean;
  createdAt?: string;
}

export interface TTSRequestPayload {
  text: string;
  language: LanguageCode;
  voice: string;
  style?: SpeechStyle;
  naturalStylePrompt?: string;
  speed?: number;
  pitch?: number;
  format?: AudioFormat;
}

export interface TTSResponsePayload {
  success: boolean;
  request_id: string;
  audio_url?: string;
  audio_base64?: string;
  format: AudioFormat;
  duration_seconds: number;
  characters: number;
  generation_time_ms: number;
  voice: string;
  language: string;
  style?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  keyHash: string;
  fullKeyOnce?: string;
  createdAt: string;
  lastUsedAt?: string;
  revoked: boolean;
}

export interface DailyUsage {
  date: string;
  requests: number;
  characters: number;
  successfulRequests: number;
  failedRequests: number;
}

export interface RequestLogItem {
  id: string;
  timestamp: string;
  endpoint: string;
  status: number;
  durationMs: number;
  characters: number;
  voice: string;
  language: string;
  apiKeyId?: string;
}

export interface SystemSettings {
  freeDailyLimit: number;
  maxCharactersPerRequest: number;
  rateLimitPerMinute: number;
  geminiTtsModel: string;
  maintenanceMode: boolean;
  enabledLanguages: LanguageCode[];
  enabledVoices: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'developer' | 'enterprise';
  dailyLimit: number;
  createdAt: string;
  disabled?: boolean;
  presets: VoicePreset[];
}
