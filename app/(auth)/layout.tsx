import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Authentification",
};

const AuthenticationLayout = ({ children }: ChildrenType) => {
  return (
    <div className="justify-center flex flex-col h-screen">
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex justify-center align-middle  ">
        {children}
      </main>
    </div>
  );
};

export default AuthenticationLayout;
