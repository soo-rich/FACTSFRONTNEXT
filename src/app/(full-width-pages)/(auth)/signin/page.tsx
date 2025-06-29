import SignInForm from "@/views/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | SOOSMART GROUP",
  description: "Page de connexion",
};

export default function SignIn() {
  return <SignInForm />;
}
