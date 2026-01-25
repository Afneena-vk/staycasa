

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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

const DashboardPieChart = ({ title, data }: Props) => {
  return (
    <div className="bg-admin-card rounded-xl shadow-md p-6">
   
      <h3 className="text-lg font-bold mb-4">{title} Status Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="55%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
       
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardPieChart;
