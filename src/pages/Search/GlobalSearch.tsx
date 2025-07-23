import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DefaultLayout from '../../layout/DefaultLayout';
import PageTitle from '../../components/PageTitle';
import AdvancedGlobalSearch, {
  SearchResult,
} from '../../components/AdvancedGlobalSearch';
import { useNavigate } from 'react-router-dom';

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleResultSelect = (result: SearchResult) => {
    // Navigate to the appropriate page based on result type
    switch (result.type) {
      case 'course':
        navigate(`/admin/course-dashboard/view-course/${result.id}`);
        break;
      case 'user':
        navigate(`/admin/users/${result.id}`);
        break;
      case 'module':
        navigate(`/admin/course-dashboard/view-module/${result.id}`);
        break;
      case 'lecture':
        // Navigate to the lecture stream page
        const moduleId = result.metadata?.moduleId;
        const courseId = result.metadata?.courseId;
        if (moduleId && courseId) {
          navigate(
            `/admin/course/${courseId}/module/${moduleId}/lecture/${result.id}/stream`,
          );
        }
        break;
      case 'quiz':
        navigate(`/admin/quiz/${result.id}/take`);
        break;
      default:
        console.log('Unknown result type:', result.type);
    }
  };

  const handleResultsChange = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <PageTitle title="Global Search" />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
            <span>Global Search</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and filter across all courses, users, modules, lectures, and
            quizzes
          </p>
        </div>

        {/* Advanced Search Component */}
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
          <AdvancedGlobalSearch
            onResultSelect={handleResultSelect}
            onResultsChange={handleResultsChange}
            placeholder="Search for courses, users, modules, lectures, or quizzes..."
            showFilters={true}
            maxResults={50}
            className="w-full"
          />
        </div>

        {/* Search Results Summary */}
        {searchResults.length > 0 && (
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results ({searchResults.length} found)
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  className="p-4 border border-gray-200 dark:border-strokedark rounded-lg hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.type === 'course'
                              ? 'bg-blue-100 text-blue-800'
                              : result.type === 'user'
                              ? 'bg-green-100 text-green-800'
                              : result.type === 'module'
                              ? 'bg-purple-100 text-purple-800'
                              : result.type === 'lecture'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {result.type.charAt(0).toUpperCase() +
                            result.type.slice(1)}
                        </span>
                        {result.score && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Relevance: {Math.round(result.score * 100)}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {result.title}
                      </h3>
                      {result.subtitle && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {result.subtitle}
                        </p>
                      )}
                      {result.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      {result.metadata && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(result.metadata).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="text-xs text-gray-400 dark:text-gray-500"
                              >
                                {key}: {String(value)}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <svg
                        className="w-5 h-5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🔍 Smart Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Search across all entities with intelligent text matching and
              relevance scoring.
            </p>
          </div>

          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🎯 Advanced Filters
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Filter by entity type, category, level, status, price range, and
              date range.
            </p>
          </div>

          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📊 Sort & Export
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sort results by multiple criteria and export filtered data to CSV
              format.
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default GlobalSearch;
