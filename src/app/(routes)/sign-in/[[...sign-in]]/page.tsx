import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sing In | Upfesto",
};

const SignInPage = () => {
  return (
    <main className="min-h-[80vh]">
      <SignIn />
    </main>
  );
};

export default SignInPage;
