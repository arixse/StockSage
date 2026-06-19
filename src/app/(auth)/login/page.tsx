import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
