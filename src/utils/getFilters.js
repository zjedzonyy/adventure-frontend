import { apiUrl } from "./api";

export async function getFilters() {
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

  const categories = [];
  const durations = [];
  const priceRanges = [];
  const groups = [];
  // Fetching filters from the backend
  try {
    const res = await fetch(`${apiUrl}/ideas/filters`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      categories.push(...data.data.categories);
      durations.push(...data.data.durations);
      priceRanges.push(...data.data.priceRanges);
      groups.push(...data.data.groups);
    }
  } catch (error) {
    console.error("Error fetching filters:", error);
  }

  return {
    locationTypes,
    statusTypes,
    categories,
    durations,
    priceRanges,
    groups,
  };
}
