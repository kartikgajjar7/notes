import Loginform from "@/comps/auth/signinform";
export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#000000] flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <Loginform />
      </div>
    </div>
  );
}
