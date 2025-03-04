import { Task } from "../entities/task";
import { AppDataSource } from "../config/data-source";

export const getTasks = async (req: any, res: any) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }
    const tasks = await taskRepository.find({
      where: { user_id: userId },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

export const addTask = async (req: any, res: any) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }
    const newTask = taskRepository.create({
      ...req.body,
      user_id: userId,
    });
    const savedTask = await taskRepository.save(newTask);
    res.status(201).json({ savedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to add task", error });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const updatedTask = await taskRepository.save({
      ...task,
      ...req.body,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: req.params.id },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await taskRepository.remove(task);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};
