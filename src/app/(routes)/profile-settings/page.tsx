import { UserProfile } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | Upfesto",
};

const ProfileSettingsPage = () => {
  return (
    <main>
      <UserProfile />
    </main>
  );
};

export default ProfileSettingsPage;
