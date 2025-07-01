import { AuthContext } from "../AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { apiUrl } from "../../utils/api.js";
import AnimatedList from "../common/AnimatedList.jsx";
import { User, Check, X, UserPlus, Users, ChevronDown } from "lucide-react";
import FollowRequestItem from "./FollowRequestItem.jsx";
import DropdownSection from "../common/DropdownSection.jsx";

export default function PendingFollowRequests({ isExpanded, setIsExpanded }) {
  const [followingRequests, setFollowingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    const fetchFollowingRequests = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/me/follow-requests`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch following requests");
        }
        const data = await response.json();
        if (response.ok) {
          setFollowingRequests(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowingRequests();
  }, []);

  const onAccept = async (requestId) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const response = await fetch(`${apiUrl}/follow-requests/${requestId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFollowingRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        throw new Error(data.message || "Failed to accept follow request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(requestId);
        return copy;
      });
    }
  };

  const onReject = async (requestId) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const response = await fetch(`${apiUrl}/follow-requests/${requestId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setFollowingRequests((prev) => prev.filter((request) => request.id !== requestId));
      } else {
        throw new Error(data.message || "Failed to reject follow request");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(requestId);
        return copy;
      });
    }
  };

  return (
    <div className="w-full">
      <DropdownSection
        title="Received Follow Requests"
        icon={Users}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        count={followingRequests.length}
      >
        {error && <div className="text-red-500 text-sm">⚠ {error}</div>}

        {followingRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">{loading ? "Loading..." : "No requests"}</p>
        ) : (
          followingRequests.map((request) => (
            <FollowRequestItem
              key={request.id}
              username={request.fromUsername}
              id={request.id}
              onAccept={onAccept}
              onReject={onReject}
              isProcessing={processingIds.has(request.id)}
            />
          ))
        )}
      </DropdownSection>
    </div>
  );
}
