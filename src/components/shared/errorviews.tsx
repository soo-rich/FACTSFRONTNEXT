"use client";

import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

type Props = {
    title?: string;
    subtitle?: string;
    illustration?: boolean;
    backButton?: boolean;
    buttonText?: string;
    link?: string;
};

const ErrorView = ({
                       title,
                       subtitle,
                       illustration = false,
                       backButton = false,
                       buttonText,
                       link,
                   }: Props) => {
    const router = useRouter();
    const hasHistory = useRef(false);
    const [localizedLink, setLocalizedLink] = useState(link);

    const handleClickBack = () => {
        return hasHistory.current ? router.back : router.push("/");
    };

    useEffect(() => {
        hasHistory.current = window.history.length > 1;
    }, []);
    
    useEffect(() => {
        if (link) {
            setLocalizedLink(link);
        }
    }, [link]);

    return (
        <div className="flex items-center p-24 flex-col text-center">
            <div className="flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6">
                <h4>{title ?? "Une erreur s'est produite 😓"}</h4>
                <p>{subtitle ?? "Veuillez réessayer plustard !"}</p>
            </div>
            {backButton &&
                (localizedLink ? (
                    <Button asChild variant="outline">

                        <Link href={localizedLink}>
                            {buttonText ? buttonText : "Back "}
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" onClick={handleClickBack}>
                        {buttonText ? buttonText : "Back To Home"}
                    </Button>
                ))}
            {illustration && (
                <Image
                    alt="Illustration d'erreur"
                    className="w-full max-w-[300px] mbe-6"
                    src="/images/error_500.png"
                />
            )}
        </div>
    );
};

export default ErrorView;