import { createHashRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import MyList from "../pages/MyList";
import Browse from "../pages/Browse";
import Popular from "../pages/Popular";
import MovieDetail from "../pages/MovieDetail";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import AuthGuard from "../components/auth/AuthGuard";

const router = createHashRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AuthGuard><Home /></AuthGuard>,
      },
      {
        path: "movie",
        element: <AuthGuard><Home /></AuthGuard>,
      },
      {
        path: "popular",
        element: <AuthGuard><Popular /></AuthGuard>,
      },
      {
        path: "wishlist",
        element: <AuthGuard><MyList /></AuthGuard>,
      },
      {
        path: "browse",
        element: <AuthGuard><Browse /></AuthGuard>,
      },
      {
        path: "movie/:id",
        element: <AuthGuard><MovieDetail /></AuthGuard>,
      },
      {
        path: "search",
        element: <AuthGuard><SearchPage /></AuthGuard>,
      }
    ],
  }
]);

export default router;