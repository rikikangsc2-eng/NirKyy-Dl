import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <nav className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = "/api/logout"}
        >
          Sign Out
        </Button>
      </nav>

      <div className="max-w-4xl mx-auto grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              Welcome back, {user?.firstName || user?.email || 'User'}!
            </CardTitle>
            <CardDescription>
              You are successfully signed in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || user?.lastName || 'Not provided'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
            <CardDescription>
              This content is only visible to authenticated users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This is a protected area of the application. Only users who have successfully
              signed in can view this content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}