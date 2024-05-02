import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import HomePage from "./home/page";

export default async function RoutePage(props: PageParams<{}>) {
  const user = await auth();

  if (user) {
    redirect("/dashboard");
  }

  return <HomePage />;
}
