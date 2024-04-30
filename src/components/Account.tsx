"use client";
import { User, Plus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { SignIn, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";



function ProfileDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clerk = useClerk();
  if (!useAuth().isSignedIn) return;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/new")}>
            <Plus />
            <span className="ml-2">New Stack</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User />
            <span className="ml-2">My Stacks</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => clerk.openUserProfile()}>
            <User />
            <span className="ml-2">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => clerk.signOut()}>
            <LogOut />
            <span className="ml-2">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProfileButton() {
  const { user } = useClerk();
  const auth = useAuth();
  if (auth.isSignedIn) {
    return (
      <ProfileDialog>
        <Avatar
          onClick={() => {
            console.log("e");
          }}
          className="cursor-pointer"
        >
          <AvatarImage src={user?.imageUrl} alt="@shadcn" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      </ProfileDialog>
    );
  }
  return <SignIn />;
}
