import React, { useState, useRef } from 'react';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClockIcon,
  CogIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import DefaultLayout from '../../layout/DefaultLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataBackupService, BackupData } from '../../utils/dataBackup';
import { DataIntegrityService } from '../../utils/dataIntegrity';
import toast from 'react-hot-toast';

const DataManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState<(BackupData & { name: string })[]>([]);
  const [integrityResults, setIntegrityResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backupService = new DataBackupService();
  const integrityService = new DataIntegrityService();

  // Simple toast helpers
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message, { icon: '⚠️' });
    }
  };

  // Load saved backups on component mount
  React.useEffect(() => {
    const savedBackups = backupService.getLocalBackups();
    setBackups(savedBackups);
  }, []);

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const description = prompt(
        'Enter a description for this backup (optional):',
      );
      const backup = backupService.createBackup(description || undefined);

      // Save to localStorage
      backupService.saveBackupLocally(backup, `backup_${backup.timestamp}`);

      // Download as file
      backupService.downloadBackup(backup);

      // Update local state
      setBackups(backupService.getLocalBackups());

      showToast('Backup created successfully!', 'success');
    } catch (error) {
      console.error('Backup creation failed:', error);
      showToast('Failed to create backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (backup: BackupData) => {
    if (
      !confirm(
        'Are you sure you want to restore this backup? This will overwrite all current data.',
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await backupService.restoreFromBackup(backup);
      showToast(
        'Data restored successfully! Please refresh the page.',
        'success',
      );

      // Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Restore failed:', error);
      showToast('Failed to restore backup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      await backupService.importBackupFromFile(file);
      showToast(
        'Backup imported successfully! Please refresh the page.',
        'success',
      );

      // Update backups list
      setBackups(backupService.getLocalBackups());

      // Refresh page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Import failed:', error);
      showToast('Failed to import backup file', 'error');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) {
      return;
    }

    try {
      backupService.deleteLocalBackup(backupId);
      setBackups(backupService.getLocalBackups());
      showToast('Backup deleted successfully', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete backup', 'error');
    }
  };

  const handleCheckIntegrity = async () => {
    setIsLoading(true);
    try {
      const results = integrityService.validateAllData();
      setIntegrityResults(results);

      if (results.summary.totalErrors === 0) {
        showToast('Data integrity check passed!', 'success');
      } else {
        showToast(
          `Found ${results.summary.totalErrors} integrity issues`,
          'warning',
        );
      }
    } catch (error) {
      console.error('Integrity check failed:', error);
      showToast('Failed to run integrity check', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepairData = async () => {
    if (
      !confirm(
        'Are you sure you want to repair data integrity issues? This action cannot be undone.',
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const results = await integrityService.repairDataIntegrity();
      // Re-run integrity check to get updated results
      const updatedResults = integrityService.validateAllData();
      setIntegrityResults(updatedResults);
      showToast(`Repaired ${results.repaired.length} issues`, 'success');
    } catch (error) {
      console.error('Data repair failed:', error);
      showToast('Failed to repair data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanupInvalidCourses = async () => {
    setIsLoading(true);
    try {
      const cleanup = integrityService.cleanupInvalidCourses();
      if (cleanup.cleaned > 0) {
        showToast(`Cleaned up ${cleanup.cleaned} invalid courses`, 'success');
        // Re-run integrity check to get updated results
        const updatedResults = integrityService.validateAllData();
        setIntegrityResults(updatedResults);
      } else {
        showToast('No invalid courses found to clean up', 'success');
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      showToast('Failed to clean up invalid courses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <PageTitle title="Data Management" />

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup & Restore */}
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Backup & Restore
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCreateBackup}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ArrowDownTrayIcon className="h-5 w-5" />
                )}
                <span>Create Backup</span>
              </button>

              <div className="flex space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />
                  <span>Import Backup</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Integrity */}
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Data Integrity
              </h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckIntegrity}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ShieldCheckIcon className="h-5 w-5" />
                )}
                <span>Check Integrity</span>
              </button>

              <button
                onClick={handleCleanupInvalidCourses}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ShieldCheckIcon className="h-5 w-5" />
                )}
                <span>Clean Invalid Courses</span>
              </button>

              {integrityResults && integrityResults.summary.totalErrors > 0 && (
                <button
                  onClick={handleRepairData}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  <CogIcon className="h-5 w-5" />
                  <span>Repair Data</span>
                </button>
              )}

              {integrityResults &&
                integrityResults.summary.invalidCourses > 0 && (
                  <button
                    onClick={handleCleanupInvalidCourses}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Cleanup Invalid Courses</span>
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* Integrity Results */}
        {integrityResults && (
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Integrity Check Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {integrityResults.summary.coursesChecked +
                    integrityResults.summary.modulesChecked +
                    integrityResults.summary.lecturesChecked}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Checked
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {integrityResults.summary.totalErrors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Errors Found
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {integrityResults.summary.totalWarnings}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>

            {integrityResults.details &&
              integrityResults.details.length > 0 && (
                <div className="space-y-4">
                  {integrityResults.details.map(
                    (result: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 capitalize mb-2">
                          {result.type}: {result.name}
                        </h4>

                        {result.errors?.length > 0 && (
                          <div className="mb-2">
                            <div className="text-red-600 text-sm font-medium mb-1">
                              Errors:
                            </div>
                            <ul className="text-sm text-red-600 space-y-1">
                              {result.errors.map(
                                (error: string, errorIndex: number) => (
                                  <li
                                    key={errorIndex}
                                    className="flex items-start space-x-2"
                                  >
                                    <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {result.warnings?.length > 0 && (
                          <div>
                            <div className="text-yellow-600 text-sm font-medium mb-1">
                              Warnings:
                            </div>
                            <ul className="text-sm text-yellow-600 space-y-1">
                              {result.warnings.map(
                                (warning: string, warningIndex: number) => (
                                  <li
                                    key={warningIndex}
                                    className="flex items-start space-x-2"
                                  >
                                    <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{warning}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
          </div>
        )}

        {/* Backup History */}
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Backup History
          </h3>

          {backups.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No backups found. Create your first backup to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div
                  key={backup.name || index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-strokedark rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {backup.metadata.description || backup.name || 'Backup'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {new Date(backup.timestamp).toLocaleString()}
                          </span>
                        </span>
                        <span>{backup.metadata.totalRecords} records</span>
                        <span>{formatFileSize(backup.metadata.dataSize)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestoreBackup(backup)}
                      disabled={isLoading}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => backupService.downloadBackup(backup)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.name)}
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DataManagement;
