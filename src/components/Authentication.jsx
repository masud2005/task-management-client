import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const Authentication = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);

    const handleLogin = () => {
        // console.log('click');
        googleSignIn()
            .then(result => {
                console.log(result.user);
                navigate('dashboard');
            })
            .catch(error => {
                console.log(error.message);
            })
    };

    return (
        <>
            {/* { */}

            <div className={`${location.pathname === 'dashboard' && 'hidden'} flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center`}>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Task Management Application</h1>
                    <p className="text-gray-600 mb-6">
                        Manage your tasks efficiently. Drag & drop, reorder, and categorize your tasks easily.
                    </p>
                    <p className="text-red-500 font-semibold mb-4">
                        * You must log in to access the dashboard.
                    </p>
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                        <FaGoogle /> <span className="ml-1">Sign in with Google</span>
                    </button>
                </div>
            </div>
            {/* } */}
        </>
    );
};

export default Authentication;