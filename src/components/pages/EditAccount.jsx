/* eslint-disable no-undef */
import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import { useContext, useState } from "react";
import { apiUrl } from "../../utils/index.js";
import { Upload, Trash2, User, Camera, CheckCircle, AlertCircle } from "lucide-react";

export default function EditAccount() {
  const { avatarUrl, darkMode } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");

    setIsUploading(true);
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
      setMessage(data.message || "Avatar updated successfully!");
      setFile(null);
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
      setMessage(data.message || "Avatar deleted successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar />
      {/* Main Content */}
      <section className="min-h-screen flex items-center  bg-white dark:bg-dark_background">
        <div className="max-w-4xl mx-auto">
          {/* Avatar Section */}
          <div className="bg-white dark:bg-dark_background_secondary rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-text_primary mb-4">
                Manage Avatar
              </h3>
              <p className="text-lg text-gray-600 dark:text-text_secondary">
                Update or delete your profile avatar
              </p>
            </div>

            {/* Current Avatar Display */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-24 h-24 text-gray-700 dark:text-white" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-dark_background rounded-full p-2 shadow-lg">
                  <Camera className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md">
                  <label
                    htmlFor="avatar-upload"
                    className="block text-sm font-medium text-gray-700 dark:text-text_secondary mb-2"
                  >
                    Choose new avatar
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-dark_background dark:text-text_primary transition-all duration-200"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-text_secondary">
                      Selected: {file.name}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2 ${
                      !file || isUploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        : darkMode
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50"
                          : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white shadow-purple-500/30 hover:shadow-purple-500/50"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Update Avatar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDeleteAvatar}
                    disabled={isDeleting}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2 ${
                      isDeleting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-red-500/30 hover:shadow-red-500/50"
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Delete Avatar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`max-w-md mx-auto p-4 rounded-xl flex items-center space-x-3 ${
                    message.includes("Error")
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                      : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  }`}
                >
                  {message.includes("Error") ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <p
                    className={`text-sm font-medium ${
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
      </section>

      <Footer />
    </div>
  );
}
