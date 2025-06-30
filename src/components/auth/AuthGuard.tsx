import {ChildrenType} from "@/types/types";

import AuthRedirect from "@/components/auth/AuthRedirect";
//@ts-ignore
import {getServerSession} from "next-auth";

const AuthGuard = async ({ children }: ChildrenType) => {
  const session = await getServerSession();

  return <>{session ? children : <AuthRedirect />}</>;
};

export default AuthGuard;
