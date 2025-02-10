"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import JitsiMeetComponent from "./JitsiMeetComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Video, Users, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const VideoMeeting = () => {
  const { user } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [inputRoomName, setInputRoomName] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

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
      
      setJwtToken(response.data.token);
      setRoomName(room);
      showAlert(isJoining ? "Successfully joined the meeting" : "Meeting created successfully");
    } catch (error) {
      showAlert("Failed to retrieve meeting token. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = () => {
    if (!inputRoomName.trim()) {
      showAlert("Please enter a valid room name.", "error");
      return;
    }
    fetchToken(inputRoomName.trim());
  };

  const handleJoinMeeting = () => {
    if (!inputRoomName.trim()) {
      showAlert("Please enter a valid meeting link.", "error");
      return;
    }
    setIsJoining(true);
    fetchToken(inputRoomName.trim());
  };

  const handleMeetingEnd = () => {
    setRoomName("");
    setJwtToken("");
    setInputRoomName("");
    showAlert("Left the meeting");
    navigate(-1);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${inputRoomName}`);
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
            <Alert className={cn(
              "w-96",
              alert.type === "error" ? "border-destructive" : "border-primary"
            )}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {roomName && jwtToken ? (
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
            roomName={roomName}
            user={user}
            jwtToken={jwtToken}
            onMeetingEnd={handleMeetingEnd}
          />
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Vaultbox Meeting — Krazyy</h1>
            <p className="mt-2 text-muted-foreground">
              Secure, high-quality video meetings for teams
            </p>
          </div>

          <Card className="border-2 bg-transparent">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <Label htmlFor="meeting-type">Join</Label>
                  <Switch
                    id="meeting-type"
                    checked={!isJoining}
                    onCheckedChange={() => setIsJoining(!isJoining)}
                  />
                  <Label htmlFor="meeting-type">Create</Label>
                </div>

                <motion.div
                  initial={false}
                  animate={{ x: isJoining ? 0 : 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>
                      {isJoining ? "Meeting Link or ID" : "Room Name"}
                    </Label>
                    <Input
                      placeholder={
                        isJoining
                          ? "Enter meeting link or ID"
                          : "Enter room name"
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
                        {window.location.origin}/join/{inputRoomName}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyMeetingLink}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  {!isJoining && user.role === "admin" && (
                    <Button
                      className="w-full"
                      onClick={handleCreateMeeting}
                      disabled={loading}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      {loading ? "Creating..." : "Create Meeting"}
                    </Button>
                  )}

                  {isJoining && (
                    <Button
                      className="w-full"
                      onClick={handleJoinMeeting}
                      disabled={loading}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {loading ? "Joining..." : "Join Meeting"}
                    </Button>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;
