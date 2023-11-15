"use client";

import Link from "next/link";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const NavBar = () => {
  /* mobile menu state */
  const [isOpen, setIsOpen] = React.useState(false);

  /* clerk hooks */
  const { user } = useUser();
  const { signOut } = useClerk();

  /* next router */
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
      className="bg-white w-full border-b"
    >
      <div className="items-center px-4 max-w-screen-xl mx-auto flex justify-between h-16">
        {/*left section*/}
        <CollapsibleTrigger asChild>
          {/*mobile menu trigger*/}
          <Button variant="ghost" size="sm" className="w-9 p-0 sm:hidden">
            {isOpen ? (
              <CloseIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <div className="flex items-center mr-auto pl-4 sm:pl-0 gap-10 ">
          {/*logo*/}
          <Link href="/">
            <img
              src="/logo_white.png"
              alt="logo"
              className="h-7 hidden sm:block"
            />
            <img src="/logo_icon.png" alt="logo" className="h-7 sm:hidden" />
          </Link>
          {/*desktop menu items*/}
          <div className="hidden sm:flex gap-5">
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
                  <Link href="/profile-settings">
                    <PersonOutlineIcon className="mr-2 !h-4 !w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                {/* logout */}
                <DropdownMenuItem
                  onClick={() => signOut(() => router.push("/"))}
                >
                  <LogoutIcon className="mr-2 !h-4 !w-4" />
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
            <p className="text-sm font-medium transition-colors hover:text-primary py-3">
              {item.title}
            </p>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NavBar;
