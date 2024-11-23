import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home"
import DetailsPage from "../pages/DetailsPage";
import SearchPage from "../pages/SearchPage";
import MyList from "../pages/MyList";
import Browse from "../pages/Browse"; // Browse 컴포넌트 import 추가

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path: 'my-list',
                element: <MyList />
            },
            {
                path: 'browse',
                element: <Browse />
            },
            {
                path : ":explore/:id",
                element : <DetailsPage/>
            },
            {
                path : "search",
                element : <SearchPage/>
            }
        ]
        
    }
]);

export default router;