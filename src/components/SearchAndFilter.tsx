import { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export interface SearchFilters {
  searchTerm: string;
  category?: string;
  level?: string;
  status?: string;
  priceRange?: { min: number; max: number };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface SearchAndFilterProps<T> {
  data: T[];
  onFilteredData: (filteredData: T[]) => void;
  searchFields: (keyof T)[];
  categories?: string[];
  levels?: string[];
  statuses?: string[];
  className?: string;
}

export default function SearchAndFilter<T extends Record<string, any>>({
  data,
  onFilteredData,
  searchFields,
  categories = [],
  levels = [],
  statuses = [],
  className = '',
}: SearchAndFilterProps<T>) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    level: '',
    status: '',
    priceRange: { min: 0, max: 10000 },
    sortBy: '',
    sortOrder: 'asc',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Text search across specified fields
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        }),
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (item) =>
          item.category === filters.category || item.type === filters.category,
      );
    }

    // Level filter
    if (filters.level) {
      filtered = filtered.filter((item) => item.level === filters.level);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((item) => {
        if (filters.status === 'published') return item.isPublished === true;
        if (filters.status === 'draft') return item.isPublished === false;
        if (filters.status === 'active') return item.isActive === true;
        if (filters.status === 'inactive') return item.isActive === false;
        return true;
      });
    }

    // Price range filter (only apply to items that have a price property)
    if (filters.priceRange) {
      filtered = filtered.filter((item) => {
        if ('price' in item && typeof item.price === 'number') {
          return (
            item.price >= filters.priceRange!.min &&
            item.price <= filters.priceRange!.max
          );
        }
        return true; // Keep items without price property
      });
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return filters.sortOrder === 'desc' ? -comparison : comparison;
        }

        return 0;
      });
    }

    return filtered;
  }, [data, filters, searchFields]);

  // Update parent component with filtered data
  useMemo(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      level: '',
      status: '',
      priceRange: { min: 0, max: 10000 },
      sortBy: '',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.level ||
    filters.status ||
    (filters.priceRange &&
      (filters.priceRange.min > 0 || filters.priceRange.max < 10000)) ||
    filters.sortBy;

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Main Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Level Filter */}
            {levels.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => updateFilter('level', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            {statuses.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Default</option>
                  <option value="title">Title</option>
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Last Updated</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    updateFilter('sortOrder', e.target.value as 'asc' | 'desc')
                  }
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={!filters.sortBy}
                >
                  <option value="asc">↑</option>
                  <option value="desc">↓</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredData.length} of {data.length} results
          {filters.searchTerm && <span> for "{filters.searchTerm}"</span>}
        </div>
      </CardContent>
    </Card>
  );
}
