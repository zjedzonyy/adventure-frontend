import Navbar from "../common/Navbar";
import Footer from "../common/Footer.jsx";
import { AuthContext } from "../AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../utils/api.js";
import { User, Check, X, UserPlus, Users, ChevronDown } from "lucide-react";
import PendingFollowRequests from "../common/PendingFollowRequests.jsx";
import SentFollowRequests from "../common/SentFollowRequests.jsx";
import Followers from "../common/Followers.jsx";
import Followings from "../common/Followings.jsx";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sentIsExpanded, setSentIsExpanded] = useState(false);
  const [followersIsExpanded, setFollowersIsExpanded] = useState(false);
  const [followingsIsExpanded, setFollowingsIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar />
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PendingFollowRequests
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        ></PendingFollowRequests>
        <SentFollowRequests
          isExpanded={sentIsExpanded}
          setIsExpanded={setSentIsExpanded}
        ></SentFollowRequests>
        <Followers
          isExpanded={followersIsExpanded}
          setIsExpanded={setFollowersIsExpanded}
        ></Followers>
        <Followings
          isExpanded={followingsIsExpanded}
          setIsExpanded={setFollowingsIsExpanded}
        ></Followings>
      </div>
      <Footer />
    </div>
  );
}
