import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#9CA3AF", "#60A5FA", "#FACC15", "#4ADE80"];

function TaskStatusChart({ stats }) {

  if (!stats) return null;

  const data = [
    { name: "Todo", value: stats.tasksByStatus.todo },
    { name: "In Progress", value: stats.tasksByStatus.in_progress },
    { name: "Review", value: stats.tasksByStatus.review },
    { name: "Done", value: stats.tasksByStatus.done }
  ];

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-3">Task Status Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >

            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TaskStatusChart;