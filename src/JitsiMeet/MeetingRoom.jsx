"use client";

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JitsiMeetComponent from "./JitsiMeetComponent";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const MeetingRoom = () => {
  const { roomId } = useParams(); // Get room name from URL
  const location = useLocation();
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState(location.state?.token || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jwtToken) {
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
    }
  }, [roomId, jwtToken]);

  const handleMeetingEnd = () => {
    navigate("/video"); // Navigate back to the meeting creation page
  };

  if (loading) return <div>Loading meeting...</div>;
  if (!jwtToken) return <div>Error: No token available.</div>;

  return (
    <div className="w-full h-screen relative">
      <Button
        variant="ghost"
        className="absolute top-4 right-4 z-10"
        onClick={handleMeetingEnd}
      >
        <X className="h-4 w-4 mr-2" />
        Leave Meeting
      </Button>
      <JitsiMeetComponent
        roomName={roomId}
        user={{ username: "Guest" }}  // Replace with actual user info if available
        jwtToken={jwtToken}
        onMeetingEnd={handleMeetingEnd}
      />
    </div>
  );
};

export default MeetingRoom;
