'use client';

import { AgentStatus } from '@/lib/types';

export type SortOption = 'name' | 'feedback' | 'vendor';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AgentStatus | 'all';
  onStatusChange: (status: AgentStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div className="bg-card rounded-2xl p-4 card-shadow mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bubble-gray/50 rounded-xl border-0 text-sm placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-bubble-blue/30"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as AgentStatus | 'all')}
            className="px-4 py-2.5 bg-bubble-gray/50 rounded-xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-bubble-blue/30 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="stretch">Stretch</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-bubble-gray/50 rounded-xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-bubble-blue/30 cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="feedback">Sort by Feedback</option>
            <option value="vendor">Sort by Vendor</option>
          </select>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-secondary">
        Showing {filteredCount} of {totalCount} assistants
      </div>
    </div>
  );
}
