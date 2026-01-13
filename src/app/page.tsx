import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 26V6L16 16L6 26Z" fill="currentColor" className="text-primary"/>
    <path d="M16 16L26 6V26L16 16Z" fill="currentColor" className="text-foreground/50"/>
  </svg>
);

const MetamaskIcon = () => (
    <svg width="48" height="48" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.25 153.37L101 104.62L69.25 76.87L43.25 153.37Z" fill="#E2761B"/>
        <path d="M101.001 104.62L69.251 76.87L111.501 51.37L101.001 104.62Z" fill="#E4761B"/>
        <path d="M101.001 104.62L111.501 51.37L133.501 32.37L144.501 59.87L101.001 104.62Z" fill="#E4761B"/>
        <path d="M101.001 104.62L144.501 59.87L154.001 104.62L101.001 104.62Z" fill="#D7C1B3"/>
        <path d="M43.25 153.37L101 104.62L85.75 125.12L68.5 154.12L43.25 153.37Z" fill="#233447"/>
        <path d="M85.75 125.12L101 104.62L154 104.62L170.25 125.12L85.75 125.12Z" fill="#763E1A"/>
        <path d="M85.75 125.12L170.25 125.12L181.75 163.62L161.75 181.37L85.75 125.12Z" fill="#F6851B"/>
        <path d="M181.75 163.62L161.75 181.37L138.5 223.12L194 180.62L181.75 163.62Z" fill="#F6851B"/>
        <path d="M187.25 76.87L154 104.62L170.25 125.12L212.75 153.37L187.25 76.87Z" fill="#F6851B"/>
        <path d="M144.5 59.87L154 104.62L187.25 76.87L144.5 59.87Z" fill="#C0AD9E"/>
        <path d="M133.5 32.37L144.5 59.87L187.25 76.87L133.5 32.37Z" fill="#E4761B"/>
    </svg>
);

const BaseIcon = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#0052FF"/>
        <path d="M26.5625 63.8125V36.6875H48.1875C53.0312 36.6875 57 37.8125 60.0625 40.0625C63.125 42.3125 64.6562 45.4062 64.6562 49.3438C64.6562 53.2812 63.125 56.375 60.0625 58.625C57 60.875 53.0312 62 48.1875 62H29.6875V63.8125H26.5625ZM38.4375 54.3125H47.125C49.5938 54.3125 51.5312 53.7812 52.9375 52.7188C54.3438 51.6562 55.0469 50.1562 55.0469 48.2188C55.0469 46.2812 54.3438 44.7812 52.9375 43.7188C51.5312 42.6562 49.5938 42.125 47.125 42.125H38.4375V54.3125Z" fill="white"/>
    </svg>
);

const EthereumIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.69L5.22 12L12 15.69L18.78 12L12 2.69Z" fill="#627EEA"/>
        <path d="M12 16.69L5.22 13L12 21.31L18.78 13L12 16.69Z" fill="#627EEA"/>
        <path d="M12 15.69L18.78 12L12 2.69V15.69Z" fill="#4664C5"/>
        <path d="M12 16.69L12 21.31L18.78 13L12 16.69Z" fill="#4664C5"/>
        <path d="M12 15.69L5.22 12L12 16.69V15.69Z" fill="#899DF0"/>
    </svg>
);

const partners = [
  {
    name: 'Metamask',
    logo: <MetamaskIcon />,
    description: 'The leading self-custodial wallet, providing a secure gateway to the decentralized web.'
  },
  {
    name: 'Base',
    logo: <BaseIcon />,
    description: 'An Ethereum L2, incubated by Coinbase, offering a low-cost and developer-friendly environment.'
  },
  {
    name: 'Ethereum',
    logo: <EthereumIcon />,
    description: 'The world’s programmable blockchain, pioneering smart contracts and dApps.'
  },
];

const AppStoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.665 13.425C18.636 15.225 17.485 16.6 15.845 16.6C14.195 16.6 13.015 15.225 13.045 13.425C13.015 11.625 14.195 10.275 15.835 10.275C17.485 10.275 18.636 11.625 18.665 13.425ZM11.125 13.425C11.155 17.525 14.395 20.25 15.835 20.25C17.275 20.25 20.515 17.525 20.485 13.425C20.515 9.325 17.275 6.6 15.835 6.6C14.395 6.6 11.155 9.325 11.125 13.425ZM10.235 5.5875C11.1461 4.75232 12.1812 4.09549 13.3 3.675C12.355 4.515 11.625 5.565 11.165 6.75C10.705 7.935 10.525 9.195 10.615 10.455C9.28549 10.1506 8.04631 9.47951 7.025 8.505C7.025 8.505 5.095 7.005 3.935 9.15C2.775 11.295 4.585 13.425 5.715 14.655C6.845 15.885 7.825 18 9.635 18C11.445 18 12.035 16.89 13.255 16.89C14.475 16.89 15.035 18 16.845 18C18.655 18 19.635 15.885 20.765 14.655C21.365 14.025 21.655 13.245 21.695 12.555C20.665 12.285 18.915 11.415 18.885 9.12C18.885 7.32 20.065 6.135 20.245 5.835C18.435 3.93 16.145 3.735 15.235 3.735C13.425 3.735 11.775 4.755 10.235 5.5875Z"/>
    </svg>
);

const PlayStoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.39999 1.07996L17.88 11.64C18.42 11.97 18.42 12.75 17.88 13.08L2.39999 23.64C1.85999 23.97 1.19999 23.64 1.19999 22.98V1.73996C1.19999 1.07996 1.85999 0.749956 2.39999 1.07996Z" fill="#00A0FF"/>
        <path d="M17.88 11.64L21.72 9.35996C22.26 9.02996 22.26 8.24996 21.72 7.91996L18.84 6.02996L2.39999 1.07996L17.88 11.64Z" fill="#00D66B"/>
        <path d="M2.4 23.64L18.84 18.69L21.72 16.8C22.26 16.47 22.26 15.69 21.72 15.36L17.88 13.08L2.4 23.64Z" fill="#FFC900"/>
        <path d="M18.84 18.69L2.4 23.64V1.07996L18.84 6.02996V18.69Z" fillOpacity="0.08"/>
        <path d="M18.84 18.69V6.02996L2.39999 1.07996V23.64L18.84 18.69Z" fillOpacity="0.08"/>
    </svg>
);

const DiscordIcon = () => (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.222 0H3.778A2.222 2.222 0 0 0 1.556 2.222v15.556a2.222 2.222 0 0 0 2.222 2.222h11.11L22.444 24V2.222A2.222 2.222 0 0 0 20.222 0ZM8.444 13.889a2.222 2.222 0 1 1-2.222-2.223 2.222 2.222 0 0 1 2.222 2.223Zm4.445 0a2.222 2.222 0 1 1-2.223-2.223 2.222 2.222 0 0 1 2.223 2.223Zm4.444 0a2.222 2.222 0 1 1-2.222-2.223 2.222 2.222 0 0 1 2.222 2.223Z"/>
    </svg>
);

const XIcon = () => (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25ZM16.91 19.95h2.035L7.844 4.05H5.66l11.25 15.9Z"/>
    </svg>
);

const TelegramIcon = () => (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.031 1.945c-1.07-.42-2.235-.43-3.32.08L3.102 8.448c-1.57.72-1.638 2.89-.108 3.704l4.842 2.55 2.55 4.842c.813 1.53 2.983 1.463 3.704-.108l6.423-15.61c.51-1.238.11-2.648-.483-3.321ZM7.568 12.398l10.23-7.71-6.898 6.898-3.332.812Zm5.53 5.53l.812-3.332 6.898-6.898-7.71 10.23Z"/>
    </svg>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo />
          <span className="font-semibold text-lg">MantleCoop</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#partners" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Partners
          </Link>
          <Link href="#explore" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Explore
          </Link>
          <ModeToggle />
        </nav>
        <div className="ml-auto md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="grid gap-4 p-4">
                        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
                            <Logo />
                            <span className="font-semibold text-lg">MantleCoop</span>
                        </Link>
                        <nav className="grid gap-2 text-center">
                            <Link href="#about" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
                                About
                            </Link>
                            <Link href="#partners" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
                                Partners
                            </Link>
                            <Link href="#explore" className="text-lg font-medium hover:underline underline-offset-4" prefetch={false}>
                                Explore
                            </Link>
                        </nav>
                         <ModeToggle />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
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
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-3">
              {partners.map((partner) => (
                <Card key={partner.name} className="flex flex-col items-center text-center p-6 bg-card/50">
                  <CardContent className="flex flex-col items-center gap-4">
                    {partner.logo}
                    <h3 className="text-xl font-bold">{partner.name}</h3>
                    <p className="text-muted-foreground text-sm">{partner.description}</p>
                  </CardContent>
                </Card>
              ))}
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
      <footer className="w-full bg-secondary text-secondary-foreground border-t">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 px-4 py-12 md:px-6">
          <div className="space-y-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <Logo />
              <span className="font-semibold text-lg">MantleCoop</span>
            </Link>
            <p className="text-sm text-muted-foreground">On-Chain Cooperative Finance for the Real World.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Community</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="flex items-center gap-2 text-sm hover:underline" prefetch={false}>
                <DiscordIcon /> Discord
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm hover:underline" prefetch={false}>
                <XIcon /> X (Twitter)
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm hover:underline" prefetch={false}>
                <TelegramIcon /> Telegram
              </Link>
            </nav>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Resources</h4>
            <nav className="flex flex-col gap-1">
              <Link href="#" className="text-sm hover:underline" prefetch={false}>Documentation</Link>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>Blog</Link>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>Support</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Mobile App Coming Soon</h4>
            <p className="text-sm text-muted-foreground">Get notified when our mobile app is available.</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <AppStoreIcon />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold -mt-1">App Store</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <PlayStoreIcon />
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold -mt-1">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="container flex flex-col sm:flex-row justify-between items-center py-4 px-4 md:px-6 text-xs text-muted-foreground">
            <p>&copy; 2024 MantleCoop. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
              <Link href="#" className="hover:underline" prefetch={false}>Terms of Service</Link>
              <Link href="#" className="hover:underline" prefetch={false}>Privacy Policy</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
