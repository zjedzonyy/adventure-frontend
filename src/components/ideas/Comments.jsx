import { useContext, useState } from "react";
import { AuthContext } from "../auth";
import { SortComponent } from "../common";
import { apiUrl } from "../../utils";
import {
  User,
  Calendar,
  MessageCircle,
  Send,
  ThumbsUp,
  Flag,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Comments({
  comments = [],
  currentPage,
  totalPages,
  setCurrentPage,
  newComment,
  setNewComment,
  handleAddComment,
  handleLikeComment,
  commentsCount,
  setClicked,
  setCommentSortChange,
  commentSort,
  setCommentSort,
}) {
  const { user, avatarUrl } = useContext(AuthContext);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const sortOptions = {
    newest: { label: "Newest" },
    oldest: { label: "Oldest" },
    popular: { label: "Most Popular" },
    least_popular: { label: "Least Popular" },
    rating: { label: "Highest Rated" },
    least_rating: { label: "Lowest Rated" },
    completed: { label: "Most Completed" },
    least_completed: { label: "Least Completed" },
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      setClicked((prev) => !prev);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const res = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ description: editedContent }),
      });
      if (!res.ok) throw new Error("Failed to edit comment");
      setClicked((prev) => !prev);
      setEditedCommentId(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const renderAvatar = (imgUrl, username) =>
    imgUrl ? (
      <img src={imgUrl} alt={username} className="w-10 h-10 rounded-full object-cover" />
    ) : (
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-white" />
      </div>
    );

  const renderAddComment = () =>
    user && (
      <div className="mb-12">
        <div className="flex space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            {renderAvatar(avatarUrl, user.username)}
          </div>
          <div className="flex-1 text-text_secondary dark:text-text_primary">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this idea..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows="4"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  if (comments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 mr-3" />
            Comments (0)
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No comments yet. Be the first to share your thoughts!
          </p>
          {renderAddComment()}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 mr-3" />
          Comments ({commentsCount})
        </h2>
        {renderAddComment()}
        <div className="space-y-6 mb-8">
          {/* <SortComponent
            sortOptions={sortOptions}
            currentSort={commentSort}
            onSortChange={setCommentSort}
            className="max-w-xs"
            setCommentSortChange={setCommentSortChange}
          /> */}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex space-x-4 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg flex-col sm:flex-row"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  {renderAvatar(comment.author.avatarUrl, comment.author.username)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex text-gray-900 dark:text-white">
                    {comment.author.username}
                    <p className="pl-2">{comment.author.userIdeaRating || "Not rated"}</p>
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(comment.createdAt).toLocaleDateString("pl-PL")}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  {comment.description}
                </p>
                <div className="flex items-center space-x-5 text-sm mb-3 py-2">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="text-gray-500 hover:text-blue-500 flex items-center space-x-1 mr-auto transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.commentLikes || 0}</span>
                  </button>
                  {user && user.username === comment.author.username && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setEditedCommentId(comment.id);
                          setEditedContent(comment.description);
                        }}
                        className="text-gray-500 hover:text-yellow-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => console.log("Report comment", comment.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
                {editedCommentId === comment.id && (
                  <div className="w-full">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows="4"
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none transition"
                      placeholder="Edit your comment..."
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditedCommentId(null)}
                        className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
