import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [selectedTask, setSelectedTask] = useState(null);
    console.log(selectedTask);

    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks", user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/all-task/${user?.email}`);
            return res.data;
        }
    });

    const handleAddTask = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;

        const now = new Date();
        const dateTimeUTC = now.toISOString();

        const newTask = { title, description, category, dateTimeUTC, userEmail: user?.email };

        try {
            const res = await axios.post("http://localhost:5000/all-task", newTask);
            if (res.data.insertedId) {
                toast.success(`🎉 Task added successfully: "${title}"`);
                refetch();
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error(`⚠️ An error occurred: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteTask = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:5000/all-task/${id}`);
                    toast.success("Task deleted successfully!");
                    refetch();
                } catch (error) {
                    toast.error(`Failed to delete task: ${error.response?.data?.message || error.message}`);
                }

            }
        });

        // try {
        //     await axios.delete(`http://localhost:5000/task/${id}`);
        //     toast.success("✅ Task deleted successfully!");
        //     refetch();
        // } catch (error) {
        //     toast.error(`❌ Failed to delete task: ${error.response?.data?.message || error.message}`);
        // }
    };

    const handleUpdateTask = (task) => {
        // e.preventDefault();
        console.log(task._id);
        setSelectedTask(task);

        setIsModalOpen(true);
    }

    const updateTask = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;

        const updatedTask = { title, description, category };
        // console.log(updateTask);

        try {
            const res = await axios.patch(`http://localhost:5000/all-task/${selectedTask._id}`, updatedTask);
            console.log(res.data);

            if (res.data.modifiedCount) {
                refetch();
                toast.success("Task updated successfully!");
                setIsModalOpen(false);
            } else {
                toast.warn("No changes made!");
            }
        } catch (error) {
            toast.error(`Error updating task: ${error.message}`);
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Task Management System</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    + Add Task
                </button>
            </div>

            {/* Task Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["To-Do", "In Progress", "Done"].map((col) => (
                    <div key={col} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{col}</h2>
                        <div className="space-y-4">
                            {tasks
                                .filter((task) => task.category === col)
                                .map((task) => (
                                    <div
                                        key={task._id}
                                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleUpdateTask(task)}
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteTask(task._id)}
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-[768px] px-3 py-8 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <label>Task Title</label>
                            <input
                                type="text"
                                placeholder="Task Title"
                                name="title"
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={50}
                                required
                            />
                            <label>Task Description</label>
                            <textarea
                                placeholder="Description"
                                name="description"
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={200}
                                required
                            />
                            <label>Task Category</label>
                            <select
                                name="category"
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                defaultValue={''}
                            >
                                <option disabled value="">Select Category</option>
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                {/* <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button> */}
                                <button
                                    className="btn btn-circle btn-outline fixed top-4 right-4 bg-red-300 hover:bg-red-500"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ✕
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalOpen && selectedTask && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-[768px] px-3 py-8 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Task</h2>
                        <form onSubmit={updateTask}>
                            <label>Task Title</label>
                            <input
                                type="text"
                                placeholder="Task Title"
                                defaultValue={selectedTask.title}
                                name="title"
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={50}
                                required
                            />
                            <label>Task Description</label>
                            <textarea
                                placeholder="Description"
                                name="description"
                                defaultValue={selectedTask.description}
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={200}
                                required
                            />
                            <label>Task Category</label>
                            <select
                                name="category"
                                className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                defaultValue={selectedTask.category}
                            >
                                {/* <option disabled value="">Select Category</option> */}
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <div className="flex justify-end gap-2">
                                {/* <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button> */}
                                <button
                                    className="btn btn-circle btn-outline fixed top-4 right-4 bg-red-300 hover:bg-red-500"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ✕
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
