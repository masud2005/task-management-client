import React, { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { MdLogout } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, signOutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        signOutUser()
            .then((result) => {
                toast.success("User logged out");
                navigate('/');
            })
            .catch(error => {
                toast.error(error.code)
            });
    };

    return (
        <nav className="bg-gray-500 text-white py-4 px-2">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Task Manager</h1>
                <div className="flex items-center gap-3">
                    {/* Profile Image with Tooltip */}
                    <div className="relative group">
                        <img
                            src={user?.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                        />
                        {/* Tooltip */}
                        <span className="absolute left-1/2 top-12 -translate-x-1/2 bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-nowrap text-base">
                            {user?.displayName}
                        </span>
                    </div>

                    {/* Log Out Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-base font-semibold transition"
                    >
                        <span className='flex items-center gap-1'><MdLogout size={24} />  Log Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
