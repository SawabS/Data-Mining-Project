import { ReactElement } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Error from "@/pages/Error";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { ENUMs } from "@/lib/enums";
import Layout from "@/components/layout";

type MyRoute = {
  path: string;
  element: ReactElement;
};

const globalRoutes: MyRoute[] = [
  {
    path: ENUMs.PAGES.HOME,
    element: <Home />,
  },
];

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} errorElement={<Error />}>
      {globalRoutes.map((val: MyRoute, _index: number) => (
        <Route
          key={_index}
          path={`${val.path}`}
          errorElement={<Error />}
          element={val.element}
        />
      ))}

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
