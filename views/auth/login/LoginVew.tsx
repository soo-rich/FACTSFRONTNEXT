"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  WarningIcon,
} from "@heroui/shared-icons";
import { Input } from "@heroui/input";
import Image from "next/image";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/progress";
import { Card, CardBody } from "@heroui/card";
import { clsx } from "clsx";
import { addToast } from "@heroui/toast";
import { ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";

import { schemaLogin } from "@/service/auth/auth-service";

type formData = z.infer<typeof schemaLogin>;

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
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
    const res = await signIn("credentials", { ...data, redirect: false });

    if (res && res.ok && res.error === null) {
      reset({
        username: "",
        password: "",
      });
      const redirectURL = searchParams.get("redirectTo") ?? "/dashboard";

      addToast({
        title: "Connexion",
        color: "success",
        description: "Connexion Reussie",
        icon: <ShieldCheck className={"text-white bg-white"} fontSize={15} />,
      });
      setTimeout(() => {
        router.replace(redirectURL);
      }, 2000);
    } else {
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

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div className={clsx("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardBody className="grid p-0 md:grid-cols-2">
          <form
            noValidate
            className="p-6 md:p-8"
            onSubmit={handleSubmit(SubmitForm)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue</h1>
                <p className="text-balance text-muted-foreground">
                  Connecter avec votre compte
                </p>
              </div>
              <div className="grid gap-2">
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <Input
                      {...field}
                      className={"text-lg"}
                      color={errors.username ? "danger" : "default"}
                      errorMessage={errors.username?.message}
                      isInvalid={!!errors.username}
                      label={"Username"}
                      labelPlacement={"outside"}
                      variant={"underlined"}
                    />
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      color={errors.password ? "danger" : "default"}
                      endContent={
                        <Button
                          aria-label={"toggle password visisble"}
                          className={"focus:outline-none"}
                          type={"button"}
                          variant={"light"}
                          onPress={toggleVisibility}
                        >
                          {visible ? (
                            <EyeFilledIcon fontSize={16} />
                          ) : (
                            <EyeSlashFilledIcon />
                          )}
                        </Button>
                      }
                      errorMessage={errors.password?.message}
                      isInvalid={!!errors.password}
                      label={"Mot de passe"}
                      labelPlacement={"outside"}
                      type={visible ? "text" : "password"}
                      variant={"underlined"}
                    />
                  )}
                />
              </div>
              {isSubmitting ? (
                <div className={"w-full flex justify-center items-center"}>
                  <CircularProgress
                    className="text-primary w-full"
                    size={"lg"}
                  />
                </div>
              ) : (
                <Button
                  className={"w-full bg-primary-600"}
                  disabled={isSubmitting}
                  type="submit"
                  variant="solid"
                >
                  Connexion
                </Button>
              )}
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              fill
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              src="/images/loginpage.jpg"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginForm;
