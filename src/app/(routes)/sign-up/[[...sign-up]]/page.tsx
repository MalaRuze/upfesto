import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Apology from "@/components/Apology";

export const metadata: Metadata = {
  title: "Sing Up | Upfesto",
};

const SignUpPage = () => {
  return (
    <main className="min-h-screen">
        <Apology />
      {/*<SignUp />*/}
    </main>
  );
};

export default SignUpPage;
