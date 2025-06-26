import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Authentification",
};

const AuthenticationLayout = ({ children }: ChildrenType) => {
  return (
    <div className="relative flex flex-col h-screen">
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default AuthenticationLayout;
