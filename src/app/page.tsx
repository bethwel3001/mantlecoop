import { ArrowRight, Briefcase, HandCoins, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 26V6L16 16L6 26Z" fill="currentColor" className="text-primary"/>
    <path d="M16 16L26 6V26L16 16Z" fill="currentColor" className="text-foreground/50"/>
  </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo />
          <span className="font-semibold text-lg">MantleCoop</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#partners" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Partners
          </Link>
          <Link href="#explore" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Explore
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-transparent z-0"></div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.primary/15%),transparent)] -z-10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Decentralized Finance for Cooperatives
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Unlock the power of blockchain for your cooperative. Manage funds, distribute yield, and empower your
                members with our secure and transparent platform.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 glow-primary-hover"
                prefetch={false}
              >
                Join Now
              </Link>
              <Link
                href="#about"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Us</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Revolutionizing Cooperative Finance</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    MantleCoop is a decentralized platform that empowers cooperatives to manage their finances with
                    unprecedented transparency, security, and efficiency. We leverage the power of blockchain technology
                    to streamline operations, automate yield distribution, and give members true ownership.
                  </p>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/1/600/400"
                data-ai-hint="futuristic finance"
                width="550"
                height="310"
                alt="About"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="partners" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Partners</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Industry Leaders</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We partner with leading organizations in the blockchain and cooperative sectors to deliver a robust and
                  reliable platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <div className="flex justify-center">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex justify-center">
                <HandCoins className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex justify-center">
                <Zap className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex justify-center">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex justify-center">
                <HandCoins className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex justify-center">
                <Zap className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>
        <section id="explore" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Explore the Future of Finance</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover how MantleCoop can transform your cooperative. Dive into our features and see the power of
                decentralized finance.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full glow-primary-hover"
                prefetch={false}
              >
                Explore
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 MantleCoop. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
