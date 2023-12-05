"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

const NotFound = () => {
  return (
    <div className="w-full h-[80vh] px-2 flex flex-col items-center justify-center gap-8">
      <h1 className="text-xl font-semibold ">Page not found :(</h1>
      <img
        src="https://i.kym-cdn.com/photos/images/original/001/042/619/4ea.jpg"
        className="max-v-screen mx-auto rounded-xl"
        alt="404"
      />
      <Link href="/">
        <Button>Back to main page</Button>
      </Link>
    </div>
  );
};

export default NotFound;
