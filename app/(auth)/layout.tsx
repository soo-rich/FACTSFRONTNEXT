import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Authentification",
};

const AuthenticationLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
      </div>
    </>
  );
};

export default AuthenticationLayout;
