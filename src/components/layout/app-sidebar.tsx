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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '../ui/separator';

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

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
            <SidebarMenuButton
              tooltip="Dashboard"
              isActive
              className="group"
            >
              <Gauge className="group-data-[active=true]:text-primary group-data-[active=true]:drop-shadow-[0_0_5px_theme(colors.primary)]" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Cooperative Vaults">
              <Landmark />
              <span>Vaults</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Lending & Credit">
              <CircleDollarSign />
              <span>Lending</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Governance">
              <ShieldCheck />
              <span>Governance</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Yield Strategies">
              <Coins />
              <span>Yield</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarGroup>
          <SidebarGroupLabel>User Account</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                    <User />
                    <span>Profile</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Wallet">
                    <Wallet />
                    <span>My Wallet</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
