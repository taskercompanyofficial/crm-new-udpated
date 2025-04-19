import React from 'react';
import { Info, WifiOff } from "lucide-react";

interface ComplaintFooterProps {
  lastSaveTime: number;
  isOnline: boolean;
  pendingChangesCount: number;
  historyLength: number;
  dataFieldsCount: number;
  filledDataFieldsCount: number;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  timeUntilNextSave: number;
}

export default function ComplaintFooter({
  lastSaveTime,
  isOnline,
  pendingChangesCount,
  historyLength,
  dataFieldsCount,
  filledDataFieldsCount,
  hasUnsavedChanges,
  autoSaveEnabled,
  timeUntilNextSave
}: ComplaintFooterProps) {
  return (
    <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-slate-800 dark:to-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Last updated: {new Date(lastSaveTime).toLocaleString()}
          </span>
          {!isOnline && (
            <div className="flex items-center text-yellow-600">
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-sm">Offline Mode</span>
            </div>
          )}
          {pendingChangesCount > 0 && (
            <span className="text-sm text-yellow-600">
              ({pendingChangesCount} changes pending sync)
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Changes saved: {historyLength}
          </div>
          <div className="hidden h-4 w-px bg-gray-300 dark:bg-gray-700 sm:block" />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Form completion: {filledDataFieldsCount}/{dataFieldsCount}
          </div>
          {hasUnsavedChanges && autoSaveEnabled && (
            <div className="text-sm text-red-500">
              * Unsaved changes (Auto-saving in {timeUntilNextSave}s)
            </div>
          )}
          {hasUnsavedChanges && !autoSaveEnabled && (
            <div className="text-sm text-red-500">
              * Unsaved changes (Auto-save disabled)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
