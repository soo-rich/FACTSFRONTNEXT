"use client";
import { Controller, useForm } from "react-hook-form";
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
import { Input } from "@heroui/input";
import { CircularProgress } from "@heroui/progress";
import { Button } from "@heroui/button";

import { schemaLogin } from "@/service/auth/auth-service";

type formData = z.infer<typeof schemaLogin>;

const LoginVew = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schemaLogin),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const SubmitForm = async (data: formData) => {
    console.log("data", data);
    const res = await signIn("credentials", { ...data, redirect: false });

    if (res && res.ok && res.error === null) {
      const redirectURL = searchParams.get("redirectTo") ?? "/";

      router.replace(redirectURL);
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
      <form noValidate onSubmit={handleSubmit(SubmitForm)}>
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
            <h1 className="text-xl font-bold">Bienvenue sur SOOSMART FACTS</h1>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-3">
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <Input
                    {...field}
                    color={errors.username ? "danger" : "default"}
                    errorMessage={errors.username?.message}
                    isInvalid={!!errors.username}
                    label={"Username"}
                    labelPlacement={"outside"}
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    {...field}
                    color={errors.password ? "danger" : "default"}
                    errorMessage={errors.password?.message}
                    isInvalid={!!errors.password}
                    label={"Mot de passe"}
                    labelPlacement={"outside"}
                  />
                )}
              />
            </div>
            <div className={"flex items-center justify-center gap-2"}>
              {isSubmitting ? (
                <CircularProgress className="text-primary" size={"lg"} />
              ) : (
                <Button
                  className="w-full"
                  disabled={isSubmitting}
                  type="submit"
                  variant="faded"
                >
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginVew;
