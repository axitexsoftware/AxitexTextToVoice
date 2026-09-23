import React from 'react';
import { X, CheckCircle2, Activity, Server, Clock, ShieldCheck, Zap } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <h3 className="text-lg font-bold text-neutral-900">AxiTex API Status</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Banner */}
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900">All Systems Operational</div>
              <div className="text-[11px] text-emerald-700">Sub-400ms neural synthesis across all regions</div>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-800">99.98% Uptime</span>
        </div>

        {/* Components Grid */}
        <div className="mt-4 space-y-2 text-xs">
          {[
            { name: 'Google Gemini TTS Engine', status: 'Operational', latency: '280ms' },
            { name: 'Developer REST API (/v1)', status: 'Operational', latency: '42ms' },
            { name: 'Firebase Authentication & Firestore', status: 'Operational', latency: '65ms' },
            { name: 'Quota & Rate Limiting Enforcement', status: 'Operational', latency: '<5ms' },
            { name: 'Audio CDN & Stream Delivery', status: 'Operational', latency: '35ms' },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/70"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-neutral-800">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-neutral-500">{item.latency}</span>
                <span className="text-[11px] font-semibold text-emerald-700">{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Historical incident note */}
        <div className="mt-5 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>Zero incidents reported in the last 90 days.</span>
          <button
            onClick={onClose}
            className="font-semibold text-neutral-900 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
