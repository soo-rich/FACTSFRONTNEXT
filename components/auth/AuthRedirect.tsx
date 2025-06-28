'use client';

import { redirect, usePathname } from 'next/navigation';

const AuthRedirect = async () => {
  const pathname = usePathname();
  const login = 'login';
  const home = 'home';
  const redirectpath = `/login?redirectTo=${pathname}`;
  return redirect(pathname === login ? login : pathname === home ? login : redirectpath);
};

export default AuthRedirect;
