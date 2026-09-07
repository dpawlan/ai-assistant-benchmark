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
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(52,199,89,0.12)] flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-[#248a3d]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h3 className="text-title mb-2">Request Submitted</h3>
        <p className="text-body text-secondary mb-6">
          Thanks for helping us expand our benchmark. We&apos;ll review your request soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-accent text-body font-medium hover:underline touch-target"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="agentName" className="block text-body-semibold mb-2">
          AI Assistant Name <span className="text-[#d70015]">*</span>
        </label>
        <input
          type="text"
          id="agentName"
          required
          value={formData.agentName}
          onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
          placeholder="e.g., Instinct, Poke, Town"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="agentUrl" className="block text-body-semibold mb-2">
          Website URL
        </label>
        <input
          type="url"
          id="agentUrl"
          value={formData.agentUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, agentUrl: e.target.value }))}
          placeholder="https://example.com"
          className="input"
        />
      </div>

      <div>
        <label className="block text-body-semibold mb-3">
          Categories to Test{' '}
          <span className="font-normal text-secondary">(select relevant ones)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map(category => (
            <button
              key={category.key}
              type="button"
              onClick={() => handleCategoryToggle(category.key)}
              className={`chip touch-target ${
                formData.categories.includes(category.key) ? 'chip-active' : ''
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="contact" className="block text-body-semibold mb-2">
          Contact (Email or X handle)
        </label>
        <input
          type="text"
          id="contact"
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          placeholder="you@example.com or @yourhandle"
          className="input"
        />
        <p className="mt-2 text-caption text-secondary">
          Optional. We&apos;ll follow up when testing is complete.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-body-semibold mb-2">
          Additional Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any specific use cases, features, or context..."
          className="textarea"
        />
      </div>

      {error && (
        <div className="p-4 bg-[rgba(215,0,21,0.08)] text-[#d70015] rounded-xl text-body">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !formData.agentName}
        className="btn-primary w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
