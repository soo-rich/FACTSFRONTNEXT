import { ChildrenType } from '@/types/types';
import { getServerSession } from 'next-auth';
import AuthRedirect from '@/components/auth/AuthRedirect';

const AuthGuard = async ({ children }: ChildrenType) => {
  const session = await getServerSession();

  return <>{session ? children : <AuthRedirect />}</>;
};

export default AuthGuard;
