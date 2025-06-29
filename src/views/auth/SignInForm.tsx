"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {ChevronLeftIcon, EyeCloseIcon, EyeIcon} from "@/icons";
import Link from "next/link";
import React, {useState} from "react";
import z from "zod";
import {schemaLogin} from "@/service/auth/auth-service";
import {useRouter, useSearchParams} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";

type formData = z.infer<typeof schemaLogin>;

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        control, reset, handleSubmit, formState: {errors}, setValue, watch,
    } = useForm<formData>({
        resolver: zodResolver(schemaLogin),
        mode: "onChange",
        defaultValues: {
            username: "string",
            password: "string",
        },
    });


    const SubmitForm = async (data: formData) => {
        setIsSubmitting(true);
        const res = await signIn("credentials", {...data, redirect: false});

        if (res && res.ok && res.error === null) {
            reset({
                username: "",
                password: "",
            });
            const redirectURL = searchParams.get("redirectTo") ?? "/dashboard";


            setTimeout(() => {
                router.replace(redirectURL);
            }, 2000);
        } else {

        }
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    };


    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/public"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon/>
                    Retour
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Connexion
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Entre votre nom d'utilisateur et votre mot de passe pour vous connecter.
                        </p>
                    </div>
                    <div>

                        <form noValidate onSubmit={handleSubmit(SubmitForm)} className="space-y-6">
                            <div className="space-y-6">
                                <Controller control={control} render={({field}) => (
                                    <div>
                                        <Label>
                                            Username <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input {...field} onChange={(e) => field.onChange(e.target.value)}
                                               type="text" error={!!errors.username} hint={errors.username?.message}/>
                                    </div>
                                )} name={'username'}/>
                                <Controller
                                    control={control}
                                    render={({field}) => (
                                        <div>
                                            <Label>
                                                Password <span className="text-error-500">*</span>{" "}
                                            </Label>

                                            <div className="relative">

                                                <Input
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    error={!!errors.password}
                                                    type={showPassword ? "text" : "password"}
                                                    hint={errors.password?.message}
                                                />
                                                <span
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                                >
                                                    {showPassword ? (
                                                        <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                                                    ) : (
                                                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400"/>
                                                    )}
                                                </span>
                                            </div>


                                        </div>)}
                                    name={'password'}
                                />

                                <div>
                                    <Button className="w-full" size="sm">
                                        {isSubmitting ? '.......' : 'Connexion'}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Vous n'avez pas de compte ?{" "}'
                                <Link
                                    href="/"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Enregistrer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
