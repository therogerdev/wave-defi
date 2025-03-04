import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { PageWrapper } from "../PageWrapper";

export default function PoolDetailLoading() {
  return (
    <PageWrapper
      breadcrumbs={[{ label: "Loading..." }, { label: "Loading..." }]}
      actions={
        <div className="flex justify-between gap-x-4">
          <Skeleton className="w-32 h-10 rounded-3xl" />

          <Skeleton className="w-32 h-10 rounded-3xl" />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-1 md:px-2 lg:px-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full ml-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-24 h-5" />
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <div className="flex items-center">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-8 h-8 ml-2" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <div>
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-32 h-4 mt-1" />
                </div>
              </div>
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="w-full h-10" />
          </CardFooter>
        </Card>

        <Card className="col-span-1 md:col-span-2 md:row-span-2 text-foreground p-5 flex flex-col gap-y-4">
          <Skeleton className="w-full h-1/2" />
          <Skeleton className="w-full h-1/2" />
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full ml-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-24 h-5" />
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <div className="flex items-center">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-8 h-8 ml-2" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <div>
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-32 h-4 mt-1" />
                </div>
              </div>
              <div className="grid gap-2 text-accent">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="w-full h-10" />
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
}
