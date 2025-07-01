import React, { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({
  userRating,
  setUserRating,
  hoverRating,
  setHoverRating,
  handleRating,
  averageRating,
}) => {
  console.log("User Rating:", userRating);
  console.log("Hover Rating:", hoverRating);
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rate this idea</p>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative w-6 h-6 cursor-pointer">
            {/* Lewa połowa gwiazdki */}
            <div
              className="absolute w-1/2 h-full left-0 z-10"
              onClick={() => handleRating(star - 0.5)}
              onMouseEnter={() => setHoverRating(star - 0.5)}
              onMouseLeave={() => setHoverRating(0)}
            />
            {/* Prawa połowa gwiazdki */}
            <div
              className="absolute w-1/2 h-full right-0 z-10"
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />

            {/* Gwiazdka w tle (zawsze szara) */}
            <Star className="w-6 h-6 text-gray-300 dark:text-gray-600 absolute transition-colors" />

            {/* Pełna żółta gwiazdka */}
            {(hoverRating || userRating) >= star && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute transition-colors" />
            )}

            {/* Połowa żółtej gwiazdki (lewa strona) */}
            {(hoverRating || userRating) >= star - 0.5 && (hoverRating || userRating) < star && (
              <Star
                className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute transition-colors"
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Average: {averageRating.toFixed(2)} / 5.00
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Your: {userRating?.toFixed(1) || "brak"} / 5.0
      </p>
    </div>
  );
};

// Przykład użycia - tak powinno wyglądać w Twoim komponencie
const IdeaRatingDemo = () => {
  const [userRating, setUserRating] = useState(2.5);
  const [hoverRating, setHoverRating] = useState(0);

  const ideaData = {
    averageRating: 3.7,
  };

  const handleRating = async (rating) => {
    // Tutaj będzie Twoja logika API
    console.log("Rating:", rating);
    setUserRating(rating);
  };

  return (
    <div className="bg-gray-50 dark:bg-dark_background min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
          {/* Rating Section - dokładnie jak w Twoim kodzie */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
            <div className="flex items-center space-x-6">
              <StarRatingComponent
                userRating={userRating}
                setUserRating={setUserRating}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                handleRating={handleRating}
                averageRating={ideaData.averageRating}
              />
            </div>

            <div className="flex items-center space-x-4">
              <select className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option value="">Select status</option>
                <option value="TODO">Add to TODO</option>
                <option value="IN_PROGRESS">Mark as In Progress</option>
                <option value="COMPLETED">Mark as Completed</option>
                <option value="FAVORITED">Add to Favorites</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarRating;
