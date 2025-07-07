import { Star, ClipboardCheck, Edit3 } from "lucide-react";
import { AuthContext } from "../auth/index.js";
import { useContext } from "react";

export default function IdeaCard({ idea }) {
  const { user } = useContext(AuthContext);
  return (
    <div
      key={idea.id}
      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors space-y-4"
    >
      <a href={`/idea/${idea.id}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{idea.title}</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{idea.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {idea.locationType}
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{idea.averageRating}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ClipboardCheck className="w-4 h-4" />
                <span>{idea.completionCount}</span>
              </span>
            </div>
          </div>
          {user.id === idea.userId && (
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Edit3 className="w-4 h-4" />
              add onclick edit idea page
            </button>
          )}
        </div>
      </a>
    </div>
  );
}
