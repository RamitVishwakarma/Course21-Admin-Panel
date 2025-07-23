import React, { useState, useMemo, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useCourseStore } from '../store/useCourseStore';
import { useUserStore } from '../store/useUserStore';
import { useModuleStore } from '../store/useModuleStore';
import { useLectureStore } from '../store/useLectureStore';
import { useQuizStore } from '../store/useQuizStore';
import { Course, User, Module, Lecture, Quiz } from '../types';

export type SearchEntity =
  | 'all'
  | 'courses'
  | 'users'
  | 'modules'
  | 'lectures'
  | 'quizzes';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  searchTerm: string;
  entity: SearchEntity;
  category?: string;
  level?: string;
  status?: string;
  role?: string;
  priceRange?: { min: number; max: number };
  dateRange?: { start: string; end: string };
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface SearchResult {
  type: 'course' | 'user' | 'module' | 'lecture' | 'quiz';
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  metadata?: Record<string, any>;
  score?: number; // Relevance score
}

interface AdvancedGlobalSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  onResultsChange?: (results: SearchResult[]) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  maxResults?: number;
}

const AdvancedGlobalSearch: React.FC<AdvancedGlobalSearchProps> = ({
  onResultSelect,
  onResultsChange,
  placeholder = 'Search courses, users, modules, lectures, quizzes...',
  className = '',
  showFilters = true,
  maxResults = 50,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    entity: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Get data from stores
  const { courses } = useCourseStore();
  const { users } = useUserStore();
  const { modules } = useModuleStore();
  const { lectures } = useLectureStore();
  const { quizzes } = useQuizStore();

  // Search function that calculates relevance scores
  const calculateRelevanceScore = useCallback(
    (text: string, searchTerm: string): number => {
      if (!searchTerm.trim()) return 0;

      const lowerText = text.toLowerCase();
      const lowerSearch = searchTerm.toLowerCase();

      // Exact match gets highest score
      if (lowerText === lowerSearch) return 100;

      // Title/name match gets high score
      if (lowerText.includes(lowerSearch)) {
        const position = lowerText.indexOf(lowerSearch);
        // Earlier positions get higher scores
        return Math.max(50, 80 - position);
      }

      // Word boundary matches
      const words = lowerSearch.split(' ');
      let wordMatches = 0;
      words.forEach((word) => {
        if (lowerText.includes(word)) wordMatches++;
      });

      if (wordMatches === words.length) return 40;
      if (wordMatches > 0) return 20 + (wordMatches / words.length) * 20;

      return 0;
    },
    [],
  );

  // Perform the search across all entities
  const searchResults = useMemo((): SearchResult[] => {
    if (!filters.searchTerm.trim()) return [];

    setIsSearching(true);
    const results: SearchResult[] = [];

    // Search courses
    if (filters.entity === 'all' || filters.entity === 'courses') {
      courses.forEach((course) => {
        const titleScore = calculateRelevanceScore(
          course.title,
          filters.searchTerm,
        );
        const descScore = calculateRelevanceScore(
          course.description,
          filters.searchTerm,
        );
        const categoryScore = calculateRelevanceScore(
          course.category,
          filters.searchTerm,
        );
        const tagsScore = Math.max(
          ...course.tags.map((tag) =>
            calculateRelevanceScore(tag, filters.searchTerm),
          ),
        );

        const maxScore = Math.max(
          titleScore,
          descScore,
          categoryScore,
          tagsScore,
        );

        if (maxScore > 0) {
          // Apply filters
          if (filters.category && course.category !== filters.category) return;
          if (filters.level && course.level !== filters.level) return;
          if (filters.priceRange) {
            if (
              course.price < filters.priceRange.min ||
              course.price > filters.priceRange.max
            )
              return;
          }

          results.push({
            type: 'course',
            id: course.id,
            title: course.title,
            description: course.description,
            subtitle: `${course.category} • ${course.level} • ₹${course.price}`,
            metadata: {
              category: course.category,
              level: course.level,
              price: course.price,
              instructor: course.instructorName,
              enrollments: course.enrollmentCount,
              rating: course.rating,
            },
            score: maxScore,
          });
        }
      });
    }

    // Search users
    if (filters.entity === 'all' || filters.entity === 'users') {
      users.forEach((user) => {
        const nameScore = calculateRelevanceScore(
          user.name,
          filters.searchTerm,
        );
        const emailScore = calculateRelevanceScore(
          user.email,
          filters.searchTerm,
        );
        const roleScore = calculateRelevanceScore(
          user.roleName,
          filters.searchTerm,
        );
        const locationScore = user.location
          ? calculateRelevanceScore(user.location, filters.searchTerm)
          : 0;

        const maxScore = Math.max(
          nameScore,
          emailScore,
          roleScore,
          locationScore,
        );

        if (maxScore > 0) {
          // Apply filters
          if (filters.role && user.roleName !== filters.role) return;
          if (filters.status && (filters.status === 'active') !== user.isActive)
            return;

          results.push({
            type: 'user',
            id: user.id,
            title: user.name,
            description: user.email,
            subtitle: `${user.roleName} • ${
              user.location || 'Location not set'
            }`,
            metadata: {
              role: user.roleName,
              email: user.email,
              location: user.location,
              isActive: user.isActive,
              coursesEnrolled: user.coursesEnrolled || 0,
            },
            score: maxScore,
          });
        }
      });
    }

    // Search modules
    if (filters.entity === 'all' || filters.entity === 'modules') {
      modules.forEach((module) => {
        const titleScore = calculateRelevanceScore(
          module.title,
          filters.searchTerm,
        );
        const descScore = calculateRelevanceScore(
          module.description,
          filters.searchTerm,
        );

        const maxScore = Math.max(titleScore, descScore);

        if (maxScore > 0) {
          const course = courses.find((c) => c.id === module.courseId);

          results.push({
            type: 'module',
            id: module.id,
            title: module.title,
            description: module.description,
            subtitle: `Module in ${course?.title || 'Unknown Course'} • ${
              module.lectureCount
            } lectures`,
            metadata: {
              courseId: module.courseId,
              courseName: course?.title,
              lectureCount: module.lectureCount,
              duration: module.duration,
              isPublished: module.isPublished,
            },
            score: maxScore,
          });
        }
      });
    }

    // Search lectures
    if (filters.entity === 'all' || filters.entity === 'lectures') {
      lectures.forEach((lecture) => {
        const titleScore = calculateRelevanceScore(
          lecture.title,
          filters.searchTerm,
        );
        const descScore = calculateRelevanceScore(
          lecture.description,
          filters.searchTerm,
        );

        const maxScore = Math.max(titleScore, descScore);

        if (maxScore > 0) {
          const module = modules.find((m) => m.id === lecture.moduleId);
          const course = courses.find((c) => c.id === lecture.courseId);

          results.push({
            type: 'lecture',
            id: lecture.id,
            title: lecture.title,
            description: lecture.description,
            subtitle: `${course?.title || 'Unknown Course'} > ${
              module?.title || 'Unknown Module'
            }`,
            metadata: {
              courseId: lecture.courseId,
              moduleId: lecture.moduleId,
              courseName: course?.title,
              moduleName: module?.title,
              type: lecture.type,
              duration: lecture.videoDuration,
              isPublished: lecture.isPublished,
            },
            score: maxScore,
          });
        }
      });
    }

    // Search quizzes
    if (filters.entity === 'all' || filters.entity === 'quizzes') {
      quizzes.forEach((quiz) => {
        const titleScore = calculateRelevanceScore(
          quiz.title,
          filters.searchTerm,
        );
        const descScore = calculateRelevanceScore(
          quiz.description,
          filters.searchTerm,
        );

        const maxScore = Math.max(titleScore, descScore);

        if (maxScore > 0) {
          const module = modules.find((m) => m.id === quiz.moduleId);
          const course = courses.find((c) => c.id === quiz.courseId);

          results.push({
            type: 'quiz',
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            subtitle: `Quiz in ${course?.title || 'Unknown Course'} • ${
              quiz.questions.length
            } questions`,
            metadata: {
              courseId: quiz.courseId,
              moduleId: quiz.moduleId,
              courseName: course?.title,
              moduleName: module?.title,
              questionCount: quiz.questions.length,
              timeLimit: quiz.timeLimit,
              passingScore: quiz.passingScore,
            },
            score: maxScore,
          });
        }
      });
    }

    // Sort results
    const sortedResults = results.sort((a, b) => {
      if (filters.sortBy === 'relevance') {
        return filters.sortOrder === 'desc'
          ? (b.score || 0) - (a.score || 0)
          : (a.score || 0) - (b.score || 0);
      } else if (filters.sortBy === 'title') {
        return filters.sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      } else if (filters.sortBy === 'type') {
        return filters.sortOrder === 'desc'
          ? b.type.localeCompare(a.type)
          : a.type.localeCompare(b.type);
      }
      return 0;
    });

    setIsSearching(false);
    return sortedResults.slice(0, maxResults);
  }, [
    filters,
    courses,
    users,
    modules,
    lectures,
    quizzes,
    calculateRelevanceScore,
    maxResults,
  ]);

  // Notify parent of results change
  React.useEffect(() => {
    onResultsChange?.(searchResults);
  }, [searchResults, onResultsChange]);

  // Update filter
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      entity: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  // Export results as CSV
  const exportResults = () => {
    if (searchResults.length === 0) return;

    const headers = ['Type', 'Title', 'Description', 'Subtitle', 'Score'];
    const csvContent = [
      headers.join(','),
      ...searchResults.map((result) =>
        [
          result.type,
          `"${result.title.replace(/"/g, '""')}"`,
          `"${(result.description || '').replace(/"/g, '""')}"`,
          `"${(result.subtitle || '').replace(/"/g, '""')}"`,
          result.score || 0,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search_results_${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 ${className}`}
    >
      {/* Search Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Global Search
        </h2>
        {searchResults.length > 0 && (
          <button
            onClick={exportResults}
            className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {filters.searchTerm && (
          <button
            onClick={() => updateFilter('searchTerm', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.entity}
          onChange={(e) =>
            updateFilter('entity', e.target.value as SearchEntity)
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All</option>
          <option value="courses">Courses</option>
          <option value="users">Users</option>
          <option value="modules">Modules</option>
          <option value="lectures">Lectures</option>
          <option value="quizzes">Quizzes</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            updateFilter('sortBy', sortBy);
            updateFilter('sortOrder', sortOrder);
          }}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="relevance-desc">Most Relevant</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="type-asc">Type A-Z</option>
        </select>

        {showFilters && (
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        )}

        {(filters.category ||
          filters.level ||
          filters.role ||
          filters.status) && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                updateFilter('category', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="data-science">Data Science</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="devops">DevOps</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level
            </label>
            <select
              value={filters.level || ''}
              onChange={(e) =>
                updateFilter('level', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={filters.role || ''}
              onChange={(e) =>
                updateFilter('role', e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-3">
        {/* Results Header */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{searchResults.length} results found</span>
            {isSearching && <span>Searching...</span>}
          </div>
        )}

        {/* Results List */}
        {searchResults.map((result) => (
          <div
            key={`${result.type}-${result.id}`}
            onClick={() => onResultSelect?.(result)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${
                      result.type === 'course'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : ''
                    }
                    ${
                      result.type === 'user'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : ''
                    }
                    ${
                      result.type === 'module'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : ''
                    }
                    ${
                      result.type === 'lecture'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : ''
                    }
                    ${
                      result.type === 'quiz'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : ''
                    }
                  `}
                  >
                    {result.type}
                  </span>
                  {result.score && (
                    <span className="text-xs text-gray-500">
                      {Math.round(result.score)}% match
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-black dark:text-white">
                  {result.title}
                </h3>
                {result.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.subtitle}
                  </p>
                )}
                {result.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                    {result.description.substring(0, 150)}
                    {result.description.length > 150 ? '...' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* No Results */}
        {filters.searchTerm && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No results found for "{filters.searchTerm}"</p>
            <p className="text-sm mt-1">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Empty State */}
        {!filters.searchTerm && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start typing to search across all content</p>
            <p className="text-sm mt-1">
              Search courses, users, modules, lectures, and quizzes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedGlobalSearch;
