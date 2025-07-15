import { useContext, useEffect, useState } from "react";
import { Eye } from "lucide-react";

import { AuthContext } from "../auth/index.js";
import { DropdownSection, FollowRequestItem } from "./index.js";
import { apiUrl } from "../../utils/index.js";
import { useSocialContext } from "./SocialContext.jsx";

import { useParams } from "react-router-dom";

export default function Followings({ isExpanded, setIsExpanded }) {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const userIdFixed = userId ? userId : user.id;
  const { refreshTrigger, triggerRefresh } = useSocialContext();

  // Fetch followings
  useEffect(() => {
    const fetchrequests = async () => {
      try {
        const response = await fetch(`${apiUrl}/follows/${userIdFixed}/followings`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch followings");
        }
        const data = await response.json();
        if (response.ok) {
          setFollowings(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchrequests();
  }, [isExpanded, refreshTrigger]);

  // Sop following user
  const onCancel = async (followingsId) => {
    setProcessingIds((prev) => new Set(prev).add(followingsId));
    try {
      const response = await fetch(`${apiUrl}/follows/${followingsId}/unfollow`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFollowings((prev) => prev.filter((request) => request.followingsId !== followingsId));
      } else {
        throw new Error(data.message || "Failed to reject follow request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(followingsId);
        return copy;
      });
      triggerRefresh();
    }
  };

  return (
    <div className="w-full">
      <DropdownSection
        title="Followings"
        icon={Eye}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        count={followings.length}
      >
        {error && <div className="text-red-500 text-sm">⚠ {error}</div>}

        {followings.length === 0 ? (
          <p className="text-gray-500 text-sm">{loading ? "Loading..." : "No followings"}</p>
        ) : (
          followings.map((request) => (
            <FollowRequestItem
              key={request.followingId}
              username={request.followingUsername}
              avatar={request.avatarUrl}
              id={request.followingId}
              onReject={onCancel}
              isProcessing={processingIds.has(request.id)}
            />
          ))
        )}
      </DropdownSection>
    </div>
  );
}
