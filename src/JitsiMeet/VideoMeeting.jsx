"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const VideoMeeting = () => {
  const { user } = useAuth();
  const [inputRoomName, setInputRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  // For admins: toggle between join mode and create mode.
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  // For admins: Fetch a Jitsi token using the meeting ID.
  const fetchToken = async (room) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/jitsi-token",
        { room },
        { withCredentials: true }
      );
      if (!response.data.token) {
        throw new Error("Token not received");
      }
      // Navigate to the meeting room with the token in state.
      navigate(`/video/${room}`, { state: { token: response.data.token } });
      showAlert("Joined meeting successfully");
    } catch (error) {
      showAlert("Failed to retrieve meeting token. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a meeting for admins.
  // (This version uses the jitsi-token endpoint for both join and create.)
  const handleCreateMeeting = async () => {
    if (!inputRoomName.trim()) {
      showAlert("Please enter a valid room name.", "error");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/jitsi-token",
        { room: inputRoomName.trim() },
        { withCredentials: true }
      );
      if (!response.data.token) {
        throw new Error("Token not received");
      }
      navigate(`/video/${inputRoomName.trim()}`, { state: { token: response.data.token } });
      showAlert("Meeting created successfully");
    } catch (error) {
      showAlert("Error creating meeting", "error");
    }
  };

  // Handle joining an existing meeting.
  const handleJoinMeeting = () => {
    if (!inputRoomName.trim()) {
      showAlert("Please enter a valid meeting link or ID.", "error");
      return;
    }
    if (user.role !== "admin") {
      // Normal users join directly without a token.
      navigate(`/video/${inputRoomName.trim()}`, { state: { token: "" } });
      showAlert("Joined meeting successfully");
    } else {
      // For admins: if in create mode, create meeting; otherwise, join.
      if (isCreateMode) {
        handleCreateMeeting();
      } else {
        fetchToken(inputRoomName.trim());
      }
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${inputRoomName}`);
    showAlert("Meeting link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/10 to-background flex flex-col items-center justify-start pt-12 p-4">
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <Alert
              className={cn(
                "w-96",
                alert.type === "error" ? "border-destructive" : "border-primary"
              )}
            >
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Vaultbox Meeting</h1>
          <p className="mt-2 text-muted-foreground">
            Secure, high-quality video meetings for teams
          </p>
        </div>

        <Card className="border-2 bg-transparent">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* For admins, show toggle to switch between Join and Create */}
              {user.role === "admin" && (
                <div className="flex items-center justify-center space-x-2">
                  <Label htmlFor="meeting-mode">Join</Label>
                  <Switch
                    id="meeting-mode"
                    checked={isCreateMode}
                    onCheckedChange={() => setIsCreateMode(!isCreateMode)}
                  />
                  <Label htmlFor="meeting-mode">Create</Label>
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  {user.role === "admin"
                    ? isCreateMode
                      ? "Room Name" // In create mode, admin enters a custom room name.
                      : "Meeting Link or ID" // In join mode, admin enters a link/ID.
                    : "Meeting Link or ID"}
                </Label>
                <Input
                  placeholder={
                    user.role === "admin"
                      ? isCreateMode
                        ? "Enter room name"
                        : "Enter meeting link or ID"
                      : "Enter meeting link or ID"
                  }
                  value={inputRoomName}
                  onChange={(e) => setInputRoomName(e.target.value)}
                />
              </div>

              {inputRoomName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="truncate">
                    {window.location.origin}/video/{inputRoomName}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyMeetingLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              <Button className="w-full" onClick={handleJoinMeeting} disabled={loading}>
                {loading
                  ? "Processing..."
                  : user.role === "admin"
                  ? isCreateMode
                    ? "Create Meeting"
                    : "Join Meeting"
                  : "Join Meeting"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoMeeting;
