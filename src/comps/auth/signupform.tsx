"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormError from "./formerror";
import FormSuccess from "./formsuccess";

import { supabase as s } from "@/lib/supabase"; // Adjust if different

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string(),
});

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const supabase = s;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name, // Custom field stored in user metadata
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Account created! Please check your email for confirmation."
        );
        setTimeout(() => router.push("/auth/signin"), 3000);
      }
    });
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Change if needed
      },
    });

    if (error) {
      setError(error.message);
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter your name"
                    {...field}
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
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {success && <FormSuccess message={success} />}
          {error && <FormError message={error} />}

          <Button disabled={isPending} className="w-[100%] m-0" type="submit">
            Sign Up with Email
          </Button>

          <div className="flex my-6 items-center">
            <div className="w-auto h-1 bg-[#ffffff] flex-grow rounded-full"></div>
            <div className="mx-2 text-[#ffffff]">or</div>
            <div className="w-auto h-1 bg-[#ffffff] flex-grow rounded-full"></div>
          </div>

          <div className="w-[100%] flex flex-row items-center justify-around space-x-4">
            <Button
              disabled={isPending}
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="bg-white text-black hover:bg-gray-100 w-[45%]"
            >
              <img className="w-[58px]" src="/fgithub.png" alt="GitHub" />
            </Button>
            <Button
              disabled={isPending}
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="bg-white text-black hover:bg-gray-100 w-[45%]"
            >
              <img className="w-[29px]" src="/Google.svg" alt="Google" />
            </Button>
          </div>
        </form>
      </Form>

      <h1
        className="text-center cursor-pointer"
        onClick={() => router.push("/auth/signin")}
      >
        Already have an account? Sign in
      </h1>
    </>
  );
}
