import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useState } from "react";
import { FaEdit, FaGripLines, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import Navbar from "./Navbar";
import { RiDragMoveFill } from "react-icons/ri";

const Column = ({ id, title, children }) => {
    const { user } = useContext(AuthContext);
    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks", user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/all-task/${user?.email}`);
            // console.log(res.data);
            return res.data;
        },
    });

    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="p-4 border border-gray-400 rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>
            {children}
            {React.Children.count(children) === 0 && (
                <div className="min-h-[100px] border-dashed border-2 border-gray-300 flex items-center justify-center mt-2">
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        <span className="text-gray-500 italic">Drop here</span>
                    ) : (
                        <span className="text-gray-500 italic">
                            No tasks available. <span className="font-medium text-blue-500">Add a new one!</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};


const SortableTask = ({ task, serial, fullDrag, handleUpdateTask, handleDeleteTask }) => {
    const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
        id: task._id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const draggableProps = fullDrag ? { ...attributes, ...listeners } : {};

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative flex justify-between items-center bg-white rounded-lg shadow-md p-3 2xl:p-4 border border-gray-200 mb-2 transition-all hover:shadow-lg hover:border-blue-300`}
        >
            <div >
                <div className=" w-8 h-8  rounded-full bg-gray-300 text-black flex items-center justify-center mr-3 text-sm font-bold shadow-sm">
                    {serial}
                </div>
                <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                <p className="text-gray-600 mt-1 text-base">{task.description}</p>
                <p className="text-gray-500 mt-1 text-sm flex items-center gap-1">
                    <span>📅</span>
                    <span>{new Date(task.dateTimeUTC).toLocaleString()}</span>
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
                <div className="relative group">
                    <button
                        className="p-2 text-blue-500 hover:text-blue-700 bg-blue-100 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateTask(task);
                        }}
                    >
                        <FaEdit size={18} />
                    </button>
                    <span className="absolute top-1 -left-8 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-sm rounded py-1 px-2">
                        Update
                    </span>
                </div>

                <div className="relative group">
                    <button
                        className="p-2 text-red-500 hover:text-red-700 bg-red-100 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                        }}
                    >
                        <FaTrash size={18} />
                    </button>
                    <span className="absolute top-1 -left-8 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-sm rounded py-1 px-2">
                        Delete
                    </span>
                </div>

                <div className="relative group">
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-2 cursor-move text-gray-800 bg-gray-100 rounded-full transition-colors"
                    >
                        <RiDragMoveFill size={20} />
                    </div>
                    <span className="absolute top-1 -left-8 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-sm rounded py-1 px-2">
                        Move
                    </span>
                </div>

            </div>
        </div>
    );
};

const Dashboardd = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const [selectedTask, setSelectedTask] = useState(null);

    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks", user?.email],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/all-task/${user?.email}`);
            return res.data;
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAddTask = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const now = new Date();
        const dateTimeUTC = now.toISOString();

        const categoryTasks = tasks.filter((t) => t.category === category);
        const order = categoryTasks.length;
        const newTask = { title, description, category, dateTimeUTC, userEmail: user?.email, order };

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
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:5000/all-task/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Task deleted successfully!");
                        refetch();
                    }
                } catch (error) {
                    toast.error(`Failed to delete task: ${error.response?.data?.message || error.message}`);
                }
            }
        });
    };

    const handleUpdateTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const updateTask = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const category = form.category.value;
        const updatedTask = { title, description, category };

        try {
            const res = await axios.patch(`http://localhost:5000/all-task/${selectedTask._id}`, updatedTask);
            if (res.data.modifiedCount > 0) {
                toast.success("Task updated successfully!");
                refetch();
                setIsModalOpen(false);
            } else {
                toast.warn("No changes made!");
            }
        } catch (error) {
            toast.error(`Error updating task: ${error.message}`);
        }
    };

    // handleDragEnd: reordering within the same column বা cross-column moving
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeTask = tasks.find((t) => t._id === active.id);
        if (!activeTask) return;

        const targetCategory = over.data.current?.sortable?.containerId || over.id;

        if (activeTask.category === targetCategory) {
            const currentColumnTasks = tasks
                .filter((t) => t.category === activeTask.category)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const currentIds = currentColumnTasks.map((t) => t._id);
            const oldIndex = currentIds.indexOf(active.id);
            const newIndex = currentIds.indexOf(over.id) !== -1 ? currentIds.indexOf(over.id) : currentIds.length;
            const newOrder = arrayMove(currentColumnTasks, oldIndex, newIndex);
            await Promise.all(
                newOrder.map((task, index) =>
                    axios.patch(`http://localhost:5000/all-task/${task._id}`, { order: index })
                )
            );
            toast.success("Task order updated!");
            refetch();
        } else {
            const targetColumnTasks = tasks.filter((t) => t.category === targetCategory);
            const newOrderIndex = targetColumnTasks.length;
            await axios.patch(`http://localhost:5000/all-task/${active.id}`, {
                category: targetCategory,
                order: newOrderIndex,
            });
            toast.success("Task move to Done!");
            refetch();
        }
    };

    const columns = ["To-Do", "In Progress", "Done"];

    return (
        <div className="">
            <Navbar />
            <div className="container mx-auto px-2 py-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Your Tasks</h2>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => {
                                setSelectedTask(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 text-white px-3 py-2 md:px-5 md:py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {columns.map((col) => (
                            <SortableContext
                                key={col}
                                id={col}
                                items={tasks.filter((task) => task.category === col).map((task) => task._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Column id={col} title={col}>
                                    {tasks
                                        .filter((task) => task.category === col)
                                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                        .map((task, index) => (
                                            <SortableTask
                                                key={task._id}
                                                task={task}
                                                serial={index + 1}
                                                // fullDrag={fullDragMode}
                                                handleUpdateTask={handleUpdateTask}
                                                handleDeleteTask={handleDeleteTask}
                                            />
                                        ))}
                                </Column>
                            </SortableContext>
                        ))}
                    </div>
                </DndContext>

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
                                    defaultValue={""}
                                >
                                    <option disabled value="">
                                        Select Category
                                    </option>
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="btn btn-circle btn-outline fixed top-4 right-4 bg-red-300 hover:bg-red-500"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        ✕
                                    </button>
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Update Task Modal */}
                {isModalOpen && selectedTask && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-[768px] px-3 py-8 relative">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Update Task</h2>
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
                                    defaultValue={selectedTask.description}
                                    name="description"
                                    className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={200}
                                    required
                                />
                                <label>Task Category</label>
                                <select
                                    name="category"
                                    className="border p-2 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue={selectedTask.category}
                                    required
                                >
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="btn btn-circle btn-outline fixed top-4 right-4 bg-red-300 hover:bg-red-500"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setSelectedTask(null);
                                        }}
                                    >
                                        ✕
                                    </button>
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                        Update Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboardd;
