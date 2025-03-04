import { Router } from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const expenseRouter = Router();

expenseRouter.get("/", getTasks);
expenseRouter.post("/addTask", addTask);
expenseRouter.put("/:id", updateTask);
expenseRouter.delete("/:id", deleteTask);

export default expenseRouter;
