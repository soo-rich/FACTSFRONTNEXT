import { ChildrenType } from '@/types/types';

const GuestOnly = async ({ children }: ChildrenType) => {
  return <>{children}</>;
};

export default GuestOnly;
