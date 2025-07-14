import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/index.js";
import { Navbar, Footer } from "../layout/index.js";
import { IdeaCard } from "../ideas/index.js";
import { LoadingWrapper } from "../common/index.js";

import { Compass, Users, Heart, Star, Plus, Dice1 } from "lucide-react";
import { apiUrl } from "../../utils/api.js";

export default function Homepage() {
  const { user, darkMode, toggleDarkMode, labels } = React.useContext(AuthContext);
  const [sampleIdeas, setSampleIdeas] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
      navigate(`/idea/${data.data}`, { state: { from: location.pathname } });
    } catch (err) {
      console.error(err);
    }
  };

  const navigateTo = (path) => {
    if (!user) {
      navigate("/login", { state: { from: path } });
      return;
    }

    navigate(path);
  };

  useEffect(() => {
    const getBestIdeas = async () => {
      try {
        const res = await fetch(`${apiUrl}/ideas/popular`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setSampleIdeas(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBestIdeas();
  }, []);

  const categories = [
    "Self-Discovery",
    "Art",
    "Cooking",
    "Creativity",
    "Sports",
    "Travel",
    "Technology",
    "Music",
    "Science",
    "Mindfulness",
    "Education",
  ];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      {/* Header */}

      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="bg-gradient-to-br dark:from-dark_secondary dark:to-dark_primary from-purple-600 via-blue-600 to-cyan-500 text-white py-20">
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
              <p className="text-gray-600 dark:text-text_primary">
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
            <p className="text-lg text-gray-600 dark:text-text_primary">
              Discover what others are loving right now
            </p>
          </div>
          <LoadingWrapper loading={loading} page={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleIdeas?.map((idea) => (
                <IdeaCard idea={idea} key={idea.id}></IdeaCard>
              ))}
            </div>
          </LoadingWrapper>
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
              <div
                onClick={() => navigateTo("/ideas/search")}
                className="bg-white w-20 h-20 cursor-pointer ease-in duration-200 hover:scale-[1.15] dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
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
              <div
                onClick={() => navigateTo("/add-idea")}
                className="bg-white w-20 h-20 cursor-pointer ease-in duration-200 hover:scale-[1.15] dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
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
              <div
                onClick={() => navigateTo("/settings")}
                className="bg-white w-20 h-20 cursor-pointer ease-in duration-200 hover:scale-[1.15] dark:bg-dark_background rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
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
