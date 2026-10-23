import { redirect } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthCard />;
}
