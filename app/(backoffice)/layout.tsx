import { Metadata } from "next";

import { ChildrenType } from "@/types/types";
import AuthGuard from "@/components/nextauth/AuthGuard";
import { Navbar } from "@/components/shared/front/navbar";

export const metadata: Metadata = {
  title: "Administration",
};
const BackOfficeLayout = ({ children }: ChildrenType) => {
  return (
    <AuthGuard>
      <div className="relative flex flex-col h-screen">
        <Navbar />
        {children}
      </div>
    </AuthGuard>
  );
};

export default BackOfficeLayout;
