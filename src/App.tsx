/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Playground } from './components/Playground';
import { DeveloperConsole } from './components/DeveloperConsole';
import { DocumentationView } from './components/DocumentationModal';
import { PricingView } from './components/PricingView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { StatusModal } from './components/StatusModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { StorageService } from './services/storage';
import { SystemSettings, UserProfile } from './types';
import { AlertCircle, Wrench, Mail, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'playground' | 'console' | 'docs' | 'pricing'>('home');
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [settings, setSettings] = useState<SystemSettings>(StorageService.getSystemSettings());

  // Quota states
  const [dailyUsage, setDailyUsage] = useState(StorageService.getDailyUsage());
  const totalDailyQuota = settings.freeDailyLimit || 50;
  const remainingRequests = Math.max(0, totalDailyQuota - dailyUsage.requests);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [privacyModalType, setPrivacyModalType] = useState<'privacy' | 'terms' | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Refresh usage helper
  const handleUsageUpdate = () => {
    setDailyUsage(StorageService.getDailyUsage());
  };

  const handleSettingsSaved = () => {
    setSettings(StorageService.getSystemSettings());
    setUser(StorageService.getUserProfile());
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50 text-neutral-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Maintenance Mode Banner */}
      {settings.maintenanceMode && (
        <div className="bg-amber-500 text-neutral-900 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <Wrench className="h-4 w-4" />
          <span>System Maintenance in progress. Audio synthesis may experience minor delays.</span>
        </div>
      )}

      {/* Account Suspended Banner */}
      {user.disabled && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>Your developer account has been suspended by system administrators. Please contact support.</span>
        </div>
      )}

      {/* Daily Free Usage Limit Reached Banner */}
      {remainingRequests === 0 && (
        <div className="bg-neutral-900 text-white px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 border-b border-neutral-800">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span>
            You have reached today's free usage limit ({totalDailyQuota} requests/day). Please try again tomorrow or upgrade your quota.
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        remainingRequests={remainingRequests}
        totalDailyQuota={totalDailyQuota}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStatus={() => setIsStatusOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <Hero
              onTryPlayground={() => setActiveTab('playground')}
              onViewDocs={() => setActiveTab('docs')}
            />
            {/* Live Playground section directly on Home */}
            <Playground
              maxCharacters={settings.maxCharactersPerRequest || 2000}
              onUsageUpdate={handleUsageUpdate}
              onOpenConsole={() => setActiveTab('console')}
            />
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="py-6">
            <Playground
              maxCharacters={settings.maxCharactersPerRequest || 2000}
              onUsageUpdate={handleUsageUpdate}
              onOpenConsole={() => setActiveTab('console')}
            />
          </div>
        )}

        {activeTab === 'console' && (
          <DeveloperConsole
            user={user}
            remainingQuota={remainingRequests}
            totalQuota={totalDailyQuota}
            onRefreshUsage={handleUsageUpdate}
            onOpenDocs={() => setActiveTab('docs')}
          />
        )}

        {activeTab === 'docs' && <DocumentationView />}

        {activeTab === 'pricing' && (
          <PricingView onSelectFreePlan={() => setActiveTab('playground')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenDocs={() => setActiveTab('docs')}
        onOpenConsole={() => setActiveTab('console')}
        onOpenPrivacy={() => setPrivacyModalType('privacy')}
        onOpenTerms={() => setPrivacyModalType('terms')}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUserChange={(newUser) => setUser(newUser)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={user}
        onSettingsSaved={handleSettingsSaved}
      />

      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
      />

      <PrivacyTermsModal
        isOpen={privacyModalType !== null}
        onClose={() => setPrivacyModalType(null)}
        type={privacyModalType || 'privacy'}
      />

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-neutral-900">Contact AxiTex Support</h3>
              </div>
              <button
                onClick={() => {
                  setIsContactOpen(false);
                  setContactSent(false);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            {contactSent ? (
              <div className="py-8 text-center space-y-2">
                <Check className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-neutral-900">Message Received</h4>
                <p className="text-xs text-neutral-500">
                  Our engineering team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsContactOpen(false);
                    setContactSent(false);
                  }}
                  className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSent(true);
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    defaultValue={user.email}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="API Quota Increase or Technical Question"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or integration requirements..."
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsContactOpen(false)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
