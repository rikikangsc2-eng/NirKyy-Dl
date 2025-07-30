import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">
            Welcome
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Please sign in to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Sign in with your account to get started
            </p>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "/api/login"}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}