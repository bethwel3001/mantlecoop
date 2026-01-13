'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-headline font-semibold">Dashboard</h1>
      </div>
      <Button className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_0_10px_theme(colors.primary/50%)] hover:shadow-[0_0_20px_theme(colors.primary/50%)] transition-shadow">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    </header>
  );
}
