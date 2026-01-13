'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
  </svg>
);

const BinanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.623 7.377L12 12l-4.623-4.623L12 2.754l4.623 4.623zM12 12l-4.623 4.623L12 21.246l4.623-4.623L12 12zM7.377 12l-4.623-4.623L7.377 2.754 12 7.377 7.377 12zM16.623 12l4.623 4.623L16.623 21.246 12 16.623l4.623-4.623zM12 12l2.311-2.311L12 7.377 9.689 9.689 12 12zm0 0l-2.311 2.311L12 16.623l2.311-2.311L12 12z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.602.75Zm-.81 12.95h1.28L3.54 2.15H2.25l8.55 11.55Z"/>
  </svg>
);

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.primary/15%),transparent)] -z-10"></div>
      
      <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border-border/20">
        <AnimatePresence mode="wait">
          {isSignUp ? (
            <motion.div key="signup" initial="hidden" animate="visible" exit="exit" variants={cardVariants}>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Enter your information to get started.</CardDescription>
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
                <Button type="submit" className="w-full glow-primary-hover">Sign Up</Button>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full"><GoogleIcon />Sign up with Google</Button>
                  <Button variant="outline" className="w-full"><BinanceIcon />Sign up with Binance</Button>
                  <Button variant="outline" className="w-full"><XIcon />Sign up with X</Button>
                </div>
                <div className="text-center text-sm mt-4">
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline font-semibold">
                    Log In
                  </button>
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <motion.div key="login" initial="hidden" animate="visible" exit="exit" variants={cardVariants}>
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
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
                <Button type="submit" className="w-full glow-primary-hover">Login</Button>
                <Link href="/dashboard" className="w-full">
                  <Button variant="secondary" className="w-full">Login as Demo</Button>
                </Link>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full"><GoogleIcon />Login with Google</Button>
                  <Button variant="outline" className="w-full"><BinanceIcon />Login with Binance</Button>
                  <Button variant="outline" className="w-full"><XIcon />Login with X</Button>
                </div>
                <div className="text-center text-sm mt-4">
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline font-semibold">
                    Sign Up
                  </button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
