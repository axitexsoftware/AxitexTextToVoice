import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, Pause, CheckCircle2, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

interface HeroProps {
  onTryPlayground: () => void;
  onViewDocs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onTryPlayground, onViewDocs }) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const toggleSampleAudio = () => {
    // Teaser audio preview using browser speech synthesis
    if ('speechSynthesis' in window) {
      if (isPlayingDemo) {
        window.speechSynthesis.cancel();
        setIsPlayingDemo(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Welcome to AxiTex Voice AI. Turn text into natural, expressive speech with a simple API.');
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlayingDemo(false);
        utterance.onerror = () => setIsPlayingDemo(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingDemo(true);
      }
    } else {
      setIsPlayingDemo(!isPlayingDemo);
      setTimeout(() => setIsPlayingDemo(false), 3000);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white pt-10 pb-16 border-b border-neutral-100">
      {/* Background grid accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-800 shadow-xs mb-6">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Google Gemini Neural TTS Enabled</span>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-500">v1.4 Production Ready</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-[1.15]">
          Human-like Text-to-Speech for{' '}
          <span className="text-neutral-900 underline decoration-emerald-500 decoration-3 underline-offset-4">
            Every Application
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Generate natural, expressive and multilingual speech with a simple API. Turn text into natural, expressive speech using advanced Google Gemini Text-to-Speech technology.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onTryPlayground}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Try Text-to-Speech
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onViewDocs}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-base font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 transition-all"
          >
            View API Documentation
          </button>
        </div>

        {/* Live Demo Teaser Section directly below the hero */}
        <div className="mt-12 mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Live Voice Teaser</div>
                <div className="text-sm font-bold text-neutral-900">AxiTex Audio Engine • Model Kore (Warm & Articulate)</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSampleAudio}
                className="flex items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                {isPlayingDemo ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
                {isPlayingDemo ? 'Pause Sample' : 'Listen Live Sample'}
              </button>
              <button
                onClick={onTryPlayground}
                className="text-xs text-neutral-600 hover:text-neutral-900 font-medium underline underline-offset-2 px-2"
              >
                Open Playground →
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
            <span className="italic">"Turn text into natural, expressive speech with a simple API."</span>
            <span className="font-mono text-neutral-400">format: wav • 24kHz</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-left">
          <div className="p-3.5 rounded-lg border border-neutral-200 bg-white/70">
            <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900">
              <Zap className="h-4 w-4 text-emerald-600" />
              Low Latency
            </div>
            <p className="mt-1 text-xs text-neutral-500">Fast sub-second synthesis stream ready for realtime speech.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-neutral-200 bg-white/70">
            <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900">
              <Globe className="h-4 w-4 text-emerald-600" />
              Multilingual
            </div>
            <p className="mt-1 text-xs text-neutral-500">English, Hindi, Bengali, Tamil, Telugu, Marathi, and more.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-neutral-200 bg-white/70">
            <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Voice Presets
            </div>
            <p className="mt-1 text-xs text-neutral-500">Save, load, and manage customized voice configuration profiles.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-neutral-200 bg-white/70">
            <div className="flex items-center gap-2 font-semibold text-sm text-neutral-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Enterprise Secure
            </div>
            <p className="mt-1 text-xs text-neutral-500">Zero frontend secret leakage. Protected backend authentication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
