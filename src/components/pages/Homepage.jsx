import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";

import { Compass, Users, Heart, Star, Plus, Dice1 } from "lucide-react";
import { apiUrl } from "../../utils/api.js";

export default function Homepage() {
  const { user, darkMode, toggleDarkMode, labels } = React.useContext(AuthContext);
  const [sampleIdeas, setSampleIdeas] = useState(null);
  const navigate = useNavigate();

  const handleRandomIdea = async () => {
    if (!user) {
      const luckyNumber = Math.floor(Math.random() * 50);
      const intendedPath = `/idea/${luckyNumber}`;
      navigate("/login", { state: { from: intendedPath } });
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/ideas/lucky`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      navigate(`/idea/${data.data}`, { state: { from: location.pathname } });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getBestIdeas = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas?limit=6&page=1&sort=popular`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setSampleIdeas(data.data.ideas);
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getBestIdeas();
  }, []);

  const categories = [
    "All",
    "Self-Discovery",
    "Art",
    "Cooking",
    "Creativity",
    "Sports",
    "Travel",
    "Technology",
    "Music",
    "Science",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      {/* Header */}

      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="bg-gradient-to-br dark:from-dark_secondary dark:to-dark_primary from-purple-600 via-blue-600 to-cyan-500 text-white py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold mb-8 leading-tight">Find. Try. Repeat.</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Thousands of real-world ideas waiting to level up your free time. What will you try
            next?
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleRandomIdea()}
              className={`px-12 py-5 text-xl font-bold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-2xl ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black shadow-yellow-500/30 hover:shadow-yellow-500/50"
              }`}
            >
              Get Random Idea
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white dark:bg-dark_background dark:border-dark_background_secondary shadow-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-text_primary mb-2">
                Choose from hundreds of categories
              </h3>
              <p className="text-gray-600 dark:text-text_secondary">
                Find the perfect activity for your interests
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-end max-w-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-full dark:hover:bg-dark_secondary dark:hover:text-text_primary hover:bg-purple-100 hover:text-purple-700 transition-all duration-200 ease-in-out font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ideas Grid */}
      <section className="py-16 bg-white dark:bg-dark_background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-text_primary mb-4">
              Popular Ideas
            </h3>
            <p className="text-lg text-gray-600 dark:text-text_secondary">
              Discover what others are loving right now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleIdeas?.map((idea) => (
              <div
                key={idea.id}
                className="bg-white dark:bg-dark_background_secondary rounded-xl shadow-lg hover:shadow-blue-500 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
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
                          {idea.author}
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
      <section className="py-20 dark:bg-dark_background_secondary bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Users className="w-20 h-20 text-purple-600" />
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6 dark:text-text_primary">
            Join the community of discoverers
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto dark:text-text_secondary leading-relaxed">
            Over 50,000 users are already discovering new possibilities. Share your ideas and find
            inspiration in others.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            <div className="text-center">
              <div className="bg-white w-20 h-20 dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Compass className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-text_secondary">
                Discover
              </h4>
              <p className="text-gray-600 dark:text-text_secondary text-lg">
                Browse thousands of ideas from different categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 dark:bg-dark_background dark:fill-current rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Plus className="w-10 h-10 text-purple-600 " />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-text_secondary">
                Create
              </h4>
              <p className="text-gray-600 dark:text-text_secondary text-lg">
                Add your own ideas and share your knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-20 h-20 dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-text_secondary">
                Connect
              </h4>
              <p className="text-gray-600 dark:text-text_secondary text-lg">
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
