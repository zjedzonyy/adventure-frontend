import { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../utils/api.js";
import { Eye } from "lucide-react";
import FollowRequestItem from "./FollowRequestItem.jsx";
import DropdownSection from "./DropdownSection.jsx";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

export default function Followers({ isExpanded, setIsExpanded }) {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const userIdFixed = userId ? userId : user.id;

  // Fetch followers
  useEffect(() => {
    const fetchrequests = async () => {
      try {
        const response = await fetch(`${apiUrl}/follows/${userIdFixed}/followers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch followers");
        }
        const data = await response.json();
        if (response.ok) {
          setFollowers(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchrequests();
  }, []);

  // Remove follower
  const onCancel = async (followerId) => {
    setProcessingIds((prev) => new Set(prev).add(followerId));
    try {
      const response = await fetch(`${apiUrl}/follows/${followerId}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFollowers((prev) => prev.filter((request) => request.followerId !== followerId));
      } else {
        throw new Error(data.message || "Failed to reject follow request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(followerId);
        return copy;
      });
    }
  };

  return (
    <div className="w-full">
      <DropdownSection
        title="Followers"
        icon={Eye}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        count={followers.length}
      >
        {error && <div className="text-red-500 text-sm">⚠ {error}</div>}

        {followers.length === 0 ? (
          <p className="text-gray-500 text-sm">{loading ? "Loading..." : "No followers"}</p>
        ) : (
          followers.map((request) => (
            <FollowRequestItem
              key={request.followerId}
              username={request.followerUsername}
              id={request.followerId}
              onReject={onCancel}
              isProcessing={processingIds.has(request.id)}
            />
          ))
        )}
      </DropdownSection>
    </div>
  );
}
