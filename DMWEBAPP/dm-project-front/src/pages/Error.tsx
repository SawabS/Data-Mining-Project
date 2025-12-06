import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";
import { Link, useRouteError } from "react-router-dom";

export default function Error() {
  const error: any = useRouteError();
  return (
    <main className="w-full h-screen text-text">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight  text-balance sm:text-7xl">
          Error
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
          {error.message}
        </p>
        <Button
          variant={"default"}
          className="flex items-center justify-center mt-10 gap-x-6 mx-auto">
          <Link to={`/${ENUMs.PAGES.HOME}`}>Go back Home</Link>
        </Button>
      </div>
    </main>
  );
}
