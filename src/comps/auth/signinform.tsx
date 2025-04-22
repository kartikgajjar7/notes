"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormError from "./formerror";
import FormSuccess from "./formsuccess";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState, useTransition } from "react";
import { supabase as s } from "@/lib/supabase"; // adjust path as per your setup

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

export default function Loginform() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const supabase = s;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Login successful");
        router.push("/dashboard"); // change redirect if needed
      }
    });
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    setError(""); // Ensure setError is declared in the component's state
    setSuccess("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`, // Change if needed
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred during social login");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="your email"
                    onChange={field.onChange}
                    value={field.value}
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
                    disabled={isPending}
                    placeholder="your password"
                    type="password"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormSuccess message={success} />
          <FormError message={error} />

          <Button disabled={isPending} className="w-full" type="submit">
            Sign In with Email
          </Button>

          <div className="flex my-6 items-center">
            <div className="w-auto h-1 bg-[#ffffff] flex-grow rounded-full"></div>
            <div className="mx-2 text-[#ffffff]">or</div>
            <div className="w-auto h-1 bg-[#ffffff] flex-grow rounded-full"></div>
          </div>
          <div className="w-full">
            <Button
              disabled={isPending}
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="bg-white text-black hover:bg-gray-100 w-full"
            >
              <img className="w-[29px] mr-2" src="/Google.svg" alt="Google" />
              Sign In with Google
            </Button>
          </div>
        </form>
      </Form>

      <h1
        className="text-center cursor-pointer mt-6"
        onClick={() => router.push("/auth/signup")}
      >
        Don't have an account? Sign up
      </h1>
    </>
  );
}
