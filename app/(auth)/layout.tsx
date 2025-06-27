import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Authentification",
};

const AuthenticationLayout = ({ children }: ChildrenType) => {
  return <main className="bg-gray-100 flex min-h-screen">{children}</main>;
};

export default AuthenticationLayout;
