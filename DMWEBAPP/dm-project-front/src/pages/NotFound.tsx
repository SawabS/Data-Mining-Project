import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center  px-6 py-24 sm:py-32 lg:px-8 h-screen text-text">
      <div className="text-center">
        <p className="text-base font-semibold ">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight  sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium  sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Button
          value={"default"}
          className="mt-10 mx-auto flex items-center justify-center gap-x-6">
          <Link to={`/${ENUMs.PAGES.HOME}`}>Go back Home</Link>
        </Button>
      </div>
    </main>
  );
}
