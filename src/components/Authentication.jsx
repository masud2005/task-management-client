import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Authentication = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);

    const handleLogin = async () => {
        try {
            const result = await googleSignIn();
            console.log(result.user);

            const userInfo = {
                name: result?.user?.displayName,
                email: result?.user?.email,
                photo: result?.user?.photoURL,
            };

            // Fetch existing users from the database
            const usersResponse = await axios.get('http://localhost:5000/users');
            const users = usersResponse.data;
            console.log(users);

            // Check if the user already exists
            if (users && users.length > 0) {
                const existingUser = users.find(user => user.email === userInfo.email);
                if (existingUser) {
                    toast.success(`Welcome back, ${existingUser.name || 'User'}!`);
                    return navigate('dashboard'); // ফাংশন এখানেই শেষ
                }
            }

            // If user does not exist, add them to the database
            const res = await axios.post('http://localhost:5000/users', userInfo);
            // console.log(res.data);

            if (res.data.insertedId) {
                toast.success(`Welcome, ${userInfo.name || 'User'}! Your account has been created.`);
                navigate('dashboard');
            }
        } catch (error) {
            console.error(error.message);
            toast.error(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
        }
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