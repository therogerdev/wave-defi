import { toast } from "sonner";

export const validatePair = (tokenA: string, tokenB: string): boolean => {
  if (!tokenA || !tokenB || tokenA === tokenB) {
    toast("Invalid Pair Selection", {
      description: "Please select two different tokens",
    });
    return false;
  }
  return true;
};
