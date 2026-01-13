'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card/80 backdrop-blur-sm border-border/20">
        <DialogHeader className="items-center text-center space-y-2 pt-4">
          <DialogTitle className="sr-only">User Profile</DialogTitle>
          {activeTab === 'profile' && (
            <>
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjgyMzk0NDl8MA&ixlib=rb-4.1.0&q=80&w=200"
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
                >
                  <Camera className="h-3 w-3" />
                  <span className="sr-only">Change picture</span>
                </Button>
              </div>
              <div className="space-y-0.5">
                  <h2 className="font-headline text-xl">John Doe</h2>
                  <DialogDescription>
                      john.doe@example.com
                  </DialogDescription>
              </div>
            </>
          )}
        </DialogHeader>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@example.com"
                    disabled
                    className="h-9 text-sm"
                  />
                </div>
                <Button type="submit" className="w-full h-9">Save Changes</Button>
            </TabsContent>
            <TabsContent value="password" className="mt-4 space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="h-9 text-sm" />
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="h-9 text-sm" />
                 </div>
                 <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="h-9 text-sm" />
                 </div>
                <Button className="w-full h-9">Update Password</Button>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
