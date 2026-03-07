function TaskCard({ task, updateStatus, deleteTask }) {

  const role = localStorage.getItem("role");

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    mid: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-3 border">

      {/* Title + Priority */}
      <div className="flex justify-between items-center">

        <h3 className="font-semibold">
          {task.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${priorityColor[task.priority]}`}
        >
          {task.priority}
        </span>

      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-1">
        {task.description}
      </p>

      {/* Assigned + Due Date */}
<div className="text-xs text-gray-500 mt-2 space-y-1">

  {task.user && (
    <div>
      👤 Assigned: {task.user?.name || "Unassigned"}
    </div>
  )}

  {task.dueDate && (
    <div>
      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
    </div>
  )}

</div>

      {/* Status Buttons */}
      <div className="flex flex-wrap gap-2 mt-3">

        {task.status !== "todo" && (
          <button
            onClick={() => updateStatus(task.id, "todo")}
            className="text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Todo
          </button>
        )}

        {task.status !== "in_progress" && (
          <button
            onClick={() => updateStatus(task.id, "in_progress")}
            className="text-xs bg-blue-200 px-2 py-1 rounded"
          >
            In Progress
          </button>
        )}

        {task.status !== "review" && (
          <button
            onClick={() => updateStatus(task.id, "review")}
            className="text-xs bg-yellow-200 px-2 py-1 rounded"
          >
            Review
          </button>
        )}

        {task.status !== "done" && (
          <button
            onClick={() => updateStatus(task.id, "done")}
            className="text-xs bg-green-200 px-2 py-1 rounded"
          >
            Done
          </button>
        )}

      </div>

      {/* Delete Button (Super Admin Only) */}
      {role === "super_admin" && (
        <button
          onClick={() => deleteTask(task.id)}
          className="mt-3 text-xs bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      )}

    </div>
  );
}

export default TaskCard;