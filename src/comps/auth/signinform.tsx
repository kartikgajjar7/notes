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

          <Button className="w-[100%]" type="submit">
            Submit
          </Button>
        </form>
      </Form>

      <h1
        className="text-center cursor-pointer"
        onClick={() => router.push("/auth/signup")}
      >
        Don’t have an account? Sign up
      </h1>
    </>
  );
}
