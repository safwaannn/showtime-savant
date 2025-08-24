import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../Header";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", email, password);
    // 🔗 TODO: integrate with backend login API
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ✅ Header stays fixed on top */}
      <Header />

      {/* ✅ Centered Auth Card */}
      <div className="flex flex-1 justify-center items-center px-4">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Sign In
              </Button>
            </form>
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Sign Up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
