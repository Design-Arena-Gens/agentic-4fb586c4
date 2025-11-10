'use client';

import { useState } from 'react';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';
import AIBlueprintOrganizer from '@/components/AIBlueprintOrganizer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'ai'>('matrix');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Productivity Hub
          </h1>
          <div className="flex gap-4 border-b border-slate-300">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eisenhower Matrix
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'ai'
                  ? 'border-b-4 border-purple-600 text-purple-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Blueprint Organizer
            </button>
          </div>
        </header>

        {activeTab === 'matrix' ? <EisenhowerMatrix /> : <AIBlueprintOrganizer />}
      </div>
    </main>
  );
}
