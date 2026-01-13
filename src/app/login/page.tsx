'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Chrome, Briefcase, Bot } from 'lucide-react'; // Using existing icons as placeholders

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="m@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Chrome className="mr-2 h-4 w-4" />
                    Login with Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                     Login with Binance
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                     Login with X
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs justify-center">
                <Link href="/">Back to homepage</Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" type="text" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" />
                </div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                 <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign up with Google
                  </Button>
                   <Button variant="outline" className="w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                     Sign up with Binance
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                     Sign up with X
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs justify-center">
                 <Link href="/">Back to homepage</Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
