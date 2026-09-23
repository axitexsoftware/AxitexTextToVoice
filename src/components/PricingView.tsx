import React from 'react';
import { Check, Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface PricingViewProps {
  onSelectFreePlan: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectFreePlan }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          Transparent Developer Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Simple, Predictable Voice AI Pricing
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600">
          Start for free with generous daily developer quotas. Upgrade as your application scales.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FREE TIER */}
        <div className="rounded-2xl border-2 border-neutral-900 bg-white p-7 shadow-sm flex flex-col justify-between relative">
          <div className="absolute -top-3 left-6 rounded-full bg-neutral-900 px-3 py-0.5 text-[11px] font-semibold text-white">
            Current Plan
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Free Tier</h3>
            <p className="text-xs text-neutral-500 mt-1">For testing, experiments, and hobbyist projects.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-neutral-900">$0</span>
              <span className="text-xs text-neutral-500 font-medium">/ month</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>50 TTS requests / day</strong> (configurable)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Up to <strong>2,000 characters</strong> per request</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>All 8 Google Gemini Voice Models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>14+ Multilingual Locales</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Custom Voice Presets storage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Developer API Key Access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onSelectFreePlan}
            className="mt-8 w-full rounded-xl bg-neutral-900 py-3 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition-colors"
          >
            Start Building with Free Tier
          </button>
        </div>

        {/* DEVELOPER PRO TIER */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Popular for SaaS
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mt-2">Developer Pro</h3>
            <p className="text-xs text-neutral-500 mt-1">For production applications and growing startups.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-neutral-900">$29</span>
              <span className="text-xs text-neutral-500 font-medium">/ month</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>5,000 TTS requests / day</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Up to <strong>10,000 characters</strong> per request</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>High-priority low latency audio synthesis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited custom voice presets</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Multiple API keys & team sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct Slack developer support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onSelectFreePlan}
            className="mt-8 w-full rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* ENTERPRISE TIER */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Enterprise</h3>
            <p className="text-xs text-neutral-500 mt-1">Dedicated infrastructure, bespoke SLAs, and custom voices.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-neutral-900">Custom</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-neutral-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited high-volume throughput</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Dedicated Cloud Run & Vertex AI instances</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Custom voice training & multi-speaker models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>99.99% SLA commitment</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Dedicated account manager & VPC peering</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onSelectFreePlan}
            className="mt-8 w-full rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-neutral-900 shadow-xs hover:bg-neutral-50 transition-colors"
          >
            Contact Enterprise Sales
          </button>
        </div>
      </div>
    </div>
  );
};
