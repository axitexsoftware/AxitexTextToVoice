import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Volume2,
  Trash2,
  BookmarkPlus,
  AlertCircle,
  FileText,
  Clock,
  Code2,
  ChevronDown,
  Info,
  Wand2,
  Zap,
} from 'lucide-react';
import { AudioFormat, LanguageCode, SpeechStyle, TTSResponsePayload, VoicePreset } from '../types';
import { SUPPORTED_LANGUAGES, SUPPORTED_VOICES, SPEECH_STYLES, SAMPLE_TEXTS } from '../data/voices';
import { StorageService } from '../services/storage';
import { PresetModal } from './PresetModal';

interface PlaygroundProps {
  maxCharacters?: number;
  onUsageUpdate?: () => void;
  onOpenConsole?: () => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  maxCharacters = 2000,
  onUsageUpdate,
  onOpenConsole,
}) => {
  // Text Editor State
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [characterCount, setCharacterCount] = useState<number>(SAMPLE_TEXTS[0].text.length);
  const [wordCount, setWordCount] = useState<number>(SAMPLE_TEXTS[0].text.trim().split(/\s+/).filter(Boolean).length);

  // Configuration State
  const [language, setLanguage] = useState<LanguageCode>('en-IN');
  const [voice, setVoice] = useState<string>('Kore');
  const [style, setStyle] = useState<SpeechStyle>('Friendly');
  const [naturalStylePrompt, setNaturalStylePrompt] = useState<string>(
    'Speak warmly and naturally like a helpful customer support executive.'
  );
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(0);
  const [format, setFormat] = useState<AudioFormat>('wav');

  // Voice Presets State
  const [presets, setPresets] = useState<VoicePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_cust_support');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);

  // Generation & Status State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [generationResult, setGenerationResult] = useState<TTSResponsePayload | null>(null);

  // Audio Playback State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [copiedApi, setCopiedApi] = useState<boolean>(false);

  // Load presets on mount
  useEffect(() => {
    const loadedPresets = StorageService.getPresets();
    setPresets(loadedPresets);
  }, []);

  // Real-time character & word counter update
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setCharacterCount(val.length);
    const words = val.trim().split(/\s+/).filter(Boolean);
    setWordCount(val.trim() === '' ? 0 : words.length);

    if (val.length > maxCharacters) {
      setValidationError(`Maximum input limit exceeded by ${val.length - maxCharacters} characters.`);
    } else if (validationError) {
      setValidationError('');
    }
  };

  // Clear text
  const handleClearText = () => {
    setText('');
    setCharacterCount(0);
    setWordCount(0);
    setValidationError('');
  };

  // Load sample text
  const handleLoadSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setText(sample.text);
    setCharacterCount(sample.text.length);
    const words = sample.text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setLanguage(sample.lang as LanguageCode);
    setVoice(sample.voice);
    setStyle(sample.style as SpeechStyle);
    setNaturalStylePrompt(sample.naturalPrompt);
    setValidationError('');
  };

  // Load a voice preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setLanguage(found.language);
      setVoice(found.voice);
      setStyle(found.style);
      setNaturalStylePrompt(found.naturalStylePrompt || '');
      setSpeed(found.speed);
      setPitch(found.pitch || 0);
      setFormat(found.format || 'wav');
    }
  };

  // Save new preset callback
  const handleSavePreset = (newPresetData: Omit<VoicePreset, 'id' | 'createdAt' | 'isCustom'>) => {
    const saved = StorageService.savePreset(newPresetData);
    const updatedPresets = StorageService.getPresets();
    setPresets(updatedPresets);
    setSelectedPresetId(saved.id);
  };

  // Delete preset
  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom preset?')) {
      StorageService.deletePreset(id);
      const updated = StorageService.getPresets();
      setPresets(updated);
      if (selectedPresetId === id) {
        setSelectedPresetId(updated[0]?.id || '');
      }
    }
  };

  // Core Speech Generation Flow
  const handleGenerateSpeech = async () => {
    // 1. Validation
    if (!text || text.trim().length === 0) {
      setValidationError('Please enter some text to generate speech.');
      return;
    }

    if (text.length > maxCharacters) {
      setValidationError(`Text exceeds the maximum allowed length of ${maxCharacters} characters.`);
      return;
    }

    setValidationError('');
    setIsGenerating(true);
    setGenerationStep('Validating input...');

    try {
      await new Promise((r) => setTimeout(r, 200));
      setGenerationStep('Sending request to secure backend...');

      await new Promise((r) => setTimeout(r, 250));
      setGenerationStep('Generating speech with Google Gemini...');

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          language,
          voice,
          style,
          naturalStylePrompt: naturalStylePrompt.trim() || undefined,
          speed,
          pitch,
          format,
        }),
      });

      setGenerationStep('Generating audio stream...');
      const data: TTSResponsePayload = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to generate speech audio.');
      }

      setGenerationStep('Complete!');
      setGenerationResult(data);
      setCurrentTime(0);
      setIsPlaying(false);

      // Track usage & logs
      StorageService.incrementUsage(data.characters, true);
      StorageService.addRequestLog({
        endpoint: '/v1/text-to-speech',
        status: 200,
        durationMs: data.generation_time_ms,
        characters: data.characters,
        voice: data.voice,
        language: data.language,
      });

      if (onUsageUpdate) onUsageUpdate();
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || 'An error occurred during audio generation.');
      StorageService.incrementUsage(text.length, false);
      StorageService.addRequestLog({
        endpoint: '/v1/text-to-speech',
        status: 500,
        durationMs: 450,
        characters: text.length,
        voice,
        language,
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationStep(''), 1500);
    }
  };

  // Audio Player Controls
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = (fmt: 'wav' | 'mp3') => {
    if (!generationResult?.audio_base64) return;
    const a = document.createElement('a');
    a.href = generationResult.audio_base64;
    a.download = `axitex_${voice.toLowerCase()}_${Date.now()}.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyApiRequestSnippet = () => {
    const curlCommand = `curl -X POST "${window.location.origin}/v1/text-to-speech" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
    {
      text: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
      language,
      voice,
      style,
      speed,
      format,
    },
    null,
    2
  )}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedApi(true);
    setTimeout(() => setCopiedApi(false), 2000);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isOverLimit = characterCount > maxCharacters;
  const isApproachingLimit = characterCount >= maxCharacters * 0.8 && !isOverLimit;

  return (
    <section id="playground" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Text-to-Speech Playground</h2>
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">Studio</span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Synthesize natural human-like speech with full control over language, vocal tone, and speaking cadence.
          </p>
        </div>

        {/* Voice Presets Selector & Save CTA */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 shadow-xs">
            <BookmarkPlus className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-neutral-500">Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="text-xs font-semibold text-neutral-900 bg-transparent border-none focus:outline-none cursor-pointer pr-2"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isCustom ? '★ (Custom)' : ''}
                </option>
              ))}
            </select>

            {/* If selected preset is custom, show delete button */}
            {presets.find((p) => p.id === selectedPresetId)?.isCustom && (
              <button
                type="button"
                onClick={(e) => handleDeletePreset(selectedPresetId, e)}
                title="Delete this custom preset"
                className="ml-1 text-neutral-400 hover:text-red-600 p-0.5 rounded transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsPresetModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Save Preset
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= LEFT SIDE: Text Input Editor ================= */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-neutral-500" />
              Input Script
            </label>

            {/* Quick Sample Text Buttons */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-400 hidden sm:inline mr-1">Load sample:</span>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_TEXTS[0])}
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                Support
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_TEXTS[1])}
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_TEXTS[2])}
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                News
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_TEXTS[3])}
                className="rounded border border-neutral-200 bg-white px-2 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                Story
              </button>
            </div>
          </div>

          {/* Text Area Card with Real-time Counters */}
          <div
            className={`relative rounded-xl border bg-white shadow-xs transition-all ${
              isOverLimit
                ? 'border-red-500 ring-2 ring-red-100'
                : 'border-neutral-300 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900'
            }`}
          >
            <textarea
              rows={9}
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste the text you want AxiTex Voice AI to synthesize into speech..."
              className="w-full resize-y rounded-t-xl bg-transparent p-4 font-sans text-sm text-neutral-900 focus:outline-none placeholder:text-neutral-400 leading-relaxed"
            />

            {/* Text Editor Toolbar: Character Counter, Word Counter, Clear Button */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/80 px-4 py-2.5 rounded-b-xl text-xs">
              <div className="flex items-center gap-4">
                {/* Real-time Character Counter */}
                <div
                  className={`flex items-center gap-1 font-mono font-medium ${
                    isOverLimit
                      ? 'text-red-600 font-bold'
                      : isApproachingLimit
                      ? 'text-amber-600 font-semibold'
                      : 'text-neutral-600'
                  }`}
                >
                  <span>Chars:</span>
                  <span>{characterCount}</span>
                  <span className="text-neutral-400">/</span>
                  <span className="text-neutral-500">{maxCharacters}</span>
                  {isOverLimit && (
                    <span className="ml-1 rounded bg-red-100 px-1.5 py-0.2 text-[10px] text-red-700">
                      Exceeded
                    </span>
                  )}
                </div>

                {/* Real-time Word Counter */}
                <div className="flex items-center gap-1 font-mono text-neutral-500">
                  <span>Words:</span>
                  <span className="font-medium text-neutral-700">{wordCount}</span>
                </div>
              </div>

              {/* Clear Button */}
              {text.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearText}
                  className="text-neutral-500 hover:text-neutral-900 hover:underline transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Generate Speech Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isGenerating || isOverLimit}
              onClick={handleGenerateSpeech}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 ${
                isGenerating
                  ? 'bg-neutral-700 cursor-not-allowed'
                  : isOverLimit
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{generationStep || 'Generating speech...'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5 text-emerald-400" />
                  <span>Generate Speech</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Voice Configuration ================= */}
        <div className="lg:col-span-5 flex flex-col space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <Sliders className="h-4 w-4 text-emerald-600" />
              Voice Configuration
            </div>
            <span className="text-xs text-neutral-400">Google Gemini TTS</span>
          </div>

          {/* 1. Language Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full appearance-none rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* 2. Voice Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Voice Model
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {SUPPORTED_VOICES.map((v) => {
                const isSelected = voice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVoice(v.id)}
                    className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold">{v.name}</span>
                      <span
                        className={`text-[10px] px-1 rounded ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-neutral-200/70 text-neutral-600'
                        }`}
                      >
                        {v.gender}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] mt-1 line-clamp-1 ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {v.description.split('.')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Emotion / Style Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Emotion / Style
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SPEECH_STYLES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStyle(st)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    style === st
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Natural-Language Style Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1">
                <Wand2 className="h-3.5 w-3.5 text-emerald-600" />
                Natural Style Prompt
              </label>
              <span className="text-[10px] text-neutral-400">Contextual direction</span>
            </div>
            <input
              type="text"
              value={naturalStylePrompt}
              onChange={(e) => setNaturalStylePrompt(e.target.value)}
              placeholder="e.g. Speak warmly and naturally like a helpful customer support executive."
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* 5. Speed, Pitch, Format Sliders */}
          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-neutral-100">
            {/* Speed */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Speed</span>
                <span className="font-mono text-neutral-500">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
            </div>

            {/* Pitch */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Pitch</span>
                <span className="font-mono text-neutral-500">{pitch > 0 ? `+${pitch}` : pitch}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={pitch}
                onChange={(e) => setPitch(parseInt(e.target.value, 10))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Format Radio */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Audio Format</span>
            <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormat('wav')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'wav' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                WAV (Lossless)
              </button>
              <button
                type="button"
                onClick={() => setFormat('mp3')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  format === 'mp3' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                MP3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= AUDIO RESULT SECTION ================= */}
      {generationResult && generationResult.audio_base64 && (
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {/* Hidden HTML Audio element */}
          <audio
            ref={audioRef}
            src={generationResult.audio_base64}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={handleTimeUpdate}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <h3 className="text-lg font-bold text-neutral-900">Generated Audio</h3>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                Synthesized with Google Gemini TTS • Voice: <strong className="text-neutral-700">{generationResult.voice}</strong> ({generationResult.language})
              </p>
            </div>

            {/* Action Buttons: Play, Pause, Downloads */}
            <div className="flex items-center flex-wrap gap-2.5">
              <button
                type="button"
                onClick={togglePlayPause}
                className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-neutral-800 transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                {isPlaying ? 'Pause' : 'Play Audio'}
              </button>

              <button
                type="button"
                onClick={() => handleDownload('wav')}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download WAV
              </button>

              <button
                type="button"
                onClick={() => handleDownload('mp3')}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download MP3
              </button>

              <button
                type="button"
                onClick={copyApiRequestSnippet}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {copiedApi ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedApi ? 'Copied cURL' : 'Copy API Request'}
              </button>
            </div>
          </div>

          {/* Player Bar & Waveform Simulation */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-neutral-500 min-w-[36px]">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min="0"
                max={audioDuration || generationResult.duration_seconds || 1}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />

              <span className="font-mono text-xs text-neutral-500 min-w-[36px]">
                {formatTime(audioDuration || generationResult.duration_seconds)}
              </span>
            </div>

            {/* Audio Metadata Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-600">
              <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <span>Duration: <strong>{generationResult.duration_seconds}s</strong></span>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 py-1">
                <Volume2 className="h-3.5 w-3.5 text-neutral-400" />
                <span>Voice: <strong>{generationResult.voice}</strong></span>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 py-1">
                <span>Lang: <strong>{generationResult.language}</strong></span>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 py-1">
                <Zap className="h-3.5 w-3.5 text-emerald-600" />
                <span>Latency: <strong>{generationResult.generation_time_ms}ms</strong></span>
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 rounded-md px-2.5 py-1">
                <FileText className="h-3.5 w-3.5 text-neutral-400" />
                <span>Chars: <strong>{generationResult.characters}</strong></span>
              </div>

              {/* Sub-actions */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSpeech}
                  className="text-xs font-semibold text-neutral-900 hover:underline"
                >
                  Generate Again
                </button>
                <span className="text-neutral-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('playground');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-semibold text-neutral-900 hover:underline"
                >
                  Modify Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSavePreset={handleSavePreset}
        currentConfig={{
          language,
          voice,
          style,
          naturalStylePrompt,
          speed,
          pitch,
          format,
        }}
      />
    </section>
  );
};
