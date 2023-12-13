import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sing Up | Upfesto",
};

const SignUpPage = () => {
  return (
    <main className="min-h-[80vh]">
      <SignUp />
    </main>
  );
};

export default SignUpPage;
