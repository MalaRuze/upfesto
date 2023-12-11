import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Upfesto",
  description:
    "Upfesto started as a business idea, but it failed. However, I used the idea to create a tool for my own events and as a portfolio project.",
};

const DashboardPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
};

export default DashboardPage;
