import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#38a169", "#ecc94b", "#e53e3e", "#4299e1", "#718096"];

interface ChartDataItem {
  status: string;
  count: number;
  [key: string]: any;
}

interface Props {
  title: string;
  data: ChartDataItem[];
}

const DashboardBarChart = ({ title, data }: Props) => {
  return (
    <div className="bg-admin-card rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">
        {title} Status Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="status" />
          <YAxis />

          <Tooltip />
          <Legend />

          <Bar dataKey="count">
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardBarChart;