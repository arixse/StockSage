import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <RegisterForm />
      </main>
    </div>
  );
}
