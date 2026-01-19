'use client';
import { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Wallet, Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileModal } from '../dashboard/profile-modal';
import { usePathname } from 'next/navigation';
import { menuItems } from './app-sidebar';

export function Header() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const pathname = usePathname();
  
  const currentPage = menuItems.find(item => item.href === pathname);
  const pageTitle = currentPage ? currentPage.label : 'Dashboard';

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold hidden md:block">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_0_10px_theme(colors.primary/50%)] hover:shadow-[0_0_20px_theme(colors.primary/50%)] transition-shadow">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjgyMzk0NDl8MA&ixlib=rb-4.1.0&q=80&w=200"
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-semibold text-sm">John Doe</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </header>
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </>
  );
}
