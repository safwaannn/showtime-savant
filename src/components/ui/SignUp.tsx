import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../Header"; // ✅ import Header

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up with:", name, email, password);
    // TODO: integrate with backend signup API
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ✅ Header */}
      <Header />

      {/* Centered card */}
      <div className="flex flex-1 justify-center items-center">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                Sign Up
              </Button>
            </form>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign In
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
