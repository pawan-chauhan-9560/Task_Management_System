import React, { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "../utils/api"; // Ensure API calls are updated
import { motion } from "framer-motion";
import Swal from "sweetalert2";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

const Tasks: React.FC = () => {
  // State declarations
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ dueDate: "", status: "" });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // API call to fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle task add or update
  const handleAddOrUpdateTask = async () => {
    if (!title || !description || !dueDate) {
      return Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please fill all fields.",
      });
    }
    try {
      if (editingTask) {
        const updatedTask = await updateTask(editingTask.id, {
          title,
          description,
          status,
          dueDate,
        });
        setTasks(
          tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Task updated successfully.",
        });
      } else {
        const newTask = await addTask({ title, description, status, dueDate });
        setTasks([...tasks, newTask]);
        fetchTasks();
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "Task added successfully.",
        });
      }
      clearForm();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  // Populate form for editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate);
  };

  // Delete task handler
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Task deleted successfully.",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  // Reset form fields
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setDueDate("");
    setEditingTask(null);
  };

  // Filter tasks based on dueDate and status
  const filteredTasks = tasks.filter((task) => {
    const matchesDueDate = !filter.dueDate || task.dueDate === filter.dueDate;
    const matchesStatus =
      !filter.status ||
      task.status.toLowerCase() === filter.status.toLowerCase();
    return matchesDueDate && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 to-pink-300 p-6 rounded-3xl">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-8"
      >
        Task Manager
      </motion.h1>

      {/* Task Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "pending" | "in-progress" | "completed")
          }
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={handleAddOrUpdateTask}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </motion.div>

      {/* Filter and Tasks Table */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            placeholder="Filter by Due Date"
            onChange={(e) => setFilter({ ...filter, dueDate: e.target.value })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <select
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.description}</td>
                  <td className="p-3 capitalize">{task.status}</td>
                  <td className="p-3">{task.dueDate}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
