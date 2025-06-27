"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Link } from "@heroui/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@heroui/input";
import { CircularProgress } from "@heroui/progress";
import { Button } from "@heroui/button";
import Image from "next/image";
import { Card } from "@heroui/card";
import { addToast } from "@heroui/toast";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  WarningIcon,
} from "@heroui/shared-icons";
import { ShieldCheck } from "lucide-react";

import { schemaLogin } from "@/service/auth/auth-service";

type formData = z.infer<typeof schemaLogin>;

const LoginVew = () => {
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
    }, 500);
  };

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div className="w-full flex items-center justify-center bg-white p-8">
      <Card className="w-full max-w-md px-8 py-8" radius={"sm"} shadow={"lg"}>
        <form noValidate onSubmit={handleSubmit(SubmitForm)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link
                className="flex flex-col items-center gap-2 font-medium"
                href="/"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  {/*<GalleryVerticalEnd className="size-6" />*/}
                  <Image
                    alt={"SOOSMART GRP."}
                    blurDataURL={"/identity_redim.ico"}
                    height={100}
                    layout={"responsive"}
                    objectFit={"contain"}
                    objectPosition={"center"}
                    placeholder={"blur"}
                    priority={true}
                    quality={100}
                    sizes={"md"}
                    src={"/identity_redim.ico"}
                    width={100}
                  />
                </div>
                <span className="sr-only">SOOSMART GRP.</span>
              </Link>
              <h1 className="text-xl font-bold">
                Bienvenue sur SOOSMART FACTS
              </h1>
            </div>
            <div className="flex flex-col space-y-4 gap-4">
              <div className="w-full">
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
              <div className="">
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
              <div className={"flex items-center justify-center gap-2"}>
                {/*{isSubmitting ? (
                  <CircularProgress
                    className="text-primary w-full"
                    size={"lg"}
                  />
                ) : (*/}
                <Button
                  className={"w-full bg-primary text-white"}
                  disabled={isSubmitting}
                  spinner={
                    isSubmitting ? (
                      <CircularProgress
                        className="text-primary w-full"
                        size={"lg"}
                      />
                    ) : undefined
                  }
                  type="submit"
                  variant="solid"
                >
                  Connexion
                </Button>
                {/*)}*/}
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginVew;
