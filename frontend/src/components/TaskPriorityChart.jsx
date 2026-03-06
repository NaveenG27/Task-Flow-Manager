import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function TaskPriorityChart({ stats }) {

  if (!stats) return null;

  const data = [
    { name: "Low", value: stats.tasksByPriority.low },
    { name: "Medium", value: stats.tasksByPriority.mid },
    { name: "High", value: stats.tasksByPriority.high }
  ];

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-3">Priority Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis dataKey="name" />
          
          <YAxis />
          
          <Tooltip />
          
          <Bar dataKey="value" fill="#6366F1" />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TaskPriorityChart;