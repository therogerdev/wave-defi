import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleCopy } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const ApproveLpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center"></CardHeader>
              <CardContent>
                <ul>
                  <li className="flex justify-between px-2 space-y-2">
                    <Label className="text-muted-foreground font-semibold text-md">
                      Reserve:
                    </Label>
                    <span className="text-foreground">1239.3235</span>
                  </li>
                  <li className="flex justify-between px-2 space-y-2">
                    <Label className="text-muted-foreground font-semibold text-md">
                      Total Liquidity:
                    </Label>
                    <span className="text-foreground">1239.3235</span>
                  </li>
                  <li className="flex items-center justify-between px-2 space-y-2">
                    <Label className="text-muted-foreground font-semibold text-md">
                      Address:
                    </Label>
                    <span className="text-foreground max-w-full truncate text-ellipsis w-28">
                      <Button
                        onClick={() =>
                          handleCopy(
                            "0x2039482093840238409238402384029384029384"
                          )
                        }
                        size={"icon"}
                        className="bg-accent mr-2"
                      >
                        <Copy className="icon" />
                      </Button>
                      0x2039482093840238409238402384029384029384
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size={"lg"} variant="wave">
                  Approve
                </Button>
              </CardFooter>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveLpDialog;
