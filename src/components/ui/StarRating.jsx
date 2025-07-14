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
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rate this idea</p>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative w-6 h-6 cursor-pointer">
            {/* Left half of the star*/}
            <div
              className="absolute w-1/2 h-full left-0 z-10"
              onClick={() => handleRating(star - 0.5)}
              onMouseEnter={() => setHoverRating(star - 0.5)}
              onMouseLeave={() => setHoverRating(0)}
            />
            {/* Right -,- */}
            <div
              className="absolute w-1/2 h-full right-0 z-10"
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />

            {/* Star in the background */}
            <Star className="w-6 h-6 text-gray-300 dark:text-gray-600 absolute transition-colors" />

            {/* Full gold Star */}
            {(hoverRating || userRating) >= star && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute transition-colors" />
            )}

            {/* Half of the left Star */}
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

export default StarRating;
