// Advanced filtering component for admin dashboards

import React, { useState } from 'react';
import { Filter, X, Calendar, MapPin, Star, DollarSign, Clock, Search } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'text';
  options?: Array<{ value: string; label: string }>;
  value?: any;
  placeholder?: string;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  showSavedFilters?: boolean;
  savedFilters?: Array<{ id: string; name: string; filters: Record<string, any> }>;
  onSaveFilter?: (name: string, filters: Record<string, any>) => void;
  onLoadFilter?: (filters: Record<string, any>) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  showSavedFilters = false,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const updateFilter = (filterId: string, value: any) => {
    const newFilters = { ...filterValues, [filterId]: value };
    setFilterValues(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    setFilterValues({});
    onReset();
  };

  const saveCurrentFilters = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName.trim(), filterValues);
      setSaveFilterName('');
      setShowSaveModal(false);
    }
  };

  const loadSavedFilter = (savedFilter: { filters: Record<string, any> }) => {
    setFilterValues(savedFilter.filters);
    if (onLoadFilter) {
      onLoadFilter(savedFilter.filters);
    }
  };

  const activeFilterCount = Object.values(filterValues).filter(value => 
    value !== undefined && value !== '' && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const renderFilterInput = (filter: FilterOption) => {
    const value = filterValues[filter.id] || filter.value;

    switch (filter.type) {
      case 'select':
        return (
          <select
            className="form-input text-sm"
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          >
            <option value="">All</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="relative">
            <select
              className="form-input text-sm"
              multiple
              value={value || []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                updateFilter(filter.id, selectedValues);
              }}
            >
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="form-input text-sm"
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          />
        );

      case 'daterange':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              className="form-input text-sm"
              value={value?.start || ''}
              onChange={(e) => updateFilter(filter.id, { ...value, start: e.target.value })}
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="form-input text-sm"
              value={value?.end || ''}
              onChange={(e) => updateFilter(filter.id, { ...value, end: e.target.value })}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            className="form-input text-sm"
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            className="form-input text-sm"
            placeholder={filter.placeholder}
            value={value || ''}
            onChange={(e) => updateFilter(filter.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <Filter size={20} className="mr-2" />
            <span className="font-medium">Advanced Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            {showSavedFilters && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="btn-secondary text-sm"
                disabled={activeFilterCount === 0}
              >
                Save Filter
              </button>
            )}
            
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="btn-secondary text-sm flex items-center"
              >
                <X size={16} className="mr-1" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Filters */}
      {showSavedFilters && savedFilters.length > 0 && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Saved Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map(savedFilter => (
              <button
                key={savedFilter.id}
                onClick={() => loadSavedFilter(savedFilter)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {savedFilter.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Save Filter</h3>
            </div>
            
            <div className="p-6">
              <label className="form-label">Filter Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter a name for this filter..."
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentFilters}
                disabled={!saveFilterName.trim()}
                className="btn-primary disabled:opacity-50"
              >
                Save Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;