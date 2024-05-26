import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

export function PlaceholderStacks() {
    const items = Array.from({ length: 2 }, (_, i) => i);
    return (
      <div className="flex flex-row flex-wrap gap-4">
        {items.map((item) => (
          <Card className="flex w-64 flex-grow flex-col gap-2 p-4" key={item}>
          <div className="flex flex-row gap-2 items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-6 w-20" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-[4rem] rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-32" />
          <div className="flex flex-row gap-2 flex-wrap">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-16 w-48 rounded-md" />
        </Card>
        ))}
      </div>
    );
  }