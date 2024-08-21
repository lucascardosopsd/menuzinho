"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarOptionProps } from "@/types/sidebar";

interface ReusableSidebarProps {
  options: SidebarOptionProps[];
  redirectLogout: string;
}

const ReusableSidebar = ({ options, redirectLogout }: ReusableSidebarProps) => {
  const pathname = usePathname();

  const currentPath =
    pathname.split("?").length > 0 ? pathname.split("?")[0] : pathname;

  return (
    <div className="h-full w-20 flex flex-col items-center border border-r gap-10 py-10 z-50">
      {options.map((option, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "transition",
                option.href.split("?")[0] == currentPath &&
                  "text-primary border border-primary rounded p-2",
                option.href.split("?")[0] !== currentPath &&
                  "hover:scale-125 hover:text-primary"
              )}
            >
              <Link href={option.href}>
                <option.icon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <div className="flex flex-col gap-5 mt-auto">
        <Separator />
        <Button
          size="icon"
          onClick={() => {
            signOut({
              callbackUrl: `${process.env.NEXT_PUBLIC_HOST!}${redirectLogout}`,
            });
          }}
        >
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
};

export default ReusableSidebar;
