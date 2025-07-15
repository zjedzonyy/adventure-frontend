import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import { apiUrl } from "../../utils/index.js";
import { LoadingWrapper } from "../common/index.js";

import {
  Heart,
  Star,
  Plus,
  User,
  Calendar,
  BookOpen,
  Target,
  Edit3,
  Heart as HeartIcon,
  ChevronDown,
  ClipboardCheck,
  UserPlus,
  UserMinus,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function UsersProfile() {
  const { userId } = useParams(); // Get user ID from URL params
  const { user: currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [userDataLevel, setUserDataLevel] = useState(null); // 'private', 'public', 'basic'
  const [isFollowing, setIsFollowing] = useState(false);
  const [sentFollowRequest, setSentFollowRequest] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [todoExpanded, setTodoExpanded] = useState(false);
  const [savedExpanded, setSavedExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Get sent requests
    const fetchSentFollowRequests = async () => {
      try {
        const res = await fetch(`${apiUrl}/users/me/sent-follow-requests`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          console.log("Sent follow requests:", data.data);
          setSentFollowRequest(data.data.some((req) => req.toUserId === userId));
        } else {
          console.error("Failed to fetch sent follow requests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching sent follow requests:", error);
      }
    };
    fetchSentFollowRequests();
  }, [isFollowing, refreshTrigger]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || !currentUser) return;

      setLoading(true);
      try {
        let endpoint;
        let accessLevel;

        // Determine endpoint and access level
        if (userId === currentUser.id) {
          endpoint = `${apiUrl}/users/me`;
          accessLevel = "private";
        } else {
          endpoint = `${apiUrl}/users/${userId}`;
          accessLevel = "unknown"; // Backend will determine based on relationship
        }

        // Fetch user data
        const userRes = await fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const userData = await userRes.json();
        if (userData.success) {
          setUserData(userData.data);

          // Determine actual access level based on returned data
          if (userId === currentUser.id) {
            setUserDataLevel("private");
          } else if (userData.data.ideas && userData.data.ideas.length >= 0) {
            // If we have ideas data, we have public access (user is following or profile is public)
            setUserDataLevel("public");
          } else {
            // Basic access only
            setUserDataLevel("basic");
          }

          // Check if we're following this user (for non-own profiles)
          if (userId !== currentUser.id && userData.data.isFollowing !== undefined) {
            setIsFollowing(userData.data.isFollowing);
          }
        } else {
          console.error("Failed to fetch user data:", userData.message);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser, refreshTrigger]);

  // Check if the user is following this profile
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!userId || !currentUser) return;
      try {
        const res = await fetch(`${apiUrl}/follows/is-following/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setIsFollowing(data.data);
        } else {
          console.error("Failed to check following status:", data.message);
        }
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };
    checkFollowingStatus();
  }, [userId, currentUser, refreshTrigger]);

  const handleFollowToggle = async () => {
    try {
      const route = isFollowing ? `follows/${userId}/unfollow` : `follow-requests/${userId}`;
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`${apiUrl}/${route}`, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        console.log("Follow toggle response:", data);
        if (isFollowing) {
          // Unfollowing
          setIsFollowing(false);
          setAlreadyFollowing(false);
        } else {
          // Sending follow request
          setSentFollowRequest(true);
        }

        // Update follower count in userData
        if (userData?._count) {
          setUserData((prev) => ({
            ...prev,
            _count: {
              ...prev._count,
              follower: isFollowing ? prev._count.follower - 1 : prev._count.follower + 1,
            },
          }));
        } else if (userData?.follower) {
          // Handle case where follower is an array
          setUserData((prev) => ({
            ...prev,
            follower: isFollowing
              ? prev.follower.filter((f) => f.id !== currentUser.id)
              : [...prev.follower, { id: currentUser.id }],
          }));
        }

        // If we just started following and currently have basic access, refetch profile
        if (!isFollowing && userDataLevel === "basic") {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const cancelSentFollowRequest = async () => {
    try {
      const res = await fetch(`${apiUrl}/follow-requests/sent/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSentFollowRequest(false);
      }
    } catch (error) {
      console.error("Failed to cancel follow request:", error);
    } finally {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  // If loading, show a loading state
  // If userData is not found, show a "User not found" message
  // if (!userData && loading === false)
  //   throw new Response("You can't access this page", { status: 403 });

  const isOwnProfile = userId === currentUser?.id;
  const canViewIdeas = userDataLevel === "private" || userDataLevel === "public";
  const canViewTodoAndFavorites = userDataLevel === "private";

  return (
    <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar />

      <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingWrapper loading={loading}>
          {userData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {/* Avatar */}
                      {userData.avatarUrl ? (
                        <img
                          src={userData.avatarUrl}
                          alt={userData.username}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userData?.username}
                    </h2>

                    {/* Follow/Unfollow Button */}
                    {!isOwnProfile && (
                      <button
                        onClick={sentFollowRequest ? cancelSentFollowRequest : handleFollowToggle}
                        className={`mt-4 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto ${
                          isFollowing
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            : sentFollowRequest
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            <span>Unfollow</span>
                          </>
                        ) : sentFollowRequest ? (
                          <>
                            <UserMinus className="w-4 h-4" />
                            <span>Cancel Request</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}

                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {new Date(userData?.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </div>

                    {/* Profile Views (if available) */}
                    {/* {userData?.profileViewCount !== undefined && (
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <Eye className="w-4 h-4" />
                    <span>{userData.profileViewCount} profile views</span>
                  </div>
                )} */}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">Followers</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {userData?._count?.follower ?? userData?.follower?.length ?? 0}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">Following</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {userData?._count?.following ?? userData?.following?.length ?? 0}
                      </div>
                    </div>

                    {/* Completed Challenges (only for private/public access) */}
                    {userData?._count?.ideaStatus !== undefined && (
                      <div className="text-center col-span-2">
                        <div className="text-2xl font-bold text-purple-600">
                          COMPLETED CHALLENGES
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {userData._count.ideaStatus}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Ideas Section */}
                {canViewIdeas && userData?.ideas && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xl font-semibold text-gray-900 dark:text-white flex items-center cursor-pointer select-none"
                      >
                        <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                        {isOwnProfile ? "My Ideas" : `${userData.username}'s Ideas`}
                        <ChevronDown
                          className={`ml-2 w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </h3>
                      {isOwnProfile && (
                        <a href="/add-idea">
                          <button className="min-w-[100px] text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </a>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="space-y-4">
                        {userData.ideas.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No ideas shared yet
                          </p>
                        ) : (
                          userData.ideas.map((idea) => (
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
                                {isOwnProfile && (
                                  <button
                                    onClick={() => navigate(`/edit-idea/${idea.id}`)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => navigate(`/idea/${idea.id}`)}
                                  className="text-gray-400 ml-4 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Todo Section - Only for own profile */}
                {canViewTodoAndFavorites && userData?.todoIdeas && (
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
                      <a href="/ideas/search">
                        <button className=" min-w-[100px] text-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Search</span>
                        </button>
                      </a>
                    </div>
                    {todoExpanded && (
                      <div className="space-y-4">
                        {userData.todoIdeas.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No todo items yet
                          </p>
                        ) : (
                          userData.todoIdeas.map((idea) => (
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
                                    <button
                                      onClick={() => navigate(`/idea/${idea.id}`)}
                                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
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
                                <button
                                  onClick={() => navigate(`/idea/${idea.id}`)}
                                  className="text-gray-400 ml-4 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Saved Ideas Section - Only for own profile */}
                {canViewTodoAndFavorites && userData?.favoritedIdeas && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3
                        onClick={() => setSavedExpanded(!savedExpanded)}
                        className="text-xl font-semibold text-gray-900 dark:text-white flex items-center cursor-pointer select-none"
                      >
                        <Heart className="w-5 h-5 mr-2 text-red-500 fill-current" />
                        Favorites Ideas
                        <ChevronDown
                          className={`ml-2 w-4 h-4 transition-transform ${savedExpanded ? "rotate-180" : ""}`}
                        />
                      </h3>
                    </div>
                    {savedExpanded && (
                      <div className="space-y-4">
                        {userData.favoritedIdeas.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No saved ideas yet
                          </p>
                        ) : (
                          userData.favoritedIdeas.map((idea) => (
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
                                <button
                                  onClick={() => navigate(`/idea/${idea.id}`)}
                                  className="text-gray-400 ml-4 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Limited Access Message */}
                {!canViewIdeas && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 text-center">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Limited Profile Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Follow {userData.username} to see their ideas and activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </LoadingWrapper>
      </div>
      <Footer />
    </div>
  );
}
