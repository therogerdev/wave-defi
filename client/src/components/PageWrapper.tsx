import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

export const PageWrapper = ({
  children,
  className,
  breadcrumbs,
  actions,
}: {
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: BreadcrumbItemType[];
  actions?: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen absolute pt-20 lg:pt-0 px-4 md:px-0 inset-0 flex flex-col items-center">
      <div className="h-16 w-full" />
      <div className="w-full h-full">
        <div
          className={cn(className, "mx-auto relative top-5 max-w-screen-2xl")}
        >
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb className="my-4 hidden md:block">
                <BreadcrumbList>
                  <Link href={"/"}>
                    <span>{"Home"}</span>
                  </Link>

                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbSeparator />{" "}
                      <BreadcrumbItem>
                        {item.href ? (
                          <Link href={item.href}>
                            <span className="breadcrumb-link">
                              {item.label}
                            </span>
                          </Link>
                        ) : (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}

            <div className="my-3 md:my-0">{actions}</div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
