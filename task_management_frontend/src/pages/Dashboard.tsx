import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getTasks } from "../utils/api";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex flex-col p-4 rounded-3xl">
      <main className="flex-grow w-full max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8"
        >
          Welcome, {user?.email}!
        </motion.h1>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>

          {loading ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks available. Add a new task to get started.
            </p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-xl font-semibold text-gray-700">
                      Title: {task.title}
                    </h3>
                    <span
                      className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <span className="text-gray-700 text-lg font-semibold">
                      {" "}
                      Description{" "}
                    </span>
                    : {task.description}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    <span className="text-gray-700 text-lg font-semibold">
                      {" "}
                      Due Date{" "}
                    </span>
                    : {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
