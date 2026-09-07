'use client';

import { useState, useMemo } from 'react';
import { Agent } from '@/lib/types';
import { AgentCard } from './AgentCard';
import { FilterBar, SortOption } from './FilterBar';

interface LeaderboardProps {
  agents: Agent[];
}

export function Leaderboard({ agents }: LeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'stretch'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('feedback');

  const filteredAndSortedAgents = useMemo(() => {
    let result = [...agents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        agent =>
          agent.name.toLowerCase().includes(query) ||
          agent.vendor.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(agent => agent.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'feedback':
          return b.feedback.length - a.feedback.length;
        case 'vendor':
          return a.vendor.localeCompare(b.vendor);
        default:
          return 0;
      }
    });

    return result;
  }, [agents, searchQuery, statusFilter, sortBy]);

  return (
    <div>
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={agents.length}
        filteredCount={filteredAndSortedAgents.length}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedAgents.map(agent => (
          <AgentCard key={agent.slug} agent={agent} />
        ))}
      </div>
      
      {filteredAndSortedAgents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bubble-gray/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">No assistants found</h3>
          <p className="text-secondary">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
