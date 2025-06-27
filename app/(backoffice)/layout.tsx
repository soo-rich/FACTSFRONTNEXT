import { Metadata } from "next";

import { ChildrenType } from "@/types/types";
import AuthGuard from "@/components/nextauth/AuthGuard";

export const metadata: Metadata = {
  title: "Administration",
};
const BackOfficeLayout = ({ children }: ChildrenType) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default BackOfficeLayout;
