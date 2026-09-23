import React from 'react';
import { X, ShieldCheck, Lock, FileText, Database } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-neutral-900">
              {type === 'privacy' ? 'AxiTex Privacy Policy' : 'AxiTex Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-neutral-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1 flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-emerald-600" /> 1. Audio Processing & Synthesis
                </h4>
                <p>
                  When you submit text to AxiTex Voice AI, the text is securely transmitted via TLS 1.3 to our backend API and processed with Google Gemini TTS models. Audio is generated in transient memory and delivered directly back to your client.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-emerald-600" /> 2. Data Retention & Privacy-Conscious Logging
                </h4>
                <p>
                  We do not retain or persist the textual content of your synthesis requests in developer logs by default. Our request telemetry only captures request IDs, character counts, voice IDs, status codes, and execution latencies to protect your privacy and intellectual property.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> 3. API Key Security & Credentials
                </h4>
                <p>
                  API keys are stored using cryptographic hashes. Secret keys are displayed only once at creation time and never stored in raw plaintext in permanent records. AxiTex never exposes Google Gemini API keys or service account credentials in browser-side scripts.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">4. User Profiles & Presets</h4>
                <p>
                  Your account metadata and custom voice presets are associated with your authenticated profile. You can delete your custom presets or revoke your API keys at any time through the developer console.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">1. Acceptable Use</h4>
                <p>
                  You agree not to use AxiTex Voice AI to generate unlawful content, impersonate individuals without consent, bypass rate limiting mechanisms, or launch denial of service attacks.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">2. Service Quotas & Fair Use</h4>
                <p>
                  Free tier accounts are subject to daily request limits (50 requests per day) and maximum character constraints (2,000 characters per request). Abuse or automated quota bypassing may result in immediate suspension.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">3. Ownership of Generated Audio</h4>
                <p>
                  Subject to your compliance with these terms, you retain full ownership and commercial distribution rights for audio generated using your authenticated AxiTex developer account.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-1">4. Limitation of Liability</h4>
                <p>
                  AxiTex Software provides services on an "as is" and "as available" basis without warranties of uninterrupted uptime or error-free neural generation.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
