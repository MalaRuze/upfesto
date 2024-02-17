import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Apology from "@/components/Apology";

export const metadata: Metadata = {
  title: "Sing In | Upfesto",
};

const SignInPage = () => {
  return (
    <main className="min-h-screen">
        <Apology />
      {/*<SignIn />*/}
    </main>
  );
};

export default SignInPage;
