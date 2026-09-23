import React, { useState, useEffect } from 'react';
import {
  Key,
  BarChart3,
  Terminal,
  FileCode,
  Shield,
  Plus,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  RotateCw,
  Search,
  ExternalLink,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { ApiKeyItem, DailyUsage, RequestLogItem, UserProfile } from '../types';
import { StorageService } from '../services/storage';

interface DeveloperConsoleProps {
  user: UserProfile;
  remainingQuota: number;
  totalQuota: number;
  onRefreshUsage: () => void;
  onOpenDocs: () => void;
}

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({
  user,
  remainingQuota,
  totalQuota,
  onRefreshUsage,
  onOpenDocs,
}) => {
  const [consoleTab, setConsoleTab] = useState<
    'overview' | 'playground' | 'keys' | 'usage' | 'docs' | 'logs' | 'account'
  >('overview');

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [createdSecretKey, setCreatedSecretKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Usage stats state
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(StorageService.getDailyUsage());
  const [requestLogs, setRequestLogs] = useState<RequestLogItem[]>([]);

  // Interactive API Playground state
  const [langCode, setLangCode] = useState('en-IN');
  const [voiceName, setVoiceName] = useState('Kore');
  const [styleName, setStyleName] = useState('Friendly');
  const [audioFormat, setAudioFormat] = useState('wav');
  const [sampleText, setSampleText] = useState('Welcome to AxiTex Voice AI.');
  const [codeLangTab, setCodeLangTab] = useState<'curl' | 'js' | 'python' | 'csharp' | 'php'>('curl');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live test result in API playground
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);

  useEffect(() => {
    setApiKeys(StorageService.getApiKeys());
    setDailyUsage(StorageService.getDailyUsage());
    setRequestLogs(StorageService.getRequestLogs());
  }, []);

  const refreshData = () => {
    setApiKeys(StorageService.getApiKeys());
    setDailyUsage(StorageService.getDailyUsage());
    setRequestLogs(StorageService.getRequestLogs());
    onRefreshUsage();
  };

  // Create API Key
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const { item, secretKey } = StorageService.createApiKey(newKeyName.trim());
    setApiKeys(StorageService.getApiKeys());
    setNewKeyName('');
    setIsCreatingKey(false);
    setCreatedSecretKey(secretKey);
  };

  // Revoke Key
  const handleRevokeKey = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) {
      StorageService.revokeApiKey(id);
      setApiKeys(StorageService.getApiKeys());
    }
  };

  // Run Live Test from API Playground
  const handleRunLiveApiTest = async () => {
    setIsTestingApi(true);
    setTestResponse(null);

    try {
      const activeKey = apiKeys.find((k) => !k.revoked)?.maskedKey || 'ax_live_preview_token';
      const res = await fetch('/v1/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          text: sampleText,
          language: langCode,
          voice: voiceName,
          style: styleName,
          format: audioFormat,
        }),
      });

      const json = await res.json();
      setTestResponse(JSON.stringify(json, null, 2));
      refreshData();
    } catch (err: any) {
      setTestResponse(
        JSON.stringify(
          {
            success: false,
            error: { code: 'NETWORK_ERROR', message: err.message },
          },
          null,
          2
        )
      );
    } finally {
      setIsTestingApi(false);
    }
  };

  // Dynamic code snippets
  const baseUrl = window.location.origin;
  const snippetData = {
    curl: `curl -X POST "${baseUrl}/v1/text-to-speech" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "${sampleText}",
    "language": "${langCode}",
    "voice": "${voiceName}",
    "style": "${styleName.toLowerCase()}",
    "speed": 1.0,
    "format": "${audioFormat}"
  }'`,

    js: `// JavaScript (Node.js / Browser)
const response = await fetch("${baseUrl}/v1/text-to-speech", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    text: "${sampleText}",
    language: "${langCode}",
    voice: "${voiceName}",
    style: "${styleName.toLowerCase()}",
    speed: 1.0,
    format: "${audioFormat}"
  })
});

const data = await response.json();
console.log("Audio URL:", data.audio_url);`,

    python: `# Python 3
import requests

url = "${baseUrl}/v1/text-to-speech"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "text": "${sampleText}",
    "language": "${langCode}",
    "voice": "${voiceName}",
    "style": "${styleName.toLowerCase()}",
    "speed": 1.0,
    "format": "${audioFormat}"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,

    csharp: `// C# .NET HttpClient
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");

        var json = @"{
            ""text"": ""${sampleText}"",
            ""language"": ""${langCode}"",
            ""voice"": ""${voiceName}"",
            ""style"": ""${styleName.toLowerCase()}"",
            ""speed"": 1.0,
            ""format"": ""${audioFormat}""
        }";

        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await client.PostAsync("${baseUrl}/v1/text-to-speech", content);
        var result = await response.Content.ReadAsStringAsync();
        Console.WriteLine(result);
    }
}`,

    php: `<?php
