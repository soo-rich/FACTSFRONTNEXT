import { Metadata } from "next";

import { ChildrenType } from "@/types/types";

export const metadata: Metadata = {
  title: "Administration",
};
const BackOfficeLayout = ({ children }: ChildrenType) => {
  return <>{children}</>;
};

export default BackOfficeLayout;
