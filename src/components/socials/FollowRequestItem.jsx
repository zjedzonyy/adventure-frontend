import React from "react";
import { User, Check, X } from "lucide-react";

export default function FollowRequestItem({ username, id, onAccept, onReject, isProcessing }) {
  return (
    <div className="border dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left: Avatar + Username */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
              {username}
            </h4>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          {onAccept && (
            <button
              onClick={() => onAccept(id)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors flex items-center space-x-1 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}

          <button
            onClick={() => onReject(id)}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors flex items-center space-x-1 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
