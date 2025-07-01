import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { use, useEffect, useState } from "react";
import { apiUrl } from "../../utils/api";
import IdeaCard from "../common/IdeaCard";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function SearchIdeas() {
  const [filters, setFilters] = useState({});
  const [ideas, setIdeas] = useState([]);

  const [categories, setCategories] = useState([]);
  const [durations, setDurations] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [groupSizes, setGroupSizes] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4;
  const resultsFilters = `&page=${currentPage}&limit=${resultsPerPage}`;
  const [pagination, setPagination] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Fetch hardcoded labels
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas/filters`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(data.data.categories || []);
          setDurations(data.data.durations || []);
          setPriceRanges(data.data.priceRanges || []);
          setGroupSizes(data.data.groupSizes || []);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    // Fetch ideas based on filters
    // Set query
    let query = ``;
    if (filters.title) {
      query += `title=${filters.title}&`;
    }
    if (filters.categoryIds) {
      query += `categoryIds=${filters.categoryIds}&`;
    }
    if (filters.location_type) {
      query += `location_type=${filters.location_type}&`;
    }
    if (filters.duration) {
      query += `duration=${filters.duration}&`;
    }
    if (filters.price) {
      query += `price=${filters.price}&`;
    }
    if (filters.groupIds) {
      query += `groupIds=${filters.groupIds}&`;
    }
    if (filters.status) {
      query += `status=${filters.status}&`;
    }

    console.log("Current filters:", filters);
    console.log("Current query:", query);
    const fetchIdeas = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas?${query}/${resultsFilters}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          // Handle the fetched ideas data
          setIdeas(data.data.ideas || []);
          setPagination(data.data.pagination || {});
          setTotalPages(data.data.pagination ? data.data.pagination.totalPages : 1);
          setTotalCount(data.data.pagination ? data.data.pagination.totalItems : 0);
        }
        console.log(totalCount);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };
    fetchIdeas();
  }, [filters, currentPage]);

  // ENUMS (can't fetch them from backend, so hardcoded)
  const locationTypes = [
    { value: "INDOOR", label: "Indoor" },
    { value: "OUTDOOR", label: "Outdoor" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "FLEXIBLE", label: "Flexible" },
  ];

  const statusTypes = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "FAVORITED", label: "Favorited" },
  ];

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.keys(filters).length;

  function getDisplayedPages(current, total) {
    const pages = [];

    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }

    return pages;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header with results count */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ideas
              {totalCount > 0 && (
                <span className="ml-3 text-xl font-normal text-gray-500 dark:text-gray-400">
                  ({totalCount} results)
                </span>
              )}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Filters */}
            <div className="lg:w-80 lg:flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                {/* Filter header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Filter className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                    {activeFiltersCount > 0 && (
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Filter content */}
                <div className="p-4 space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search by title
                    </label>
                    <input
                      type="text"
                      value={filters.title || ""}
                      onChange={(e) => updateFilter("title", e.target.value)}
                      placeholder="Enter title..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categories
                      </label>
                      <select
                        value={filters.categoryIds || ""}
                        onChange={(e) => updateFilter("categoryIds", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">All categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <select
                      value={filters.location_type || ""}
                      onChange={(e) => updateFilter("location_type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All locations</option>
                      {locationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  {durations.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <select
                        value={filters.duration || ""}
                        onChange={(e) => updateFilter("duration", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Any duration</option>
                        {durations.map((duration) => (
                          <option key={duration.id} value={duration.id}>
                            {duration.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Price Range */}
                  {priceRanges.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.price || ""}
                        onChange={(e) => updateFilter("price", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Any price</option>
                        {priceRanges.map((price) => (
                          <option key={price.id} value={price.id}>
                            {price.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Group Size */}
                  {groupSizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Group Size
                      </label>
                      <select
                        value={filters.groupIds || ""}
                        onChange={(e) => updateFilter("groupIds", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Any size</option>
                        {groupSizes.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status || ""}
                      onChange={(e) => updateFilter("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">All statuses</option>
                      {statusTypes.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Challenge Toggle */}
                  <div className="flex items-center space-x-3 pt-2">
                    <input
                      type="checkbox"
                      id="challenge"
                      checked={filters.challenge === "true"}
                      onChange={(e) => updateFilter("challenge", e.target.checked ? "true" : "")}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="challenge"
                      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Award className="w-4 h-4 mr-1 text-yellow-500" />
                      Challenges only
                    </label>
                  </div>

                  {/* Active Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Active filters:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(
                          ([key, value]) =>
                            value && (
                              <span
                                key={key}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                              >
                                {key}: {value}
                                <button
                                  onClick={() => clearFilter(key)}
                                  className="ml-1 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main content - Ideas list */}
            <div className="flex-1 min-w-0">
              {/* Ideas in single column */}
              <div className="space-y-6">
                {ideas.length > 0 ? (
                  ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <Filter className="w-12 h-12 mx-auto mb-2" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No ideas found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No ideas match your current filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-auto pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {getDisplayedPages(currentPage, totalPages).map((page, i) => (
                  <button
                    key={i}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    disabled={page === "..."}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-purple-600 text-white shadow-sm"
                        : page === "..."
                          ? "cursor-default text-gray-400"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
