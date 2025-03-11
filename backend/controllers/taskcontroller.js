import Task from "../models/Task.js"; // Ensure this file exists

// Add Task
export const addTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const newTask = new Task({ title, user: req.user.id });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
};

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Update Task Order (for drag and drop)
export const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    for (let i = 0; i < tasks.length; i++) {
      await Task.findByIdAndUpdate(tasks[i]._id, { order: i });
    }

    res.json({ message: "Task order updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating task order", error: error.message });
  }
};
