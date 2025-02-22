import { useContext } from "react";
import { FaGoogle, FaTasks, FaCheckCircle, FaSyncAlt, FaArrowsAlt } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const Authentication = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/users');
            return res.data;
        },
    });

    const handleLogin = async () => {
        try {
            const result = await googleSignIn();
            const userInfo = {
                name: result?.user?.displayName,
                email: result?.user?.email,
                photo: result?.user?.photoURL,
            };

            // Check if the user already exists
            const existingUser = users?.find((user) => user.email === result?.user?.email);
            if (existingUser) {
                toast.success(`Welcome back, ${existingUser.name || "User"}!`);
                navigate("dashboard");
                return;
            }

            // If user does not exist, add them to the database
            const res = await axios.post("http://localhost:5000/users", userInfo);
            if (res.data.insertedId) {
                toast.success(`Welcome, ${userInfo.name || "User"}! Your account has been created.`);
                navigate("dashboard");
            }
        } catch (error) {
            toast.error("Failed to sign in. Please try again.");
        }
    };

    return (
        <div
            className={`${location.pathname === "dashboard" && "hidden"
                } flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6 text-center`}
        >
            {/* Hero Section */}
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                    <FaTasks className="mr-2 text-blue-500" /> Task Management Application
                </h1>
                <p className="text-gray-600 mb-6 text-lg">
                    Organize, prioritize, and manage your tasks effortlessly. Stay productive and achieve your goals faster.
                </p>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <FaCheckCircle className="text-3xl text-blue-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Task Management</h2>
                        <p className="text-gray-600">
                            Easily create, update, and delete tasks. Keep track of your progress with a simple interface.
                        </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <FaSyncAlt className="text-3xl text-purple-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Real-Time Sync</h2>
                        <p className="text-gray-600">
                            Your tasks are synced in real-time across all devices. Access them anytime, anywhere.
                        </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <FaArrowsAlt className="text-3xl text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Drag-and-Drop</h2>
                        <p className="text-gray-600">
                            Reorder tasks effortlessly using drag-and-drop. Move tasks between To-Do, In Progress, and Done.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-blue-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-white mb-6">
                        Sign in with Google to access your personalized dashboard and start managing your tasks today.
                    </p>
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center w-full py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-blue-100 transition duration-200"
                    >
                        <FaGoogle className="mr-2" /> Sign in with Google
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-gray-600 text-center">
                <p>© {new Date().getFullYear()} Task Management Application. Design by <span className="font-semibold">Md. Masud Rana.</span></p>
            </div>

        </div>
    );
};

export default Authentication;