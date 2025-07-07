import React from "react";
import { ChevronDown } from "lucide-react";

export default function SettingsSection({
  title,
  icon: Icon,
  count,
  isExpanded,
  onToggle,
  children,
}) {
  return (
    <div className="w-[75vw] mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mb-6">
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer select-none px-4 py-3"
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-5 h-5 text-purple-600" />}
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <ChevronDown
            className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
        {count !== undefined && (
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>

      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
