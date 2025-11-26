import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { fetchTasks } from "../features/taskSlice";
import _ from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CheckCircle,
  Edit,
  PlusSquare,
  CalendarClock,
  Trash2,
  FilePlus,
  FilePen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {number | string} props.value
 * @param {React.ReactNode} props.icon
 * @param {string} props.color
 */
const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <div
    className={`p-4 rounded-lg flex items-start gap-4 bg-white/80 dark:bg-zinc-800/80 transition-colors duration-300`}
  >
    <div className={`p-2 rounded-lg ${color} transition-colors duration-300`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        {title}
      </p>
    </div>
  </div>
);

/**
 * @param {Object} props
 * @param {"add" | "update" | "delete"} props.type
 */
const ActivityIcon = ({ type }) => {
  switch (type) {
    case "add":
      return <FilePlus size={16} className="text-green-500" />;
    case "update":
      return <FilePen size={16} className="text-blue-500" />;
    case "delete":
      return <Trash2 size={16} className="text-red-500" />;
    default:
      return null;
  }
};

export default function DashBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items || []);
  const activities = useSelector((state) => state.tasks.activities || []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const summaryData = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const statusCounts = { Todo: 0, InProgress: 0, Review: 0, Done: 0 };
    const priorityCounts = { Low: 0, Medium: 0, High: 0 };
    let dueSoonCount = 0;

    _.forEach(tasks, (task) => {
      const status = task.status || "";
      const priority = task.priority || "";
      
      if (_.has(statusCounts, status)) {
        statusCounts[status]++;
      }
      if (_.has(priorityCounts, priority)) {
        priorityCounts[priority]++;
      }
      
      const dueDate = new Date(task.endTime);
      if (
        status !== "Done" &&
        dueDate >= now &&
        dueDate <= sevenDaysFromNow
      ) {
        dueSoonCount++;
      }
    });

    const pieData = [
      { name: "Done", value: statusCounts.Done, fill: "#10B981" },
      { name: "In Progress", value: statusCounts.InProgress, fill: "#F59E0B" },
      { name: "In Review", value: statusCounts.Review, fill: "#3B82F6" },
      { name: "To Do", value: statusCounts.Todo, fill: "#EC4899" },
    ];

    const barData = [
      { name: "Low", count: priorityCounts.Low },
      { name: "Medium", count: priorityCounts.Medium },
      { name: "High", count: priorityCounts.High },
    ];

    return {
      totalTasks: _.size(tasks) || 0,
      completedCount: _.get(statusCounts, 'Done', 0),
      dueSoonCount,
      pieData,
      barData,
    };
  }, [tasks]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completed"
          value={summaryData.completedCount}
          icon={<CheckCircle size={24} />}
          color="bg-green-500/50 text-green-500"
        />
        <StatCard
          title="Total Tasks"
          value={summaryData.totalTasks}
          icon={<Edit size={24} />}
          color="bg-yellow-500/50 text-yellow-500"
        />
        <StatCard
          title="To Do"
          value={
            _.get(_.find(summaryData.pieData, (d) => d.name === "To Do"), 'value', 0)
          }
          icon={<PlusSquare size={24} />}
          color="bg-pink-500/50 text-pink-500"
        />
        <StatCard
          title="Due Soon"
          value={summaryData.dueSoonCount}
          icon={<CalendarClock size={24} />}
          color="bg-red-500/50 text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-lg transition-colors duration-300">
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
            Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={summaryData.pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {_.map(summaryData.pieData, (entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: "rgba(128,128,128,0.1)" }} />
              <Legend />
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-3xl font-bold fill-gray-800 dark:fill-white transition-colors duration-300"
              >
                {summaryData.totalTasks}
              </text>
              <text
                x="50%"
                y="58%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-gray-500 dark:fill-gray-400 transition-colors duration-300"
              >
                Total work items
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-lg transition-colors duration-300">
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-[250px] overflow-y-auto">
            {_.map(activities, (activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="text-sm">
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    {activity.details}
                  </p>
                  <p
                    className="font-medium text-gray-800 dark:text-white transition-colors duration-300 truncate"
                    title={activity.taskSummary}
                  >
                    {activity.taskSummary}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
            {_.isEmpty(activities) && (
              <p className="text-sm text-center text-gray-400 py-8">
                No recent activity.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-zinc-800/80 p-6 rounded-lg transition-colors duration-300">
          <h3 className="font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
            Priority Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={summaryData.barData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#9CA3AF" fontSize={12} />
              <Tooltip cursor={{ fill: "rgba(128,128,128,0.1)" }} />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </div>
  );
}
