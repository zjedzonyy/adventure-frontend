import React, { useState, useEffect, useContext, use } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import { apiUrl } from "../../utils/index.js";

import {
  Plus,
  User,
  FileText,
  Tag,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Award,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from "lucide-react";
export default function AddIdea() {
  const { user, darkMode, labels } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
    isChallenge: false,
    durationId: "",
    categories: [],
    groups: [],
    priceRangeId: "",
    locationType: "",
    detailedDescription: "",
  });

  const [availableOptions, setAvailableOptions] = useState({
    categories: [],
    groups: [],
    priceRanges: [],
    durations: [],
    locationTypes: [],
    statusTypes: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize available options from labels
  useEffect(() => {
    if (labels) {
      setAvailableOptions(labels);
    }
  }, [labels]);

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    // Categories validation
    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    // Groups validation
    if (formData.groups.length === 0) {
      newErrors.groups = "At least one group size is required";
    }

    // Price range validation
    if (!formData.priceRangeId) {
      newErrors.priceRangeId = "Price range is required";
    }

    if (!formData.durationId) {
      newErrors.durationId = "Duration is required";
    }

    // Location type validation
    if (!formData.locationType) {
      newErrors.locationType = "Location type is required";
    }

    // Detailed description validation
    if (!formData.description.trim()) {
      newErrors.detailedDescription = "Description is required";
    } else if (formData.detailedDescription.length > 2500) {
      newErrors.detailedDescription = "Description must be less than 2500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === "detailedDescription" && value && value.length > 2500) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleMultiSelect = (field, optionId) => {
    const currentSelection = formData[field];
    const newSelection = currentSelection.includes(optionId)
      ? currentSelection.filter((id) => id !== optionId)
      : [...currentSelection, optionId];

    handleInputChange(field, newSelection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        durationId: parseInt(formData.durationId),
        priceRangeId: parseInt(formData.priceRangeId),
      };

      const response = await fetch(`${apiUrl}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate(`/idea/${data.ideaId}`);
        }, 2000);
      } else {
        if (data.field && data.message) {
          setErrors((prev) => ({
            ...prev,
            [data.field]: data.message,
          }));
        } else {
          setErrors({ general: data.message || "Failed to create idea" });
        }
      }
    } catch (error) {
      console.error("Error creating idea:", error);
      setErrors({ general: "An error occurred while creating the idea" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Success!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your idea has been created successfully. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar></Navbar>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Idea</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Share your creative idea with the community
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-400">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.title}</p>
              )}
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.title ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Enter idea title..."
                  maxLength={200}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.description}</p>
              )}
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
                  errors.description ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="Describe your idea in detail..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Detailed description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed description *
              </label>
              {errors.detailedDescription && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                  {errors.detailedDescription}
                </p>
              )}
              <div
                className={`rounded-lg ${errors.detailedDescription ? "ring-2 ring-red-400" : ""}`}
              >
                <MDEditor
                  value={formData.detailedDescription}
                  onChange={(val) => handleInputChange("detailedDescription", val || "")}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragBar={false}
                  height={200}
                  data-color-mode={
                    document.documentElement.classList.contains("dark") ? "dark" : "light"
                  }
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {(formData.detailedDescription || "").length}/2500 characters
              </p>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories * (Select at least one)
              </label>
              {errors.categories && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.categories}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableOptions.categories.slice(1).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleMultiSelect("categories", category.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      formData.categories.includes(category.id)
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Sizes * (Select at least one)
              </label>
              {errors.groups && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.groups}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableOptions.groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleMultiSelect("groups", group.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      formData.groups.includes(group.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{group.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range *
              </label>
              {errors.priceRangeId && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.priceRangeId}</p>
              )}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.priceRangeId}
                  onChange={(e) => handleInputChange("priceRangeId", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.priceRangeId ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Select price range...</option>
                  {availableOptions.priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Type *
              </label>
              {errors.locationType && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.locationType}</p>
              )}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.locationType}
                  onChange={(e) => handleInputChange("locationType", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.locationType ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  {/* Default option */}
                  <option value="">Select location type...</option>
                  {availableOptions.locationTypes.lenght !== 0 &&
                    availableOptions.locationTypes.map((location) => (
                      <option key={location.value} value={location.value}>
                        {location.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Duration (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration *
              </label>
              {errors.durationId && (
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">{errors.durationId}</p>
              )}
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={formData.durationId}
                  onChange={(e) => handleInputChange("durationId", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.durationId ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  {/* Default option */}
                  <option value="">Select duration range...</option>
                  {availableOptions.durations.length !== 0 &&
                    availableOptions.durations.map((duration) => (
                      <option key={duration.label} value={duration.id}>
                        {duration.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Make idea active
                </label>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="isChallenge"
                  checked={formData.isChallenge}
                  onChange={(e) => handleInputChange("isChallenge", e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isChallenge"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <Award className="w-4 h-4 inline mr-1" />
                  Mark as challenge
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creating Idea...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Idea
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
