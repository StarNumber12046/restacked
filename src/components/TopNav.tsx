"use client";
import Link from "next/link";
import { ProfileButton } from "./Account";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";


export function TopNav() {
  return (
    <nav className="flex w-screen justify-between border-b border-b-border bg-background p-4 font-semibold items-center relative text-white">
      <div className="gap-4 flex">
      <Link href="/">Home</Link>
      <Link href="/discover">Discover</Link>
      </div>
      <div className="gap-4 flex">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <ProfileButton />
        </SignedIn>
      </div>
    </nav>
  );
}