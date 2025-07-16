import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import {
  PendingFollowRequests,
  SentFollowRequests,
  Followers,
  Followings,
} from "../socials/index.js";
import { useContext, useState } from "react";
import { Upload, Trash2, User, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { apiUrl } from "../../utils/index.js";
import { SocialProvider } from "../socials/SocialContext.jsx";

export default function Settings() {
  const { avatarUrl, updateAvatar, clearAvatar } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  // State for dropdowns
  const [isExpanded, setIsExpanded] = useState(false);
  const [sentIsExpanded, setSentIsExpanded] = useState(false);
  const [followersIsExpanded, setFollowersIsExpanded] = useState(false);
  const [followingsIsExpanded, setFollowingsIsExpanded] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setMessage("");
    validateFileSize(e.target.files[0]);
    validateFileType(e.target.files[0]);
  };

  const validateFileType = file => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    validTypes.includes(file.type) ||
      setMessage("Error: Invalid file type. Please upload a JPEG/JPG/PNG image.");
  };

  const validateFileSize = file => {
    const maxSize = 5 * 1024 * 1024; // 10 MB
    file.size <= maxSize ||
      setMessage("Error: File size exceeds 5MB. Please upload a smaller image.");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");
    if (avatarUrl) return setMessage("Error: Please delete your avatar first");

    setIsUploading(true);
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/users/avatars`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {},
      });

      if (!res.ok) throw new Error("Couldn't upload");

      const data = await res.json();
      if (data.success) {
        setMessage(data.message || "Avatar updated successfully!");
        setFile(null);
        await updateAvatar(data.data);
      }

      // Reset file input
      document.getElementById("avatar-upload").value = "";
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${apiUrl}/users/avatars`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Couldn't delete");

      const data = await res.json();
      if (data.success) {
        setMessage(data.message || "Avatar deleted successfully!");
        clearAvatar();
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SocialProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />

        {/* Main Content */}
        <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section - Left Column */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Manage Avatar
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update or delete your avatar
                  </p>
                </div>

                {/* Current Avatar Display */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="User avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-gray-200 dark:border-gray-600">
                      <Camera className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="avatar-upload"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Choose a new avatar
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                    />
                    {file && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Selected file: {file.name}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        !file || isUploading
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Update Avatar</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDeleteAvatar}
                      disabled={isDeleting}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isDeleting
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Avatar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div
                      className={`p-3 rounded-lg flex items-center space-x-2 ${
                        message.includes("Error")
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      }`}
                    >
                      {message.includes("Error") ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <p
                        className={`text-xs font-medium ${
                          message.includes("Error")
                            ? "text-red-700 dark:text-red-300"
                            : "text-green-700 dark:text-green-300"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Sections - Right Column */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Community
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your connections and follow requests
                  </p>
                </div>

                <PendingFollowRequests isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                <SentFollowRequests isExpanded={sentIsExpanded} setIsExpanded={setSentIsExpanded} />
                <Followers
                  isExpanded={followersIsExpanded}
                  setIsExpanded={setFollowersIsExpanded}
                />
                <Followings
                  isExpanded={followingsIsExpanded}
                  setIsExpanded={setFollowingsIsExpanded}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </SocialProvider>
  );
}
