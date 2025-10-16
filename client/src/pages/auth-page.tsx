import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Target, Users, CheckSquare, PenLine } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "" });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData, {
      onSuccess: () => setLocation("/")
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData, {
      onSuccess: () => setLocation("/")
    });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Column - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-light tracking-tight mb-2">Welcome to Opus</h1>
            <p className="text-muted-foreground">Your personal productivity command center</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        data-testid="input-login-username"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        data-testid="input-login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Get started with Opus today</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        data-testid="input-register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        required
                        autoComplete="username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        data-testid="input-register-password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden md:flex items-center justify-center bg-primary p-12">
        <div className="max-w-lg text-primary-foreground">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            Manage Your Professional Life with Clarity
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Opus helps young professionals stay organized, build meaningful connections, 
            and achieve their goals with powerful tools for task management, goal tracking, 
            and weekly reflection.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Goal Tracking</h3>
                <p className="text-sm text-primary-foreground/80">Monitor progress on your ambitions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Task Management</h3>
                <p className="text-sm text-primary-foreground/80">Stay on top of your to-dos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Connections</h3>
                <p className="text-sm text-primary-foreground/80">Nurture professional relationships</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <PenLine className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Weekly Reviews</h3>
                <p className="text-sm text-primary-foreground/80">Reflect and plan ahead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
