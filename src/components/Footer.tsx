import React from 'react';
import { Volume2, Heart, Github, Twitter, Mail } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onOpenConsole: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDocs,
  onOpenConsole,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
}) => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <Volume2 className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-base font-bold text-neutral-900">AxiTex Voice AI</span>
              <span className="text-xs text-neutral-500">• AxiTex Software</span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              "Human-like Voice. Simple API."
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-neutral-600">
            <button
              onClick={onOpenDocs}
              className="hover:text-neutral-900 transition-colors"
            >
              Documentation
            </button>
            <button
              onClick={onOpenConsole}
              className="hover:text-neutral-900 transition-colors"
            >
              API Console
            </button>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-neutral-900 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-neutral-900 transition-colors"
            >
              Terms
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-neutral-900 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} AxiTex Software. All rights reserved.</div>
          <div className="mt-2 sm:mt-0 flex items-center gap-1">
            Powered by Google Gemini Neural Audio Technology
          </div>
        </div>
      </div>
    </footer>
  );
};
