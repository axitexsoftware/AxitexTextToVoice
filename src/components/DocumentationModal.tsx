import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  Volume2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SUPPORTED_VOICES, SPEECH_STYLES } from '../data/voices';

export const DocumentationView: React.FC = () => {
  const [docSection, setDocSection] = useState<
    'intro' | 'quickstart' | 'auth' | 'endpoint' | 'voices' | 'languages' | 'formats' | 'errors' | 'limits' | 'sdks'
  >('quickstart');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const baseUrl = window.location.origin;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">AxiTex Voice AI Documentation</h1>
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-800">
              API v1.4
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Complete developer reference, parameters, code samples, and integration guides.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1">
          {[
            { id: 'intro', label: '1. Introduction', icon: BookOpen },
            { id: 'quickstart', label: '2. Quick Start', icon: Zap },
            { id: 'auth', label: '3. Authentication', icon: ShieldCheck },
            { id: 'endpoint', label: '4. Text-to-Speech API', icon: Terminal },
            { id: 'voices', label: '5. Voice Catalog', icon: Volume2 },
            { id: 'languages', label: '6. Languages & Locales', icon: Globe },
            { id: 'formats', label: '7. Audio Formats', icon: Code2 },
            { id: 'errors', label: '8. Errors & Status Codes', icon: AlertTriangle },
            { id: 'limits', label: '9. Rate Limits & Quotas', icon: ShieldCheck },
            { id: 'sdks', label: '10. SDK Examples', icon: Code2 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setDocSection(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                docSection === item.id
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-9 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
          {/* 1. INTRO */}
          {docSection === 'intro' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Introduction</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                AxiTex Voice AI provides human-like, low-latency Text-to-Speech powered by Google Gemini neural audio technology. It gives developers high-fidelity voice generation for notifications, customer support, audiobooks, and assistive technology through a single unified REST endpoint.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h3 className="font-semibold text-sm text-neutral-900">Base API URL</h3>
                  <p className="font-mono text-xs text-neutral-700 mt-1">{baseUrl}/v1</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h3 className="font-semibold text-sm text-neutral-900">Content Format</h3>
                  <p className="font-mono text-xs text-neutral-700 mt-1">application/json</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. QUICK START */}
          {docSection === 'quickstart' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-neutral-900">Quick Start</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Send an HTTP POST request to the <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">/v1/text-to-speech</code> endpoint with your API key in the Authorization header.
              </p>

              <div className="relative rounded-xl bg-neutral-900 p-4 text-xs font-mono text-neutral-200">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-neutral-800 text-neutral-400">
                  <span>cURL</span>
                  <button
                    onClick={() =>
                      copySnippet(
                        'quick_curl',
                        `curl -X POST "${baseUrl}/v1/text-to-speech" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "text": "Welcome to AxiTex Voice AI.",\n    "language": "en-IN",\n    "voice": "Kore",\n    "style": "friendly"\n  }'`
                      )
                    }
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copiedCode === 'quick_curl' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedCode === 'quick_curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre>{`curl -X POST "${baseUrl}/v1/text-to-speech" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Welcome to AxiTex Voice AI.",
    "language": "en-IN",
    "voice": "Kore",
    "style": "friendly"
  }'`}</pre>
              </div>

              <h3 className="font-bold text-sm text-neutral-900 pt-2">Response:</h3>
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-xs font-mono text-neutral-800">
                <pre>{`{
  "success": true,
  "request_id": "req_8f93e1_a9b2",
  "audio_url": "data:audio/wav;base64,UklGRi...",
  "format": "wav",
  "duration_seconds": 3.8,
  "characters": 27,
  "generation_time_ms": 310,
  "voice": "Kore",
  "language": "en-IN"
}`}</pre>
              </div>
            </div>
          )}

          {/* 3. AUTHENTICATION */}
          {docSection === 'auth' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Authentication</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                All developer API requests must be authenticated using HTTP Bearer Authentication. Include your API key in the Authorization header:
              </p>

              <div className="p-4 rounded-xl bg-neutral-900 text-xs font-mono text-emerald-400">
                Authorization: Bearer ax_live_98ab76cd...
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700 space-y-2">
                <h4 className="font-bold text-neutral-900">Key Security Guidelines:</h4>
                <ul className="list-disc list-inside space-y-1 text-neutral-600">
                  <li>Never include your secret API key in browser-side JavaScript or client repositories.</li>
                  <li>Store keys in server environment variables or Google Secret Manager.</li>
                  <li>You can generate, view, and revoke keys at any time in the API Keys console.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. ENDPOINT REFERENCE */}
          {docSection === 'endpoint' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-neutral-900">POST /v1/text-to-speech</h2>
              <p className="text-sm text-neutral-600">
                Synthesizes text input into speech audio stream and metadata.
              </p>

              <h3 className="font-bold text-sm text-neutral-900">Request Body Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-600">
                  <thead className="bg-neutral-50 text-neutral-800 uppercase font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Required</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">text</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-red-600 font-semibold">Yes</td>
                      <td className="py-2.5 px-3">The plain text to convert to speech (max 2,000 characters).</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">language</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-neutral-400">No</td>
                      <td className="py-2.5 px-3">Language locale code, e.g. "en-IN", "hi-IN", "en-US". Default: "en-US".</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">voice</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-neutral-400">No</td>
                      <td className="py-2.5 px-3">Google Gemini voice name: "Kore", "Puck", "Aoede", "Charon", etc.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">style</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-neutral-400">No</td>
                      <td className="py-2.5 px-3">"Natural", "Friendly", "News", "Storytelling", "Calm", "Warm".</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">speed</td>
                      <td className="py-2.5 px-3 font-mono">number</td>
                      <td className="py-2.5 px-3 text-neutral-400">No</td>
                      <td className="py-2.5 px-3">Speaking rate from 0.5 to 2.0. Default: 1.0.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-semibold text-neutral-900">format</td>
                      <td className="py-2.5 px-3 font-mono">string</td>
                      <td className="py-2.5 px-3 text-neutral-400">No</td>
                      <td className="py-2.5 px-3">"wav" (24kHz standard PCM) or "mp3". Default: "wav".</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. VOICES */}
          {docSection === 'voices' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Google Gemini Supported Voices</h2>
              <p className="text-sm text-neutral-600">
                AxiTex uses the official prebuilt voice models provided by the Google Gemini voice architecture:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {SUPPORTED_VOICES.map((v) => (
                  <div key={v.id} className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">{v.name}</span>
                      <span className="text-[10px] bg-neutral-200 px-2 py-0.5 rounded font-semibold text-neutral-700">
                        {v.gender}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">{v.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {v.recommendedStyles.map((st) => (
                        <span key={st} className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.2 rounded text-neutral-600">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LANGUAGES */}
          {docSection === 'languages' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Supported Languages & Locales</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <div key={l.code} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50">
                    <span className="text-base mr-2">{l.flag}</span>
                    <span className="font-semibold text-xs text-neutral-900">{l.name}</span>
                    <div className="font-mono text-[11px] text-neutral-500 mt-0.5">{l.code}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FORMATS */}
          {docSection === 'formats' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Audio Formats & PCM Encoding</h2>
              <p className="text-sm text-neutral-600">
                AxiTex returns audio as standard base64 data URLs ready for direct browser playback or server storage.
              </p>
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900">WAV (Default):</strong> Standard 16-bit Linear PCM at 24,000 Hz, with a 44-byte RIFF header compatible with all native media players.
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <strong className="text-neutral-900">MP3:</strong> Compact MPEG audio for mobile apps and low-bandwidth scenarios.
                </div>
              </div>
            </div>
          )}

          {/* 8. ERRORS */}
          {docSection === 'errors' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Error Handling</h2>
              <p className="text-sm text-neutral-600">
                All error responses return standard HTTP status codes and a consistent JSON payload:
              </p>
              <div className="rounded-xl bg-neutral-900 p-4 text-xs font-mono text-neutral-200">
                <pre>{`{
  "success": false,
  "error": {
    "code": "DAILY_LIMIT_EXCEEDED",
    "message": "You have reached today's free usage limit (50 requests/day). Please try again tomorrow."
  }
}`}</pre>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-neutral-600">
                  <thead className="bg-neutral-50 text-neutral-800 uppercase font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Error Code</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">400</td>
                      <td className="py-2 px-3 font-mono text-red-600">INVALID_REQUEST</td>
                      <td className="py-2 px-3">Missing text or invalid parameter type.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">401</td>
                      <td className="py-2 px-3 font-mono text-red-600">UNAUTHORIZED</td>
                      <td className="py-2 px-3">Missing or invalid Bearer API key.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">429</td>
                      <td className="py-2 px-3 font-mono text-red-600">RATE_LIMIT_EXCEEDED</td>
                      <td className="py-2 px-3">Exceeded 60 requests per minute.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">429</td>
                      <td className="py-2 px-3 font-mono text-red-600">DAILY_LIMIT_EXCEEDED</td>
                      <td className="py-2 px-3">Daily free quota limit reached.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. LIMITS */}
          {docSection === 'limits' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">Rate Limits & Quota Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-sm text-neutral-900">Free Tier Quotas</h4>
                  <ul className="mt-2 text-xs text-neutral-600 space-y-1">
                    <li>• 50 requests per day per user</li>
                    <li>• Up to 2,000 characters per request</li>
                    <li>• All 8 Gemini voice models included</li>
                    <li>• Resets daily at 00:00 UTC</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-sm text-neutral-900">Burst Protection</h4>
                  <ul className="mt-2 text-xs text-neutral-600 space-y-1">
                    <li>• 60 requests / minute max</li>
                    <li>• IP throttling to prevent bot abuse</li>
                    <li>• Automatic retry with backoff supported</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 10. SDKs */}
          {docSection === 'sdks' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">SDKs & Client Libraries</h2>
              <p className="text-sm text-neutral-600">
                Integrate directly using your language of choice. Copy and run the snippets below in your project:
              </p>

              <div className="space-y-4 text-xs font-mono">
                <div className="rounded-xl bg-neutral-900 p-4 text-neutral-200">
                  <span className="text-neutral-400 block pb-1 border-b border-neutral-800">Node.js</span>
                  <pre className="mt-2">{`import { GoogleGenAI } from '@google/genai';
// Or direct HTTP fetch:
const res = await fetch('${baseUrl}/v1/text-to-speech', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.AXITEX_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello world from AxiTex Voice AI',
    voice: 'Kore',
    language: 'en-US'
  })
});
const data = await res.json();`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
