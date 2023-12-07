"use client";
import { Event } from "@prisma/client";
import { google, ics, outlook, yahoo } from "calendar-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type CalendarButtonProps = {
  event: Event;
};

const CalendarButton = ({ event }: CalendarButtonProps) => {
  const pathName = usePathname();
  const eventCaledarData = {
    title: event.title,
    description: event.description
      ? `${event.description} \n\n For full details and event attendance, visit upfesto.com${pathName}`
      : `Checkout event details at upfesto.com${pathName}`,
    location: event.locationAddress || undefined,
    start: event.dateFrom,
    end: event.dateTo,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full font-semibold">
          <CalendarPlus size={20} className="mr-2 flex-shrink-0 " />
          <span className="truncate">Add to calendar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem>
          <a
            href={google(eventCaledarData)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
              alt="google calendar logo"
              className="w-4 h-4"
            />
            Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={outlook(eventCaledarData)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
              alt="outlook logo"
              className="w-4 h-4"
            />
            Outlook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={yahoo(eventCaledarData)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <img
              src="https://www.logo-designer.co/storage/2019/09/2019-pentagram-yahoo-logo-design-3.png"
              alt="yahoo logo"
              className="w-4 h-4"
            />
            Yahoo
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            href={ics(eventCaledarData)}
            target="_blank"
            rel="noreferrer"
            download
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download .ics file
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CalendarButton;
