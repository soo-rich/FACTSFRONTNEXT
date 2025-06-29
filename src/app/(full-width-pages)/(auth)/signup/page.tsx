import SignUpForm from "@/views/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page ",
  description: "SOOSMART GROUP",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
