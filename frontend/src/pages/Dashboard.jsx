import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchTasks, addTask, deleteTask, updateTask } from '../api';
import { CheckCircle2, Circle, Moon, Sun, Trash2, Plus, Edit } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const task = await addTask(newTask);
      setTasks([...tasks, task]);
      setNewTask('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task =>
      task._id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (id, title) => {
    setEditingTaskId(id);
    setEditedTaskTitle(title);
  };

  const handleUpdateTask = async (id) => {
    if (!editedTaskTitle.trim()) return;
    try {
      const updatedTask = await updateTask(id, editedTaskTitle);
      setTasks(tasks.map(task =>
        task._id === id ? { ...task, title: updatedTask.title } : task
      ));
      setEditingTaskId(null);
      setEditedTaskTitle('');
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-300 font-sans`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide cursor-pointer hover:text-blue-400 transition-colors">Task Manager</h1>
          <div className="flex gap-4 items-center">
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all">
              Logout
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition-all hover:scale-110">
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
            </button>
          </div>
        </div>

        <div className="flex mb-4 gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task..."
            className="border p-3 w-full rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 text-white focus:ring-2 focus:ring-blue-400 transition-all"
          />
          <button onClick={handleAddTask} className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2 transition-all hover:scale-105">
            <Plus /> Add
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          {['all', 'pending', 'completed'].map(type => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer hover:scale-110 ${filter === type ? 'bg-blue-500 text-white' : 'bg-gray-400 dark:bg-gray-700 text-white'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {getFilteredTasks().map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center p-4 rounded-lg shadow-md bg-gray-800 dark:bg-gray-700 border border-gray-600 dark:border-gray-700 transition-all hover:shadow-lg"
                      >
                        <button onClick={() => toggleTaskCompletion(task._id)} className="transition-all hover:scale-110">
                          {task.completed ? <CheckCircle2 className="text-green-400" /> : <Circle className="text-gray-300" />}
                        </button>
                        {editingTaskId === task._id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editedTaskTitle}
                              onChange={(e) => setEditedTaskTitle(e.target.value)}
                              className="flex-1 px-4 text-lg text-white bg-gray-700 border-b-2 border-blue-400 focus:outline-none"
                            />
                            <button onClick={() => handleUpdateTask(task._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-all hover:scale-110">
                              Submit
                            </button>
                          </div>
                        ) : (
                          <p className={`flex-1 px-4 text-lg text-white ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => handleEditTask(task._id, task.title)} className="text-blue-400 hover:text-blue-500 transition-all hover:scale-110">
                            <Edit />
                          </button>
                          <button onClick={() => handleDeleteTask(task._id)} className="text-red-400 hover:text-red-500 transition-all hover:scale-110">
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
