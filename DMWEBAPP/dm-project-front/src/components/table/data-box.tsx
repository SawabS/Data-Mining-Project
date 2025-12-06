import { useEffect, useMemo, useRef } from "react";
import { DataTypes, PaginationProps, QueryParam } from "@/types/global";
import Loading from "../ui/loading";
import LoadingTime from "../ui/loading-time";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import NoData from "../ui/NoData";
import { Button } from "../ui/button";

export function DataBox<T extends DataTypes>({
  queryFn,
  name,
  Component,
  page,
  attrIds,
  id,
}: PaginationProps & {
  Component: React.ComponentType<T>;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { queries } = useAppQueryParams();
  const queryKey = useMemo(
    () => [name, { ...queries }] as [string, QueryParam],
    [name, queries]
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    page == "store"
      ? queryFn(queryKey, attrIds)
      : page == "offer"
      ? queryFn(id)
      : queryFn(queryKey);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Loading>
        <LoadingTime />
      </Loading>
    );
  }

  const allItems =
    data?.pages?.flatMap((page: { data: T[] }) => page.data) ?? [];
  if (isLoading) {
    return (
      <Loading>
        <LoadingTime />
      </Loading>
    );
  }
  let classes = "grid gap-4 grid-cols-1";

  let buttonFetchPages = ["ratings"];
  return (
    <div className="w-full space-y-4 flex flex-col justify-start items-center">
      {allItems.length ? (
        <div className={`w-full ${classes}`}>
          {" "}
          {allItems.map((val: T, i: number) => (
            <Component key={i} {...val} />
          ))}
        </div>
      ) : (
        <NoData />
      )}

      {/* Auto loading trigger */}
      {hasNextPage && (
        <>
          {!buttonFetchPages.includes(page || "") ? (
            <div
              ref={loadMoreRef}
              className="h-10 flex justify-center items-center">
              {isFetchingNextPage && <LoadingTime />}
            </div>
          ) : (
            <Button
              onClick={() => fetchNextPage()}
              className="mx-auto rounded-full bg-transparent border-text text-text hover:bg-text/10 opacity-100 py-4 md:py-6 px-8 md:px-20"
              disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
