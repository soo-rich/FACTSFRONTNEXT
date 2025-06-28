import Link from "next/link";
import Image from "next/image";

import { ChildrenType } from "@/types/types";

const AuthenticateLayout = ({ children }: ChildrenType) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link className="flex items-center gap-2 font-medium" href="/">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image
                alt={"SOOSMART GROUPS"}
                className="size-4"
                height={10}
                sizes={"10"}
                src={"/logo-rbg.png"}
                width={10}
              />
            </div>
            SOOSMART GROUPS
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          fill
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          src="/images/loginpage.jpg"
        />
      </div>
    </div>
  );
};

export default AuthenticateLayout;
