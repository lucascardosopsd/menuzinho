import { adsSidebarOptions } from "@/constants/adsSidebar";
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

const Sidebar = ({ userRole }: { userRole: string }) => {
  const options = adsSidebarOptions({ userRole });

  return (
    <div className="h-full w-20 flex flex-col items-center border border-r gap-10 py-10">
      {options.map((option, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <Link href={option.href}>{option.icon}</Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <div className="flex flex-col gap-5 mt-auto">
        <Separator />
        <Button size="icon">
          <LogOutIcon />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
