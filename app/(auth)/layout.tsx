import {ChildrenType} from "@/types/types";
import Link from "next/link";
import Image from "next/image";

const AuthenticateLayout = ({children}: ChildrenType) => {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div
                            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <Image src={'/logo-rbg.png'} alt={'SOOSMART GROUPS'} width={10} height={10} sizes={'10'}
                                   className="size-4"/>
                        </div>
                        SOOSMART GROUPS
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/images/loginpage.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    fill
                />
            </div>
        </div>
    )
}


export default AuthenticateLayout