

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { month: string; revenue: number }[];
}

const RevenueBarChart = ({ data }: Props) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Monthly Subscription Revenue
        </h3>
        <p className="text-sm text-gray-500">
          Revenue distribution by month
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="2 6" />

          {/* Month names shown here */}
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value?: number) => [
              `₹ ${(value ?? 0).toLocaleString()}`,
              "Revenue",
            ]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: 600, color: "#0f172a" }}
          />

          <Bar
            dataKey="revenue"
            radius={[6, 6, 0, 0]}
            fill="#0ea5e9"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;
