import { Plus, Eye, Settings } from "lucide-react";

interface EmptyContextMenuProps {
  x: number;
  y: number;
  onAddNewTask: () => void;
  onShowCompleted: () => void;
  onSettings: () => void;
  showCompleted: boolean;
}

const EmptyContextMenu = ({
  x,
  y,
  onAddNewTask,
  onShowCompleted,
  onSettings,
  showCompleted,
}: EmptyContextMenuProps) => {
  return (
    <div
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-52 z-[9999]"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors text-gray-700 hover:text-indigo-600"
        onClick={(e) => {
          e.stopPropagation();
          onAddNewTask();
        }}
      >
        <Plus size={16} className="text-indigo-500" />
        <span className="font-medium">Add New Task</span>
      </button>{" "}
      <button
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors text-gray-700 hover:text-purple-600"
        onClick={(e) => {
          e.stopPropagation();
          onShowCompleted();
        }}
      >
        <Eye size={16} className="text-purple-500" />
        <span className="font-medium">
          {showCompleted ? "Hide Completed" : "Show Completed"}
        </span>
      </button>
      <hr className="my-2 border-gray-200" />{" "}
      <button
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onSettings();
        }}
      >
        <Settings size={16} className="text-gray-500" />
        <span className="font-medium">Settings</span>
      </button>
    </div>
  );
};

export default EmptyContextMenu;
