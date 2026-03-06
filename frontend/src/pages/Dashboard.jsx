import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskStatusChart from "../components/TaskStatusChart";
import TaskPriorityChart from "../components/TaskPriorityChart";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    assigned_to: "",
    due_date: ""
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/summary");
      setStats(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createTask = async () => {
    try {

      await API.post("/tasks/create", form);

      setForm({
        title: "",
        description: "",
        priority: "low",
        assigned_to: "",
        due_date: ""
      });

      fetchTasks();
      fetchStats();

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/status/${id}`, { status });
    fetchStats();
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleDragEnd = async (result) => {

  if (!result.destination) return;

  const taskId = result.draggableId;
  const newStatus = result.destination.droppableId;

 
  setTasks((prev) =>
    prev.map((task) =>
      String(task.id) === taskId
        ? { ...task, status: newStatus }
        : task
    )
  );

  try {

    await API.put(`/tasks/status/${taskId}`, {
      status: newStatus
    });

    
    fetchTasks();
    fetchStats();

  } catch (err) {

    console.log(err);

    
    fetchTasks();

  }

};

  const filterTasks = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const generateDescription = async () => {

    if (!form.title) {
      alert("Enter title first");
      return;
    }

    try {

      const res = await API.post("/ai/generate-description", {
        title: form.title
      });

      setForm({
        ...form,
        description: res.data.description
      });

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">

        <h1 className="text-3xl font-bold mb-6">Task Flow Manager</h1>

        {/* Dashboard Stats */}

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.totalTasks}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Tasks Due Soon</p>
              <p className="text-2xl font-bold">{stats.tasksDueSoon}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{stats.tasksByStatus.done}</p>
            </div>

          </div>
        )}

        {stats && (role === "admin" || role === "super_admin") && (
  <div className="grid md:grid-cols-2 gap-6 mb-6">

    <TaskStatusChart stats={stats} />

    <TaskPriorityChart stats={stats} />

  </div>
)}

        {/* Create Task */}

        {(role === "admin" || role === "super_admin") && (

          <div className="bg-white p-4 rounded shadow mb-6">

            <h2 className="text-xl mb-3">Create Task</h2>

            <div className="grid grid-cols-2 gap-3">

              <input
                name="title"
                value={form.title}
                placeholder="Title"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <div className="flex gap-2">

                <input
                  name="description"
                  value={form.description}
                  placeholder="Description"
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />

                <button
                  onClick={generateDescription}
                  className="bg-purple-600 text-white px-3 rounded"
                >
                  AI
                </button>

              </div>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="mid">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                name="assigned_to"
                value={form.assigned_to}
                placeholder="Assigned User ID"
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="border p-2 rounded"
              />

            </div>

            <button
              onClick={createTask}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>

          </div>

        )}

        {/* Drag & Drop */}

        <DragDropContext onDragEnd={handleDragEnd}>

          <div className="grid grid-cols-4 gap-4">

            {["todo", "in_progress", "review", "done"].map((status) => (

              <Droppable droppableId={status} key={status}>

                {(provided, snapshot) => (

                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 rounded min-h-62.5 transition ${
                      snapshot.isDraggingOver
                        ? "bg-blue-200"
                        : status === "todo"
                        ? "bg-gray-100"
                        : status === "in_progress"
                        ? "bg-blue-100"
                        : status === "review"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                    }`}
                  >

                    <h2 className="font-bold mb-2 capitalize flex justify-between">

                      {status.replace("_", " ")}

                      <span className="text-sm bg-white px-2 rounded">
                        {filterTasks(status).length}
                      </span>

                    </h2>

                    {filterTasks(status).map((task, index) => (

                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >

                        {(provided) => (

                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="select-none"
                          >

                            <TaskCard
                              task={task}
                              updateStatus={updateStatus}
                              deleteTask={deleteTask}
                            />

                          </div>

                        )}

                      </Draggable>

                    ))}

                    {provided.placeholder}

                  </div>

                )}

              </Droppable>

            ))}

          </div>

        </DragDropContext>

      </div>
    </>
  );
}

export default Dashboard;