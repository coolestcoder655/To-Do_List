import { Trash, CheckCircle, Circle, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import EmptyContextMenu from "./components/EmptyContextMenu";
import TaskContextMenu from "./components/TaskContextMenu";

const initialTasks: Task[] = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
];

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [trash, setTrash] = useState<Task[]>([]);
  const [trashOpen, setTrashOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  const [contextMenu, setContextMenu] = useState<{
    type: "task" | "empty" | null;
    x: number;
    y: number;
    taskId?: number;
  }>({ type: null, x: 0, y: 0 });

  // Filter tasks based on showCompletedTasks setting
  const visibleTasks = showCompletedTasks
    ? tasks
    : tasks.filter((task) => !task.completed);
  const completedTasksCount = tasks.filter((task) => task.completed).length;

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addNewTask = () => {
    const taskTitle = prompt("Enter task title:");
    if (!taskTitle) return;
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([
      ...tasks,
      { id: newId, title: `${taskTitle}`, completed: false },
    ]);
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const deleteTask = (taskId: number) => {
    setTrash([...trash, tasks.find((task) => task.id === taskId)!]);
    setTasks(tasks.filter((task) => task.id !== taskId));
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const completeTask = (taskId: number) => {
    toggleTask(taskId);
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const editTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newTitle = prompt("Edit task title:", task.title);
    if (newTitle && newTitle.trim() !== "") {
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, title: newTitle.trim() } : t
        )
      );
    }
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const toggleShowCompleted = () => {
    setShowCompletedTasks(!showCompletedTasks);
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const openSettings = () => {
    setSettingsOpen(true);
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  const handleContainerRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      type: "empty",
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleTaskRightClick = (e: React.MouseEvent, taskId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      type: "task",
      x: e.clientX,
      y: e.clientY,
      taskId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ type: null, x: 0, y: 0 });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = () => {
      closeContextMenu();
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Close modals when pressing ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (trashOpen) {
          setTrashOpen(false);
        } else if (settingsOpen) {
          setSettingsOpen(false);
        } else {
          closeContextMenu();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [trashOpen, settingsOpen]);
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden"
      onContextMenu={handleContainerRightClick}
    >
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            OnTrack | To-Do List
          </h1>
          <button
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={() => setTrashOpen(!trashOpen)}
          >
            <Trash size={18} />
            <span className="text-sm font-medium">{trash.length}</span>
          </button>
        </div>

        {/* Tasks Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-[60vh]">
          {visibleTasks.length > 0 ? (
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[60vh]">
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    task.completed
                      ? "bg-green-50 border-l-4 border-green-400"
                      : "hover:bg-indigo-50"
                  }`}
                  onContextMenu={(e) => handleTaskRightClick(e, task.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div
                      className="flex items-center gap-4 flex-1"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle className="text-green-500 w-6 h-6" />
                      ) : (
                        <Circle className="text-gray-400 w-6 h-6" />
                      )}
                      <span
                        className={`text-lg ${
                          task.completed
                            ? "text-green-700 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      title="Delete task"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              {tasks.length === 0 ? (
                <>
                  <p className="text-xl text-gray-500 mb-4">No tasks yet</p>
                  <p className="text-gray-400">
                    Right-click anywhere to add your first task!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl text-gray-500 mb-4">
                    All tasks completed!
                  </p>
                  <p className="text-gray-400">
                    Right-click and select "Show Completed" to see completed
                    tasks
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Completed Tasks Status Bar */}
        {!showCompletedTasks && completedTasksCount > 0 && (
          <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500 w-5 h-5" />
                  <span className="text-green-700 font-medium">
                    {completedTasksCount} completed task
                    {completedTasksCount === 1 ? "" : "s"} hidden
                  </span>
                </div>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  onClick={toggleShowCompleted}
                >
                  Show Completed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trash Modal */}
        {trashOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">🗑️ Trash</h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setTrashOpen(false)}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {trash.length > 0 ? (
                  <div className="space-y-4">
                    {trash.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <span className="text-gray-700 flex-1">
                          {task.title}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            onClick={() => {
                              setTrash(trash.filter((t) => t.id !== task.id));
                            }}
                          >
                            Delete Forever
                          </button>
                          <button
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                            onClick={() => {
                              setTasks([...tasks, task]);
                              setTrash(trash.filter((t) => t.id !== task.id));
                            }}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🗑️</div>
                    <p className="text-gray-500">Trash is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {settingsOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Settings className="text-gray-600" size={24} />
                  Settings
                </h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setSettingsOpen(false)}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                {/* Display Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Display Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-700">
                          Show Completed Tasks
                        </p>
                        <p className="text-sm text-gray-500">
                          Display completed tasks in the task list
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          showCompletedTasks ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                        onClick={toggleShowCompleted}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showCompletedTasks
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Task Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                      <p className="text-2xl font-bold text-indigo-600">
                        {tasks.length}
                      </p>
                      <p className="text-sm text-indigo-600">Total Tasks</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <p className="text-2xl font-bold text-green-600">
                        {completedTasksCount}
                      </p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                      <p className="text-2xl font-bold text-orange-600">
                        {tasks.length - completedTasksCount}
                      </p>
                      <p className="text-sm text-orange-600">Pending</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                      <p className="text-2xl font-bold text-red-600">
                        {trash.length}
                      </p>
                      <p className="text-sm text-red-600">In Trash</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to mark all tasks as complete?"
                          )
                        ) {
                          setTasks(
                            tasks.map((task) => ({ ...task, completed: true }))
                          );
                        }
                      }}
                    >
                      <span className="font-medium text-gray-700">
                        Complete All Tasks
                      </span>
                      <CheckCircle className="text-green-500" size={20} />
                    </button>
                    <button
                      className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to clear all completed tasks? This will move them to trash."
                          )
                        ) {
                          const completedTasks = tasks.filter(
                            (task) => task.completed
                          );
                          setTrash([...trash, ...completedTasks]);
                          setTasks(tasks.filter((task) => !task.completed));
                        }
                      }}
                    >
                      <span className="font-medium text-red-700">
                        Clear Completed Tasks
                      </span>
                      <Trash className="text-red-500" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Context Menus */}
        {contextMenu.type === "empty" && (
          <EmptyContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onSettings={openSettings}
            onAddNewTask={addNewTask}
            onShowCompleted={toggleShowCompleted}
            showCompleted={showCompletedTasks}
          />
        )}

        {contextMenu.type === "task" && contextMenu.taskId && (
          <TaskContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            isCompleted={
              tasks.find((task) => task.id === contextMenu.taskId)?.completed
            }
            onCompleteTask={() => completeTask(contextMenu.taskId!)}
            onDeleteTask={() => deleteTask(contextMenu.taskId!)}
            onEditTask={() => editTask(contextMenu.taskId!)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
