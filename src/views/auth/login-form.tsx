'use client'
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/ui/circularprogess";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputWithIcon, PasswordInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { schemaLogin } from "@/service/auth/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeIcon, User2Icon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type formData = z.infer<typeof schemaLogin>;

const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"form">) => {

const {data:session} = useSession()



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
    const res = await signIn("credentials", { ...data, redirect: false });

    if (res && res.ok && res.error === null) {
      form.reset({
        username: "",
        password: "",
      });
      const redirectURL = searchParams.get("redirectTo") ?? "/dashboard";

      toast.success(
        'Connexion reussi',);
      setTimeout(() => {
        router.replace(redirectURL);
      }, 2000);
    } else {
      toast.error("Identifiant ou mot de passe incorrecte.",
      );
    }
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const handleGoDashborad = () => {
    router.push("/dashboard");
  }

  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(SubmitForm)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
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

                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid gap-3">

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>

                <FormMessage className={'text-red-600'} />
              </FormItem>
            )}
          />

          {
            isSubmitting ? (
              <div className={'flex justify-center items-center'}><CircularProgress size={24}
                strokeWidth={5}
                className={'text-primary'} />
              </div>) : (
              <Button className="w-full" type="submit">
                Connexion
              </Button>)
          }
          {
            session !== null ? (<><div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
              <Button variant="outline" type="button" className="w-full" onClick={() => handleGoDashborad()}>
                <HomeIcon />
                Tableau de bord
              </Button></>) : null
          }

        </div>

      </form>
    </Form>
  )
}


export default LoginForm