import { formatNumber } from "@/lib/utils";
import { Token } from "@/store/pairListAtom";
import InfoTooltip from "./InfoTooltip";
import { Label } from "./ui/label";

const TokenAllowance = ({
  token,
  allowance,
}: {
  token: Token;
  allowance: bigint;
}) => (
  <li className="flex justify-between px-2 space-y-2">
    <Label className="text-muted-foreground flex items-center font-semibold text-md">
      {token.symbol} Allowance:
      <InfoTooltip
        message={`To provide liquidity, you must first approve the use of your tokens. This allows the contract to access your ${token.symbol} on your behalf.`}
      />
    </Label>
    <span className="text-foreground">{formatNumber(allowance)}</span>
  </li>
);

export default TokenAllowance;
