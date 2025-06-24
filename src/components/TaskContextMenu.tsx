import { CheckCircle, XCircle, Trash2, Edit } from "lucide-react";

interface TaskContextMenuProps {
  x: number;
  y: number;
  isCompleted?: boolean;
  onCompleteTask: () => void;
  onDeleteTask: () => void;
  onEditTask: () => void;
}

const TaskContextMenu = ({
  x,
  y,
  isCompleted = false,
  onCompleteTask,
  onDeleteTask,
  onEditTask,
}: TaskContextMenuProps) => {
  return (
    <div
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-52 z-[9999]"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        className={`flex items-center gap-3 w-full text-left px-4 py-3 transition-colors font-medium ${
          isCompleted
            ? "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
            : "hover:bg-green-50 text-gray-700 hover:text-green-600"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onCompleteTask();
        }}
      >
        {isCompleted ? (
          <>
            <XCircle size={16} className="text-orange-500" />
            <span>Mark as Incomplete</span>
          </>
        ) : (
          <>
            <CheckCircle size={16} className="text-green-500" />
            <span>Mark as Complete</span>
          </>
        )}
      </button>
      <button
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 font-medium"
        onClick={(e) => {
          e.stopPropagation();
          onEditTask();
        }}
      >
        <Edit size={16} className="text-blue-500" />
        <span>Edit Task</span>
      </button>
      <hr className="my-2 border-gray-200" />
      <button
        className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-50 transition-colors text-gray-700 hover:text-red-600 font-medium"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTask();
        }}
      >
        <Trash2 size={16} className="text-red-500" />
        <span>Delete Task</span>
      </button>
    </div>
  );
};

export default TaskContextMenu;
