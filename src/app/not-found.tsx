"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <img
        src="https://cdn.primedia.co.za/primedia-broadcasting/image/upload/c_fill,h_436,w_700/eadtrndgt7hxkvyfugsd"
        alt="not found ilustration"
      />
      nothing here:(
      <Button>
        <Link href="/">take me back home</Link>
      </Button>
    </main>
  );
};

export default NotFound;
