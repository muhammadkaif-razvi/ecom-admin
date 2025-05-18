"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { LoginSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormError } from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider !"
      : "";
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { update } = useSession();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          update();
          form.reset();
          setSuccess(data.success);
        }
        if (data?.twoFactor) {
          update();
          setSuccess("Code sent to your email");
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <AuthWrapper
      mainhead="WELCOME"
      headerLabel="Enter details to login"
      BesiderHrefLabel="Already have an account?"
      BackHref="/register"
      BackHrefLabel="register"
      src="/authimage.jpg"
      alt="Jungle Image"
      showContinueSeparator
      continueLabel="or"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} disabled={isPending} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com or +911234567890"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Your password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="link" size="sm" className="py-0  font-normal">
                <Link href="/reset-password" className=" ">
                  Forgot Password?
                </Link>
              </Button>
            </>
          )}

          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button onClick={() =>  window.location.reload()} type="submit" className="w-full " disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : showTwoFactor ? (
              "Verify"
            ) : (
              "Login"
            )}{" "}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};
