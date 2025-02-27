import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const InfoTooltip = ({ message }: { message: string }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer">
            <Info className="w-3 h-3 text-muted-foreground hover:text-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-card max-w-64 border border-border text-foreground rounded-md shadow-md">
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
