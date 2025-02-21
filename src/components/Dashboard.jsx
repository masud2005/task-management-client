import React, { useState } from "react";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: "To-Do",
    });

    const handleAddTask = () => {
        if (newTask.title.trim() === "") return; // Validate title
        setTasks([...tasks, { ...newTask, id: Date.now() }]);
        setNewTask({ title: "", description: "", category: "To-Do" });
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* হেডার এবং Add Task বাটন */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Task Management System</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    + Add Task
                </button>
            </div>

            {/* টাস্ক কলাম */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["To-Do", "In Progress", "Done"].map((col) => (
                    <div key={col} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">{col}</h2>
                        <div className="space-y-4">
                            {tasks
                                .filter((task) => task.category === col)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <h3 className="font-semibold text-gray-800">{task.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Task মোডাল */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-[768px] px-3 py-8 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Task</h2>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={50}
                        />
                        <textarea
                            placeholder="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={200}
                        />
                        <select
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="To-Do">To-Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Add Task
                            </button>
                        </div>
                        <button
                            className="btn btn-circle btn-outline fixed top-4 right-4 bg-red-300 hover:bg-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;