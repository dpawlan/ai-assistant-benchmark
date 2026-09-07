'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  agentName: string;
  agentUrl: string;
  categories: string[];
  contact: string;
  notes: string;
}

const initialFormData: FormData = {
  agentName: '',
  agentUrl: '',
  categories: [],
  contact: '',
  notes: '',
};

const CATEGORY_OPTIONS = [
  { key: 'online_task', label: 'Online Tasks' },
  { key: 'recommendation_quality', label: 'Recommendations' },
  { key: 'purchasing', label: 'Purchasing' },
  { key: 'email_replies', label: 'Email Replies' },
  { key: 'proactive_behavior', label: 'Proactive Behavior' },
  { key: 'running_routine', label: 'Running Routines' },
  { key: 'third_party_integrations', label: 'Integrations' },
  { key: 'memory', label: 'Memory' },
  { key: 'personality', label: 'Personality' },
  { key: 'phone_calls', label: 'Phone Calls' },
  { key: 'multiplayer_groups', label: 'Multiplayer/Groups' },
  { key: 'chained_tasks', label: 'Chained Tasks' },
  { key: 'proactive_restraint', label: 'Proactive Restraint' },
  { key: 'content_creation_games', label: 'Content Creation' },
];

export function RequestForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryToggle = (categoryKey: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryKey)
        ? prev.categories.filter(c => c !== categoryKey)
        : [...prev.categories, categoryKey],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch {
      setError('There was an issue submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-green/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-xl mb-2">Request Submitted!</h3>
        <p className="text-secondary mb-6">
          Thanks for helping us expand our benchmark. We&apos;ll review your request soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-bubble-blue hover:underline text-sm font-medium"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="agentName" className="block text-sm font-medium mb-2">
          AI Assistant Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="agentName"
          required
          value={formData.agentName}
          onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
          placeholder="e.g., Instinct, Poke, Town, etc."
          className="w-full px-4 py-3 bg-bubble-gray/50 rounded-xl border-0 text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-bubble-blue/30"
        />
      </div>

      <div>
        <label htmlFor="agentUrl" className="block text-sm font-medium mb-2">
          Website URL
        </label>
        <input
          type="url"
          id="agentUrl"
          value={formData.agentUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, agentUrl: e.target.value }))}
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-bubble-gray/50 rounded-xl border-0 text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-bubble-blue/30"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">
          Categories to Test <span className="text-secondary font-normal">(select relevant ones)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map(category => (
            <button
              key={category.key}
              type="button"
              onClick={() => handleCategoryToggle(category.key)}
              className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                formData.categories.includes(category.key)
                  ? 'bg-bubble-blue text-white'
                  : 'bg-bubble-gray/50 text-foreground hover:bg-bubble-gray'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium mb-2">
          Contact (Email or X handle)
        </label>
        <input
          type="text"
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          placeholder="you@example.com or @yourhandle"
          className="w-full px-4 py-3 bg-bubble-gray/50 rounded-xl border-0 text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-bubble-blue/30"
        />
        <p className="mt-1.5 text-xs text-secondary">
          Optional. We&apos;ll follow up when testing is complete.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any specific use cases, features, or context you'd like us to focus on..."
          className="w-full px-4 py-3 bg-bubble-gray/50 rounded-xl border-0 text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-bubble-blue/30 resize-none"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !formData.agentName}
        className="w-full py-3 px-6 bg-bubble-blue text-white rounded-full font-medium hover:bg-bubble-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
