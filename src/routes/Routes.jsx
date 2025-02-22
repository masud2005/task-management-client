
import { createBrowserRouter } from "react-router-dom";
import Authentication from "../components/Authentication";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "../components/PrivateRoute";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Authentication />
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
    }
])

export default router;