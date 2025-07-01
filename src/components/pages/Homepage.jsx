import React from "react";
import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";

import {
  Search,
  Compass,
  Users,
  Heart,
  Star,
  Plus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Drama,
  Sun,
  Moon,
} from "lucide-react";

export default function Homepage() {
  const { darkMode, toggleDarkMode } = React.useContext(AuthContext);

  const sampleIdeas = [
    {
      id: 1,
      title: "Explore your ethnic heritage",
      description:
        "Discover your genetic roots using DNA tests. Learn the detailed guide to available testing options.",
      category: "Self-Discovery",
      author: "Anna K.",
      likes: 124,
      difficulty: "Easy",
      time: "2-6 weeks",
    },
    {
      id: 2,
      title: "Learn Japanese calligraphy",
      description:
        "Introduction to the art of shodo - Japanese calligraphy. From basic tools to first characters.",
      category: "Art",
      author: "Tom M.",
      likes: 89,
      difficulty: "Medium",
      time: "3-6 months",
    },
    {
      id: 3,
      title: "Make your own cheese at home",
      description: "Complete guide to making ricotta, mozzarella and hard cheeses at home.",
      category: "Cooking",
      author: "Maria L.",
      likes: 203,
      difficulty: "Medium",
      time: "1-3 days",
    },
    {
      id: 4,
      title: "Create your own podcast",
      description:
        "From idea to publication - everything you need to know about creating a podcast, equipment and promotion.",
      category: "Creativity",
      author: "Paul R.",
      likes: 156,
      difficulty: "Hard",
      time: "1-2 months",
    },
  ];

  const categories = [
    "All",
    "Self-Discovery",
    "Art",
    "Cooking",
    "Creativity",
    "Sports",
    "Travel",
    "Technology",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      {/* Header */}
      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="bg-gradient-to-br dark:from-dark_secondary dark:to-dark_primary from-purple-600 via-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Discover. Create. Share.</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Thousands of ideas for new experiences are waiting to be discovered. From genetic
            testing to learning calligraphy - find something for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => setCurrentView("register")}
              className="bg-white text-secondary dark:text-dark_secondary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-110"
            >
              Random Idea
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-dark_background dark:border-dark_background_secondary shadow-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for ideas... e.g. 'cooking', 'travel', 'hobbies'"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 text-text_secondary dark:text-text_primary rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full dark:hover:bg-dark_secondary dark:hover:text-text_primary hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 ease-in-out delay-100 text-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideas Grid */}
      <section className="py-12 bg-white dark:bg-dark_background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-text_primary">
              Popular Ideas
            </h3>
            <button
              className="bg-primary dark:bg-dark_primary text-text_primary px-4 py-2 rounded-lg  
                hover:bg-secondary hover:brightness-115 transition-all duration-300 ease-in-out delay-100
                dark:hover:bg-dark_secondary dark:hover:brightness-125 dark:transition-all dark:duration-300 dark:ease-in-out dark:delay-100
                flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Idea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleIdeas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white dark:bg-dark_background_secondary  rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-purple-100 dark:bg-dark_primary dark:text-text_primary text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {idea.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-text_secondary">
                        {idea.likes}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900 mb-2 dark:text-text_secondary dark:hover:text-text_primary group-hover:text-purple-600 dark:group-hover:text-text_primary transition-colors">
                    {idea.title}
                  </h4>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 dark:text-text_secondary">
                    {idea.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto mb-4 dark:text-text_secondary ">
                    <span>Level: {idea.difficulty}</span>
                    <span>Time: {idea.time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-950">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold dark:text-text_secondary">
                          {idea.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-text_secondary">
                        {idea.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </button>
                      <span className="text-sm text-gray-600 dark:text-text_secondary">4.76</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 dark:bg-dark_background_secondary bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join the community of discoverers
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto dark:text-text_secondary">
            Over 50,000 users are already discovering new possibilities. Share your ideas and find
            inspiration in others.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white w-16 h-16 dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Compass className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 dark:text-text_secondary">
                Discover
              </h4>
              <p className="text-gray-600 dark:text-text_secondary">
                Browse thousands of ideas from different categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 dark:bg-dark_background dark:fill-current rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-purple-600 " />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 dark:text-text_secondary">
                Create
              </h4>
              <p className="text-gray-600 dark:text-text_secondary">
                Add your own ideas and share your knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 dark:text-text_secondary">
                Connect
              </h4>
              <p className="text-gray-600 dark:text-text_secondary">
                Find friends with similar interests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
