
import { createBrowserRouter } from "react-router-dom";
import Authentication from "../components/Authentication";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Authentication />
    }
])

export default router;