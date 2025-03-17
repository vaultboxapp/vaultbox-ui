"use client";

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JitsiMeetComponent from "./JitsiMeetComponent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

const MeetingRoom = () => {
  const { user } = useAuth();
  const { roomId } = useParams(); // Room identifier from URL (could be a meeting ID or name)
  const location = useLocation();
  const navigate = useNavigate();
  const [inMeeting, setInMeeting] = useState(true);
  const [jwtToken, setJwtToken] = useState(location.state?.token || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only admins need to fetch a token; normal users join without one.
    if (user.role === "admin" && !jwtToken) {
      setLoading(true);
      axios
        .post(
          "http://localhost:5000/api/auth/jitsi-token",
          { room: roomId },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.token) {
            setJwtToken(response.data.token);
          } else {
            throw new Error("Token not received");
          }
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        })
        .finally(() => setLoading(false));
    } else if (user.role !== "admin") {
      // For non-admin users, we simply set token to empty.
      setJwtToken("");
    }
  }, [roomId, jwtToken, user.role]);

  const handleMeetingEnd = () => {
    setInMeeting(false);
  };

  if (loading) return <div>Loading meeting...</div>;
  // For admins, if token is required but not available, show an error.
  if (user.role === "admin" && !jwtToken) return <div>Error: No token available.</div>;

  return (
    <div className="w-full h-screen relative">
      {inMeeting ? (
        <JitsiMeetComponent
          roomName={roomId}
          // Use user.username; fallback to "Guest" if not defined.
          user={user.username || "Guest"}
          jwtToken={jwtToken}
          onMeetingEnd={handleMeetingEnd}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p>You have left the meeting.</p>
          <Button onClick={() => navigate("/video")}>Back</Button>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