// PHP cURL
$ch = curl_init('${baseUrl}/v1/text-to-speech');
$payload = json_encode([
    'text' => '${sampleText}',
    'language' => '${langCode}',
    'voice' => '${voiceName}',
    'style' => '${styleName.toLowerCase()}',
    'speed' => 1.0,
    'format' => '${audioFormat}'
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(snippetData[codeLangTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Console Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Developer API Console</h1>
            <span className="rounded bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">v1.4</span>
          </div>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your API keys, monitor daily quotas, test endpoints, and inspect logs.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            title="Refresh metrics"
            className="p-2 rounded-lg border border-neutral-300 bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 shadow-xs transition-colors"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            API Docs
          </button>
        </div>
      </div>

      {/* Console Tab Navigation */}
      <div className="mt-6 flex border-b border-neutral-200 overflow-x-auto space-x-1 sm:space-x-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'playground', label: 'API Playground', icon: Terminal },
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'usage', label: 'Usage & Quotas', icon: BarChart3 },
          { id: 'logs', label: 'Request Logs', icon: Clock },
          { id: 'account', label: 'Account', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = consoleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setConsoleTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {consoleTab === 'overview' && (
        <div className="mt-8 space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-medium text-neutral-500">Requests Today</span>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{dailyUsage.requests}</div>
              <div className="mt-1 text-[11px] text-neutral-400">Total API & Playground calls</div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-medium text-neutral-500">Characters Processed</span>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{dailyUsage.characters.toLocaleString()}</div>
              <div className="mt-1 text-[11px] text-neutral-400">Synthesized characters today</div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-medium text-emerald-700">Successful Requests</span>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{dailyUsage.successfulRequests}</div>
              <div className="mt-1 text-[11px] text-neutral-400">HTTP 200 OK responses</div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-medium text-neutral-500">Failed Requests</span>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{dailyUsage.failedRequests}</div>
              <div className="mt-1 text-[11px] text-neutral-400">Errors & quota stops</div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-emerald-50/50 p-5 shadow-xs">
              <span className="text-xs font-semibold text-emerald-800">Remaining Free Quota</span>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {remainingQuota} <span className="text-xs text-neutral-500 font-normal">/ {totalQuota}</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600">
                {remainingQuota} requests remaining today
              </div>
            </div>
          </div>

          {/* Quick Start Card & Interactive Snippet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Endpoint Quick Start</h3>
                  <p className="text-xs text-neutral-500">Call AxiTex Voice AI using HTTP POST with your Bearer token.</p>
                </div>
                <button
                  onClick={() => setConsoleTab('playground')}
                  className="text-xs font-semibold text-neutral-900 hover:underline"
                >
                  Open Interactive Playground →
                </button>
              </div>

              <div className="mt-4 rounded-lg bg-neutral-900 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                <pre>{snippetData.curl}</pre>
              </div>
            </div>

            {/* Quota Progress & Account summary */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Free Tier Usage</h3>
                <p className="text-xs text-neutral-500 mt-1">Your daily limit resets automatically every 24 hours.</p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                    <span>Daily Request Quota</span>
                    <span>{dailyUsage.requests} / {totalQuota}</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dailyUsage.requests >= totalQuota ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (dailyUsage.requests / totalQuota) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1">
                  <div className="text-neutral-600">
                    Plan: <strong className="text-neutral-900 uppercase">{user.plan}</strong>
                  </div>
                  <div className="text-neutral-600">
                    Max payload: <strong>2,000 characters/request</strong>
                  </div>
                  <div className="text-neutral-600">
                    Engine: <strong>Google Gemini TTS</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setConsoleTab('keys')}
                className="mt-6 w-full rounded-lg bg-neutral-900 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition-colors"
              >
                Manage API Keys
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: INTERACTIVE API PLAYGROUND ================= */}
      {consoleTab === 'playground' && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Interactive API Playground</h3>
                <p className="text-xs text-neutral-500">
                  Configure speech parameters and generate ready-to-run code in multiple languages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCodeToClipboard}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>

                <button
                  onClick={handleRunLiveApiTest}
                  disabled={isTestingApi}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
                >
                  {isTestingApi ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-white" />
                  )}
                  {isTestingApi ? 'Running API...' : 'Test Live API'}
                </button>
              </div>
            </div>

            {/* Playground Configuration Bar */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Language
                </label>
                <select
                  value={langCode}
                  onChange={(e) => setLangCode(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="en-US">en-US (English US)</option>
                  <option value="en-IN">en-IN (English India)</option>
                  <option value="hi-IN">hi-IN (Hindi)</option>
                  <option value="bn-IN">bn-IN (Bengali)</option>
                  <option value="ta-IN">ta-IN (Tamil)</option>
                  <option value="te-IN">te-IN (Telugu)</option>
                  <option value="mr-IN">mr-IN (Marathi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Voice
                </label>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Kore">Kore (Warm, Female)</option>
                  <option value="Puck">Puck (Expressive, Male)</option>
                  <option value="Aoede">Aoede (Breezy, Female)</option>
                  <option value="Charon">Charon (Calm, Male)</option>
                  <option value="Fenrir">Fenrir (Deep, Male)</option>
                  <option value="Zephyr">Zephyr (Bright, Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Style
                </label>
                <select
                  value={styleName}
                  onChange={(e) => setStyleName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Natural">Natural</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Professional">Professional</option>
                  <option value="Calm">Calm</option>
                  <option value="Energetic">Energetic</option>
                  <option value="News">News</option>
                  <option value="Storytelling">Storytelling</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Format
                </label>
                <select
                  value={audioFormat}
                  onChange={(e) => setAudioFormat(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="wav">WAV (Lossless 24kHz)</option>
                  <option value="mp3">MP3</option>
                </select>
              </div>
            </div>

            {/* Sample text input */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Request Text Payload
              </label>
              <input
                type="text"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="Enter text payload..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Language Code Tabs */}
            <div className="mt-6">
              <div className="flex items-center gap-2 border-b border-neutral-200">
                {(['curl', 'js', 'python', 'csharp', 'php'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeLangTab(tab)}
                    className={`py-2 px-3 text-xs font-semibold border-b-2 uppercase tracking-wider transition-colors ${
                      codeLangTab === tab
                        ? 'border-neutral-900 text-neutral-900'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {tab === 'js' ? 'JavaScript' : tab === 'csharp' ? 'C#' : tab}
                  </button>
                ))}
              </div>

              {/* Code Display */}
              <div className="relative mt-3 rounded-lg bg-neutral-900 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                <pre>{snippetData[codeLangTab]}</pre>
              </div>
            </div>

            {/* Live Test Response Box */}
            {testResponse && (
              <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-700">Live API Response</span>
                  <span className="text-[10px] text-neutral-400">HTTP POST /v1/text-to-speech</span>
                </div>
                <pre className="rounded bg-white p-3 font-mono text-xs text-neutral-800 border border-neutral-200 overflow-x-auto max-h-60">
                  {testResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: API KEYS ================= */}
      {consoleTab === 'keys' && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">API Keys</h3>
                <p className="text-xs text-neutral-500">
                  API keys grant full access to your AxiTex account. Store them securely and never expose them in client-side code.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingKey(true)}
                className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New API Key
              </button>
            </div>

            {/* Created Key Secret Reveal Modal */}
            {createdSecretKey && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-amber-900">Save your new API Key</h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Please copy your key now. For your security, this key will never be shown again in complete plaintext.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={createdSecretKey}
                        className="w-full rounded bg-white px-3 py-2 font-mono text-xs font-semibold text-neutral-900 border border-amber-300"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdSecretKey);
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }}
                        className="flex items-center gap-1 rounded bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800"
                      >
                        {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedKey ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => setCreatedSecretKey(null)}
                        className="rounded border border-amber-400 bg-white px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Key Form */}
            {isCreatingKey && (
              <form onSubmit={handleCreateApiKey} className="mt-4 rounded-lg bg-neutral-50 p-4 border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">Create New Key</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key name, e.g. 'Production Website', 'Backend Worker'"
                    className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingKey(false)}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Keys Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-800 uppercase font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Key Token</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {apiKeys.map((k) => (
                    <tr key={k.id} className="hover:bg-neutral-50/70">
                      <td className="py-3.5 px-4 font-semibold text-neutral-900">{k.name}</td>
                      <td className="py-3.5 px-4 font-mono text-neutral-700">{k.maskedKey}</td>
                      <td className="py-3.5 px-4 text-neutral-500">
                        {new Date(k.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {k.revoked ? (
                          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                            Revoked
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!k.revoked && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: USAGE & QUOTAS ================= */}
      {consoleTab === 'usage' && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Usage & Quota Analytics</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Track your daily request volume, character consumption, and service response rates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">Current Rate Limit</span>
                <div className="text-xl font-bold text-neutral-900 mt-1">60 req / min</div>
                <p className="text-[11px] text-neutral-500 mt-1">Automatic throttling protects against traffic spikes</p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">Daily Quota Status</span>
                <div className="text-xl font-bold text-neutral-900 mt-1">
                  {dailyUsage.requests} / {totalQuota} used
                </div>
                <p className="text-[11px] text-emerald-600 mt-1">{remainingQuota} requests remaining today</p>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-500">Average Generation Speed</span>
                <div className="text-xl font-bold text-neutral-900 mt-1">340 ms</div>
                <p className="text-[11px] text-neutral-500 mt-1">Google Gemini Flash audio streaming</p>
              </div>
            </div>

            {/* Visual Bar Breakdown */}
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                Daily Requests Activity
              </h4>
              <div className="flex items-end gap-3 h-36 pt-4 pb-2 border-b border-neutral-200">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'].map((day, idx) => {
                  const heights = [28, 45, 60, 50, 75, 40, Math.min(100, Math.max(15, dailyUsage.requests * 8))];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full rounded-t-sm bg-neutral-900 transition-all hover:bg-emerald-600"
                        style={{ height: `${heights[idx]}%` }}
                      />
                      <span className="text-[10px] text-neutral-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: REQUEST LOGS ================= */}
      {consoleTab === 'logs' && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Privacy-Conscious Request Logs</h3>
                <p className="text-xs text-neutral-500">
                  Inspect endpoint traffic, status codes, and latencies. User text payloads are never retained in logs.
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-800 uppercase font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Voice / Lang</th>
                    <th className="py-3 px-4">Characters</th>
                    <th className="py-3 px-4 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-mono">
                  {requestLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/70">
                      <td className="py-3 px-4 text-neutral-900 font-medium">{log.id}</td>
                      <td className="py-3 px-4 text-neutral-500">{log.timestamp}</td>
                      <td className="py-3 px-4 text-neutral-800">{log.endpoint}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            log.status === 200
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-700 font-sans">
                        {log.voice} ({log.language})
                      </td>
                      <td className="py-3 px-4">{log.characters} chars</td>
                      <td className="py-3 px-4 text-right text-neutral-900">{log.durationMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ACCOUNT & PRESETS ================= */}
      {consoleTab === 'account' && (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
                <div>
                  <span className="text-neutral-500">Account Name:</span>
                  <div className="font-semibold text-neutral-900 text-sm">{user.name}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Email Address:</span>
                  <div className="font-semibold text-neutral-900 text-sm">{user.email}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Plan:</span>
                  <div className="font-semibold text-neutral-900 uppercase">{user.plan} Tier</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
                <div>
                  <span className="text-neutral-500">Daily Requests Limit:</span>
                  <div className="font-semibold text-neutral-900 text-sm">{totalQuota} requests / day</div>
                </div>
                <div>
                  <span className="text-neutral-500">Authentication:</span>
                  <div className="font-semibold text-neutral-900 text-sm">Firebase Authentication & API Keys</div>
                </div>
                <div>
                  <span className="text-neutral-500">Created:</span>
                  <div className="font-semibold text-neutral-900 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
