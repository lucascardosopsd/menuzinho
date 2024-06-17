import { nextAuthOptions } from "@/lib/authProviders";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    return redirect("/advertiser/dashboard");
  }

  return <div className="container">{children}</div>;
};

export default Layout;
