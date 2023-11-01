import { currentUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "../../../../prisma/client";

const DashboardPage = async () => {
  const user = await currentUser();

  return (
    <main className="flex min-h-screen flex-col px-24 pt-16 gap-8">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="grid grid-cols-3 gap-8">
        <Link href="/new-event">
          <Button
            variant="outline"
            className="h-60 flex flex-col items-center justify-around p-20"
          >
            <AddIcon className="text-4xl text-primary" />
            <p>Create event</p>
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default DashboardPage;
