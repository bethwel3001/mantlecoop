'use client';

import {
  Coins,
  Gauge,
  LogOut,
  History,
  Building,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 26V6L16 16L6 26Z" fill="currentColor" className="text-primary"/>
    <path d="M16 16L26 6V26L16 16Z" fill="currentColor" className="text-sidebar-foreground/50"/>
  </svg>
);

export const menuItems = [
    { href: '/dashboard', icon: Gauge, label: 'Dashboard' },
    { href: '/dashboard/yield', icon: Coins, label: 'Yield' },
    { href: '/dashboard/lending-history', icon: History, label: 'Lending History' },
    { href: '/dashboard/payment-history', icon: History, label: 'Payment History' },
    { href: '/dashboard/cooperatives', icon: Building, label: 'Cooperatives' },
    { href: '/dashboard/wallet', icon: Wallet, label: 'My Wallet' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Logo />
          </div>
          <h1 className="text-lg font-semibold tracking-wider font-headline">MantleCoop</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton tooltip={item.label} isActive={pathname === item.href} className="group" onClick={() => setOpenMobile(false)}>
                  <item.icon className="group-data-[active=true]:text-primary group-data-[active=true]:drop-shadow-[0_0_5px_theme(colors.primary)]" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/login" passHref>
                    <SidebarMenuButton tooltip="Logout" onClick={() => setOpenMobile(false)}>
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
