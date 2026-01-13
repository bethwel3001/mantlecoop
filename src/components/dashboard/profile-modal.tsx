'use client';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/80 backdrop-blur-sm border-border/20">
        <DialogHeader className="items-center text-center">
           <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjgyMzk0NDl8MA&ixlib=rb-4.1.0&q=80&w=200"
                  alt="John Doe"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change picture</span>
              </Button>
            </div>
            <div className="space-y-1">
                <DialogTitle className="font-headline text-2xl">John Doe</DialogTitle>
                <DialogDescription>
                    john.doe@example.com
                </DialogDescription>
            </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4">
                <form className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                        disabled
                    />
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                </form>
            </TabsContent>
            <TabsContent value="password" className="mt-4">
                 <form className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="w-full">Update Password</Button>
                </form>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
