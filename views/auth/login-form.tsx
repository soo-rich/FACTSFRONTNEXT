'use client'

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {InputWithIcon, PasswordInput} from "@/components/ui/input";
import {schemaLogin} from "@/service/auth/auth-service";
import z from "zod";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {User2Icon} from "lucide-react";
import CircularProgress from "@/components/ui/circularprogress";

type formData = z.infer<typeof schemaLogin>;

const LoginForm = ({
                       className,
                       ...props
                   }: React.ComponentProps<"form">) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
     const form = useForm<formData>({
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
            form.reset({
                username: "",
                password: "",
            });
            const redirectURL = searchParams.get("redirectTo") ?? "/dashboard";

            toast.success(
                'Successfully logged in',);
            setTimeout(() => {
                router.replace(redirectURL);
            }, 2000);
        } else {
            toast.error("Identifiant ou mot de passe incorrecte.",
            );
        }
        setTimeout(() => {
            setIsSubmitting(false);
        }, 5000);
    };


    return (
        <Form {...form}  >
            <form className={cn("flex flex-col gap-6", className)} {...props} noValidate
                  onSubmit={form.handleSubmit(SubmitForm)}>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Connecter vous</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Entre votre username et mot de passe pour vous connecter
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <InputWithIcon
                                            icon={User2Icon}
                                            iconPosition={'left'}
                                            placeholder="John1234"
                                            {...field}
                                            required
                                        />
                                    </FormControl>

                                    <FormMessage className={'text-red-600'}/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-3">

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>

                                    <FormMessage className={'text-red-600'}/>
                                </FormItem>
                            )}
                        />
                    </div>
                    {
                        isSubmitting ? (
                            <div className={'flex justify-center items-center'}><CircularProgress size={24}
                                                                                                  strokeWidth={5}
                                                                                                  className={'text-primary'}/>
                            </div>) : (
                            <Button className="w-full" type="submit">
                                Login
                            </Button>)
                    }


                </div>

            </form>
        </Form>

    );
}


export default LoginForm;