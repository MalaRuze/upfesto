import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sing Up | Upfesto",
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
