"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  /* menu items */
  const menus = [
    { title: "About", path: "/about" },
    { title: "Github", path: "https://github.com/MalaRuze/upfesto" },
  ];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border-b bg-white"
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        {/*left section*/}
        <CollapsibleTrigger asChild>
          {/*mobile menu trigger*/}
          <Button variant="ghost" size="sm" className="w-9 p-0 sm:hidden">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <div className="mr-auto flex items-center gap-10 pl-4 sm:pl-0 ">
          {/*logo*/}
          <Link href="/">
            <img
              src="/logo_white.png"
              alt="logo"
              className="hidden h-7 sm:block"
            />
            <img src="/logo_icon.png" alt="logo" className="h-7 sm:hidden" />
          </Link>
          {/*desktop menu items*/}
          <div className="hidden gap-5 sm:flex">
            {menus.map((item, idx) => (
              <Link href={item.path} key={idx}>
                <p className="text-sm font-medium transition-colors hover:text-primary">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
        {/*right section*/}
        <SignedIn>
          <div className="flex items-center gap-5">
            {/* dashboard button */}
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
            {/* user profile menu */}
            <DropdownMenu>
              {/* avatar */}
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user?.imageUrl} alt="avatar" />
                </Avatar>
              </DropdownMenuTrigger>
              {/* dropdown menu content */}
              <DropdownMenuContent align="end" className="px-2">
                {/* profile credentials */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* profile settings */}
                <DropdownMenuItem>
                  <Link
                    href="/profile-settings"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                {/* logout */}
                <DropdownMenuItem
                  onClick={() => signOut(() => router.push("/"))}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SignedIn>
        {/* sign in button */}
        <SignedOut>
          <Link href="/dashboard">
            <Button size="sm">Sing In</Button>
          </Link>
        </SignedOut>
      </div>
      {/*mobile menu items*/}
      <CollapsibleContent className="pl-6 sm:hidden">
        {menus.map((item, idx) => (
          <Link href={item.path} key={idx}>
            <p className="py-3 text-sm font-medium transition-colors hover:text-primary">
              {item.title}
            </p>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NavBar;
