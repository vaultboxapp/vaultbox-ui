import { useAuth } from "@/context/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, Users, Calendar, BarChart, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const overviewItems = [
    {
      title: "Messages",
      description: "View and manage your messages",
      icon: MessageCircle,
      route: "/messages",
      stat: "15 unread",
    },
    {
      title: "Meetings",
      description: "Schedule and join meetings",
      icon: Calendar,
      route: "/video",
      stat: "2 upcoming",
    },
    {
      title: "Team",
      description: "Manage your team members",
      icon: Users,
      route: "/team",
      stat: "8 members",
    },
    {
      title: "Analytics",
      description: "View your performance metrics",
      icon: BarChart,
      route: "/analytics",
      stat: "7% increase",
    },
  ]

  return (
    <div className="w-full min-h-screen bg-background p-4 lg:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-xl text-gray-500">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewItems.map((item, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.stat}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <Button variant="ghost" className="w-full mt-4 justify-between" onClick={() => navigate(item.route)}>
                  View details
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          {/* Add a component here to show recent activities or a timeline */}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate("/video")}>Start a Meeting</Button>
                <Button variant="outline" onClick={() => navigate("/messages")}>
                  Send a Message
                </Button>
                <Button variant="outline" onClick={() => navigate("/settings")}>
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add a component here to show user stats or a chart */}
              <p>Placeholder for user statistics or chart</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

