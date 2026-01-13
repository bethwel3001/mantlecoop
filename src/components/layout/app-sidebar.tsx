'use client';

import Image from 'next/image';
import {
  ChevronsRight,
  CircleDollarSign,
  Coins,
  Gauge,
  Landmark,
  ShieldCheck,
  User,
  Wallet,
  LogOut,
  History,
  Building
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ChevronsRight className="text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold tracking-wider">MantleCoop</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard" isActive className="group">
              <Gauge className="group-data-[active=true]:text-primary group-data-[active=true]:drop-shadow-[0_0_5px_theme(colors.primary)]" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Yield">
              <Coins />
              <span>Yield</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Lending History">
              <History />
              <span>Lending History</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Payment History">
              <History />
              <span>Payment History</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Saccos/Cooperatives">
              <Building />
              <span>Cooperatives</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="My Wallet">
              <Wallet />
              <span>My Wallet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarGroup>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                    <User />
                    <span>Profile</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
