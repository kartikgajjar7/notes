import SignUpForm from "@/comps/auth/signupform";
export default function SignInPage() {
  return (
    <div className="flex min-h-screen  flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign up</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to create account
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
