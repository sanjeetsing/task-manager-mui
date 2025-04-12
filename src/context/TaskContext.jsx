import { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";
import { mockTasks } from "../mockData";

const TaskContext = createContext(undefined);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(mockTasks);
  const { enqueueSnackbar } = useSnackbar();

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    enqueueSnackbar("Task created successfully", { variant: "success" });
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    enqueueSnackbar("Task updated successfully", { variant: "success" });
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    enqueueSnackbar("Task deleted successfully", { variant: "success" });
  };

  const submitTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "submitted" } : task
      )
    );
    enqueueSnackbar("Task submitted for approval", { variant: "info" });
  };

  const approveTask = (taskId, comments) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "approved", adminComments: comments }
          : task
      )
    );
    enqueueSnackbar("Task approved", { variant: "success" });
  };

  const rejectTask = (taskId, comments) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "rejected", adminComments: comments }
          : task
      )
    );
    enqueueSnackbar("Task rejected", { variant: "error" });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        submitTask,
        approveTask,
        rejectTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
