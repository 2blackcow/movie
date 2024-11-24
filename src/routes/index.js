import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import MyList from "../pages/MyList";
import Browse from "../pages/Browse";
import Popular from "../pages/Popular";
import MovieDetail from "../pages/MovieDetail";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "", element: <Home /> },
        { path: "movie", element: <Home /> },
        { path: "popular", element: <Popular /> },
        { path: "wishlist", element: <MyList /> },
        { path: "browse", element: <Browse /> },
        { path: "movie/:id", element: <MovieDetail /> },
        { path: "search", element: <SearchPage /> },
      ],
    },
  ]
);

export default router;
