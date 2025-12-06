import { RouterProvider } from "react-router-dom";
import Fallback from "./pages/Fallback";
import { Suspense } from "react";
import { router } from "./routes/Index";
import { GlobalSpotlight } from "./components/shared/GlobalSpotlight";

const App = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <GlobalSpotlight />
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
