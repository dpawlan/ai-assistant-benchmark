'use client';

import { AgentStatus } from '@/lib/types';

export type SortOption = 'name' | 'feedback' | 'signal';

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
    <div className="space-y-4 mb-6">
      <div className="relative">
        <svg 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          placeholder="Search assistants..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input pl-12"
          aria-label="Search assistants"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <StatusChip 
            active={statusFilter === 'all'} 
            onClick={() => onStatusChange('all')}
          >
            All
          </StatusChip>
          <StatusChip 
            active={statusFilter === 'confirmed'} 
            onClick={() => onStatusChange('confirmed')}
          >
            Confirmed
          </StatusChip>
          <StatusChip 
            active={statusFilter === 'stretch'} 
            onClick={() => onStatusChange('stretch')}
          >
            Stretch
          </StatusChip>
        </div>
        
        <div className="flex-1 min-w-0" />
        
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="h-9 px-3 bg-bubble text-caption font-medium rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-tint appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2386868b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px'
          }}
          aria-label="Sort by"
        >
          <option value="feedback">Most feedback</option>
          <option value="name">Name A-Z</option>
          <option value="signal">Signal strength</option>
        </select>
      </div>
      
      <p className="text-caption text-secondary">
        {filteredCount === totalCount 
          ? `${totalCount} assistants` 
          : `${filteredCount} of ${totalCount} assistants`
        }
      </p>
    </div>
  );
}

function StatusChip({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip touch-target ${active ? 'chip-active' : ''}`}
    >
      {children}
    </button>
  );
}
