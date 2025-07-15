import { useEffect, useState } from "react";

import { DropdownSection, FollowRequestItem } from "./index.js";
import { apiUrl } from "../../utils/index.js";
import { useSocialContext } from "./SocialContext.jsx";

import { Send } from "lucide-react";

export default function SentFollowRequests({ isExpanded, setIsExpanded }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const { refreshTrigger, triggerRefresh } = useSocialContext();

  useEffect(() => {
    const fetchrequests = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/me/sent-follow-requests`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch following requests");
        }
        const data = await response.json();
        if (response.ok) {
          setRequests(data.data);
          console.log("Takie dostaje w request: ", data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchrequests();
  }, [refreshTrigger]);

  const onCancel = async (userId) => {
    setProcessingIds((prev) => new Set(prev).add(userId));
    try {
      const response = await fetch(`${apiUrl}/follow-requests/sent/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setRequests((prev) => prev.filter((request) => request.userId !== userId));
      } else {
        throw new Error(data.message || "Failed to reject follow request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });
      triggerRefresh();
    }
  };

  return (
    <div className="w-full">
      <DropdownSection
        title="Sent Follow Requests"
        icon={Send}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        count={requests.length}
      >
        {error && <div className="text-red-500 text-sm">⚠ {error}</div>}

        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">{loading ? "Loading..." : "No requests"}</p>
        ) : (
          requests.map((request) => (
            <FollowRequestItem
              key={request.id}
              username={request.toUsername}
              avatar={request.avatarUrl}
              id={request.toUserId}
              onReject={onCancel}
              isProcessing={processingIds.has(request.id)}
            />
          ))
        )}
      </DropdownSection>
    </div>
  );
}
