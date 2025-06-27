"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@heroui/theme";
import { Link } from "@heroui/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { addToast } from "@heroui/toast";
import { WarningIcon } from "@heroui/shared-icons";
import { Form } from "@heroui/form";

import { schemaLogin } from "@/service/auth/auth-service";

type formData = z.infer<typeof schemaLogin>;

const LoginVew = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<formData>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const SubmitForm = async (data: formData) => {
    const res = await signIn("credentials", { ...data, redirect: false });

    if (res && res.ok && res.error === null) {
      const redirectURL = searchParams.get("redirectTo") ?? "/";

      router.replace(redirectURL);
      // router.push('/home')
    } else {
      console.log("error", res?.error);
      addToast({
        title: "Connexion",
        color: "warning",
        icon: <WarningIcon fontSize={15} />,
        description: "Identifiant ou mot de passe incorrecte.",
      });
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 5000);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(SubmitForm)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link
                className="flex flex-col items-center gap-2 font-medium"
                href="/"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">SOOSMART GRP.</span>
              </Link>
              <h1 className="text-xl font-bold">
                Bienvenue sur SOOSMART FACTS
              </h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                {/* <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <InputWithIcon
                          icon={User2Icon}
                          iconPosition={"left"}
                          placeholder="John1234"
                          {...field}
                          required
                        />
                      </FormControl>

                      <FormMessage className={"text-red-600"} />
                    </FormItem>
                  )}
                />*/}
                {/*</div>*/}
                {/*    <div className="grid gap-3">*/}
                {/*<FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>

                      <FormMessage className={"text-red-600"} />
                    </FormItem>
                  )}
                />*/}
              </div>
              {/* {!isSubmitting ? (
                    <CircularProgress size={'lg'} className="text-primary" />
                ) : (
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      Connexion
                    </Button>
                )}*/}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginVew;
