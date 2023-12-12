import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-8 px-2">
      <h1 className="text-xl font-semibold ">Event not found :(</h1>
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
