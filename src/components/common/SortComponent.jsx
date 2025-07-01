import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Filter,
  X,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Award,
  Eye,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

export default function SortComponent({
  currentSort,
  sortOptions,
  onSortChange,
  className = "",
  setCommentSortChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSortSelect = (sortKey) => {
    onSortChange(sortKey);
    setIsOpen(false);
    setCommentSortChange((prev) => !prev); // Toggle comment sort change state
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentOption = sortOptions[currentSort] || sortOptions.newest;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
      >
        <span className="font-medium">{currentOption.label}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {Object.entries(sortOptions).map(([key, option]) => (
            <button
              key={key}
              onClick={() => handleSortSelect(key)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                currentSort === key
                  ? "bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
