"use client";

import { redirect, usePathname } from "next/navigation";

const AuthRedirect = () => {
  const pathname = usePathname();
  const login = "login";
  const home = "dashboard";
  const redirectpath = `/login?redirectTo=${pathname}`;

  return redirect(
    pathname === login ? login : pathname === home ? login : redirectpath,
  );
};

export default AuthRedirect;
