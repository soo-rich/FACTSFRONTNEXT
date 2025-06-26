import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Authentification",
};

const AuthenticationLayout = ({ children }: ChildrenType) => {
  return <>{children}</>;
};

export default AuthenticationLayout;
