import LoginForm from "@/views/auth/login-form";
import { getSession } from "next-auth/react";

export default async function LoginPage() {

  const session = (await getSession())

  return (

    <LoginForm session={session} />

  )
}
