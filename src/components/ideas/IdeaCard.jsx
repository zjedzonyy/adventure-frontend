import { Star, ClipboardCheck, Eye } from "lucide-react";
import { AuthContext } from "../auth/index.js";
import { useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function IdeaCard({ idea }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Helper functions to map ids
  const getDurationLabel = durationId => {
    const durations = {
      1: "0-15 min",
      2: "15-30 min",
      3: "0.5-1 hour",
      4: "1-2 hours",
      5: "2-4 hours",
      6: "Full day",
      7: "Weekend",
    };
    return durations[durationId] || "Unknown";
  };

  const getPriceRangeLabel = priceRangeId => {
    const priceRanges = {
      1: "Free",
      2: "1-5 $",
      3: "5-15 $",
      4: "15-30 $",
      5: "30-60 $",
      6: "60-240 $",
      7: "240-1000 $",
      8: "Premium",
    };
    return priceRanges[priceRangeId] || "Unknown";
  };

  const navigateTo = path => {
    if (!user) {
      navigate("/login", { state: { from: path } });
      return;
    }

    navigate(path);
  };

  return (
    <div
      onClick={() => navigateTo(`/idea/${idea.id}`)}
      className="bg-white dark:bg-dark_background_secondary rounded-xl shadow-lg hover:shadow-blue-500 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
    >
      <a href={`/idea/${idea.id}`} className="block h-full">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <span className="bg-purple-100 dark:bg-dark_primary dark:text-text_primary text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {idea.locationType}
            </span>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-600 dark:text-text_secondary">
                {idea.viewCount}
              </span>
            </div>
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-2 dark:text-text_secondary dark:hover:text-text_primary group-hover:text-purple-600 dark:group-hover:text-text_primary transition-colors">
            {idea.title}
          </h4>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 dark:text-text_secondary">
            {idea.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto mb-4 dark:text-text_secondary">
            <span>Duration: {getDurationLabel(idea.durationId)}</span>
            <span>Price: {getPriceRangeLabel(idea.priceRangeId)}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-950">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold dark:text-text_secondary">
                  {idea.authorAvatarUrl ? (
                    <img
                      src={idea.authorAvatarUrl}
                      alt={idea.authorUsername}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </span>
              </div>
              <span className="text-sm text-gray-700 dark:text-text_secondary">
                {idea.authorUsername}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-text_secondary">
                  {idea.averageRating}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <ClipboardCheck className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-600 dark:text-text_secondary">
                  {idea.completionCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
