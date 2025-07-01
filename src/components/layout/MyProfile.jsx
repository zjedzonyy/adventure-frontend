import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext.jsx";
import Navbar from "../common/Navbar.jsx";
import { apiUrl } from "../../utils/api.js";
import Footer from "../common/Footer.jsx";
import {
  Heart,
  Star,
  Plus,
  User,
  Calendar,
  Trophy,
  BookOpen,
  Target,
  Edit3,
  Heart as HeartIcon,
  ChevronDown,
  ClipboardCheck,
} from "lucide-react";

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = React.useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [todoExpanded, setTodoExpanded] = useState(false);
  const [savedExpanded, setSavedExpanded] = useState(false);

  // Fetch data for the profile
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          console.log("Profile data fetched successfully:", data.data);
        } else {
          console.error("Failed to fetch profile data:", data.message);
        }
        setUserData(data.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  if (!userData) return <div>Loading...</div>;
  return (
    <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar></Navbar>
      <div className="min-h-screen  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userData?.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-3"></p>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(userData?.createdAt).toLocaleDateString("pl-PL")}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Followers</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userData?._count.follower}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">Following</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userData?._count.following}
                  </div>
                </div>

                <div className="text-center ">
                  <div className="text-2xl font-bold text-purple-600">COMPLETED CHALLANGES</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userData?._count.ideaStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Ideas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xl font-semibold text-gray-900 dark:text-white flex items-center cursor-pointer select-none"
                >
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  My Ideas
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Idea</span>
                </button>
              </div>
              {isExpanded && (
                <div className="space-y-4">
                  {userData?.ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {idea.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                idea.isActive === true
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {idea.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {idea.description}
                          </p>
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
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit3 className="w-4 h-4" />
                          add onclick edit idea page
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Todo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  onClick={() => setTodoExpanded(!todoExpanded)}
                  className="text-xl font-semibold text-gray-900 dark:text-white flex items-center cursor-pointer select-none"
                >
                  <Target className="w-5 h-5 mr-2 text-orange-600" />
                  My Todo
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transition-transform ${todoExpanded ? "rotate-180" : ""}`}
                  />
                </h3>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
              {todoExpanded && (
                <div className="space-y-4">
                  {userData?.todoIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {idea.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                idea.isActive === true
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {idea.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {idea.description}
                          </p>
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
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit3 className="w-4 h-4" />
                          Saved as completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Ideas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  onClick={() => setSavedExpanded(!savedExpanded)}
                  className="text-xl font-semibold text-gray-900 dark:text-white flex items-center cursor-pointer select-none"
                >
                  <Heart className="w-5 h-5 mr-2 text-red-500 fill-current" />
                  Saved Ideas
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transition-transform ${savedExpanded ? "rotate-180" : ""}`}
                  />
                </h3>
              </div>
              {savedExpanded && (
                <div className="space-y-4">
                  {userData?.favoritedIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {idea.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                idea.isActive === true
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {idea.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {idea.description}
                          </p>
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
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit3 className="w-4 h-4" />
                          Remove from fav
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
