import React from "react";
import { useAuth } from "@/context/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const overviewItems = [
    {
      title: "Messages",
      description: "View and manage your messages.",
      coverImage: "/images/messages-cover.jpg", // Replace with your image path
      route: "/messages",
    },
    {
      title: "Settings",
      description: "Configure your account settings.",
      coverImage: "/images/settings-cover.jpg", // Replace with your image path
      route: "/settings",
    },
    {
      title: "Meetings",
      description: "Schedule and join meetings.",
      coverImage: "/images/meetings-cover.jpg", // Replace with your image path
      route: "/meetings",
    },
    {
      title: "Profile",
      description: "Manage your profile information.",
      coverImage: "/images/profile-cover.jpg", // Replace with your image path
      route: "/profile",
    },
    // Add more items as needed
  ];

  return (
    <div className="w-full min-h-screen bg-background p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl">
       
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Email: {user?.email}</p>
            <p className="text-gray-500">Role: {user?.role}</p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewItems.map((item, index) => (
            <Card key={index} className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {item.title}
                  <Button variant="ghost" size="icon" onClick={() => navigate(item.route)}>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-hidden relative">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-lg">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;