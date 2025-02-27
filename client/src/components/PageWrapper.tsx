import { cn } from "@/lib/utils";

export const PageWrapper = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="min-h-screen absolute  pt-20 lg:pt-0 px-4 md:px-0 inset-0 flex flex-col items-center">
      <div className="h-16 w-full" />
      <div className="w-full h-full">
        <div className={cn(className, "mx-auto relative top-20 max-w-7xl")}>
          {children}
        </div>
      </div>
    </div>
  );
};
