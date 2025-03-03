import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export const PageWrapper = ({
  children,
  className,
  breadcrumbs,
}: {
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: BreadcrumbItemType[];
}) => {
  return (
    <div className="min-h-screen absolute pt-20 lg:pt-0 px-4 md:px-0 inset-0 flex flex-col items-center">
      <div className="h-16 w-full" />

      <div className="w-full h-full">
        <div className={cn(className, "mx-auto relative top-10 max-w-7xl")}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="my-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href={"/"} passHref>
                    <BreadcrumbLink>{"Home"}</BreadcrumbLink>
                  </Link>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                {breadcrumbs.map((item, index) => (
                  <>
                    {item.href ? (
                      <Link href={item.href || ""} passHref key={index}>
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      </Link>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
