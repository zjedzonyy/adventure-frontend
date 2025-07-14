import React, { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { LoadingWrapper } from "../common/index.js";
import { Navbar, Footer, MainBackground } from "../layout/index.js";
import { Comments, IdeaDetailsProvider } from "../ideas/index.js";
import { StarRating } from "../ui/index.js";
import { apiUrl } from "../../utils/index.js";

import {
  Heart,
  User,
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Eye,
  Award,
  Target,
  CheckCircle,
  BookmarkPlus,
  Share2,
  Play,
} from "lucide-react";

export default function Idea() {
  const { ideaId } = useParams();
  const [ideaData, setIdeaData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const commentsFilters = `?page=${currentPage}&limit=${commentsPerPage}`;
  const [pagination, setPagination] = useState(null);

  const [ratingClicked, setRatingClicked] = useState(false);
  const [userRating, setUserRating] = useState(null); // float, e.g. 3.5
  const [hoverRating, setHoverRating] = useState(null); // float, e.g. 3.5

  const [commentSortChange, setCommentSortChange] = useState(false);
  const [commentSort, setCommentSort] = useState("newest");

  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(true);

  // Fetch idea data
  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas/${ideaId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setIdeaData(data.data);
          setUserStatus(data.data.userStatus);
        }
      } catch (error) {
        console.error("Failed to fetch idea data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeaData();
  }, [ideaId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/comments/${ideaId}${commentsFilters}sort=${commentSort}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          setComments(data.data.comments || []);
          setPagination(data.data.pagination || {});
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [ideaId, ratingClicked, currentPage, commentSortChange, refreshTrigger]);

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas/${ideaId}/review`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setUserRating(data.data.rating);
          setHoverRating(data.data.rating);
        }
      } catch (error) {
        console.error("Failed to fetch user rating:", error);
      } finally {
        setRatingLoading(false);
      }
    };
    fetchUserRating();
  }, [ratingClicked, ideaId]);

  const handleLikeComment = async (commentId) => {
    setRefreshTrigger((prev) => prev + 1);
    try {
      const res = await fetch(`${apiUrl}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likedComment: data.data.likedComment,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/comments/${ideaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ description: newComment }),
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleRating = async (rating) => {
    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (data.success) {
        setUserRating(rating);
      }
    } catch (error) {
      console.error("Failed to rate idea:", error);
    }
  };

  const handleStatusChange = async (ideaStatus) => {
    try {
      const res = await fetch(`${apiUrl}/ideas/${ideaId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ideaStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUserStatus(ideaStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "FAVORITED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "TODO":
        return <Target className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Play className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "FAVORITED":
        return <Heart className="w-4 h-4 fill-current" />;
      default:
        return <BookmarkPlus className="w-4 h-4" />;
    }
  };

  // If ideaData or comments are not available, show a not found message
  if (!ideaData) {
    return (
      <div className="bg-gray-50 dark:bg-dark_background min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-text_secondary">Idea not found</div>
        </div>
      </div>
    );
  }

  return (
    <IdeaDetailsProvider>
      <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
        <Navbar />
        <div className="min-h-screen">
          {/* Main Idea Content - Full Width */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingWrapper loading={isLoading} page={false}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
                {/* Header with Categories and Challenge Badge */}
                <div className="mb-6">
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {ideaData.isChallenge && (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        Challenge
                      </span>
                    )}
                    {/* Categories */}
                    {ideaData.categories?.map((category, index) => (
                      <span
                        key={`cat-${index}`}
                        className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-800 dark:text-purple-200 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap hover:shadow-md transition-shadow cursor-pointer"
                      >
                        #{category.label || category.name}
                      </span>
                    ))}
                    {/* Group Sizes */}
                    {ideaData.groupSizes?.map((groupSize, index) => (
                      <span
                        key={`group-${index}`}
                        className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap hover:shadow-md transition-shadow cursor-pointer flex items-center"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {groupSize.label || groupSize.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title and Description */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 break-words">
                    {ideaData.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                    {ideaData.description}
                  </p>
                </div>

                {/* Hashtags Section - Categories and Group Sizes */}
                {(ideaData.data?.categories?.length > 0 ||
                  ideaData.data?.groupSizes?.length > 0) && (
                  <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Tags & Groups
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {/* Category Hashtags */}
                      {ideaData.data?.categories?.map((category, index) => (
                        <span
                          key={`hashtag-cat-${index}`}
                          className="inline-flex items-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                        >
                          <Hash className="w-3 h-3 mr-1" />
                          {category.label || category.name}
                        </span>
                      ))}

                      {/* Group Size Hashtags */}
                      {ideaData.data?.groupSizes?.map((groupSize, index) => (
                        <span
                          key={`hashtag-group-${index}`}
                          className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                        >
                          <Users className="w-3 h-3 mr-1" />
                          {groupSize.label || groupSize.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author and Meta Info */}
                <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8 pb-6 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      {/* Avatar */}
                      {ideaData.author.avatarUrl ? (
                        <img
                          src={ideaData.author.avatarUrl}
                          alt={ideaData.author.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {ideaData.author.username}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(ideaData.createdAt).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center space-x-6 w-full sm:w-auto">
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">{ideaData.viewCount}</span>
                      <span className="text-sm">views</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{ideaData.completionCount}</span>
                      <span className="text-sm">completed</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => alert("Share functionality not implemented yet")}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ideaData.locationType}
                      </p>
                    </div>
                  </div>

                  {ideaData.duration && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ideaData.duration.label}
                        </p>
                      </div>
                    </div>
                  )}

                  {ideaData.priceRange && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Price Range</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {ideaData.priceRange.label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating and Actions Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <div>
                      <LoadingWrapper loading={ratingLoading} page={false}>
                        <div className="flex items-center space-x-1">
                          {userRating === null ? (
                            <p>Loading...</p>
                          ) : (
                            <StarRating
                              userRating={userRating}
                              setUserRating={setUserRating}
                              hoverRating={hoverRating}
                              setHoverRating={setHoverRating}
                              handleRating={handleRating}
                              averageRating={ideaData.averageRating}
                            />
                          )}
                        </div>
                      </LoadingWrapper>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:space-x-4 gap-2">
                    <select
                      value={userStatus || ""}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="p-1 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select status</option>
                      <option value="TODO">Add to TODO</option>
                      <option value="IN_PROGRESS">Mark as In Progress</option>
                      <option value="COMPLETED">Mark as Completed</option>
                      <option value="FAVORITED">Add to Favorites</option>
                    </select>

                    {userStatus && (
                      <div
                        className={`flex items-center px-4 py-2 rounded-lg ${getStatusColor(userStatus)}`}
                      >
                        {getStatusIcon(userStatus)}
                        <span className="ml-2 text-sm font-medium">
                          {userStatus.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step-by-step Instructions Placeholder */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Step-by-step Instructions
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <MDEditor.Markdown
                      source={ideaData.detailedDescription}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  </div>
                </div>
              </div>
            </LoadingWrapper>
          </div>

          {/* Comments Section - Full Width, Centered */}
          <LoadingWrapper loading={commentsLoading} page={false}>
            <Comments
              comments={comments}
              currentPage={pagination?.currentPage}
              totalPages={pagination?.totalPages}
              commentsCount={pagination?.totalItems}
              setCurrentPage={setCurrentPage}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              handleLikeComment={handleLikeComment}
              setClicked={() => setRefreshTrigger((prev) => prev + 1)}
              commentSortChange={commentSortChange}
              setCommentSortChange={setCommentSortChange}
              commentSort={commentSort}
              setCommentSort={setCommentSort}
            ></Comments>
          </LoadingWrapper>
        </div>

        <Footer />
      </div>
    </IdeaDetailsProvider>
  );
}
