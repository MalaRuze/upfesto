"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ShareButton = () => {
  const pathName = usePathname();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full font-semibold">
          <Share2 size={20} className="mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share the event</DialogTitle>
          <DialogDescription>
            Copy the link below and share it with your friends.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={"upfesto.com" + pathName} readOnly />
          </div>
          <CopyToClipboard text={"upfesto.com" + pathName}>
            <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </CopyToClipboard>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
