import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="h-screen absolute inset-0 flex flex-col items-center">
      <div className="h-16 w-full" />
      <div className="w-full h-full">
        <div
          className={cn(
            className,
            "mx-auto relative top-2 lg:top-1/4 max-w-7xl"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
