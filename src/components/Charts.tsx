import { useId } from "react";
import { useReducedMotion } from "motion/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
export const colors = ["#7263ee", "#b1a5ff", "#d1c9fc", "#e6e2fc"];
export function Chart({
  data,
  metric = "revenue",
  type = "area",
  height = 255,
}: {
  data: object[];
  metric?: string;
  type?: string;
  height?: number;
}) {
  const reduced = useReducedMotion();
  const gradientId = useId().replaceAll(":", "");
  const animation = {
    isAnimationActive: !reduced,
    animationDuration: 600,
    animationBegin: 0,
  };
  const axes = (
    <>
      <CartesianGrid
        strokeDasharray="3 5"
        vertical={false}
        stroke="var(--border)"
      />
      <XAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tick={{ fontSize: 11, fill: "#9297a8" }}
        dy={10}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        width={49}
        tick={{ fontSize: 11, fill: "#9297a8" }}
        tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
      />
      <Tooltip
        contentStyle={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
        }}
      />
    </>
  );
  return (
    <div
      role="img"
      aria-label={`${metric} ${type} chart`}
      style={{ height, width: "100%", minWidth: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === "donut" || type === "pie" ? (
          <PieChart>
            <Pie
              {...animation}
              data={data}
              dataKey={metric}
              nameKey="name"
              innerRadius={type === "donut" ? "65%" : 0}
              outerRadius="90%"
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : type === "bar" ? (
          <BarChart data={data}>
            {axes}
            <Bar
              {...animation}
              dataKey={metric}
              fill="#8474ef"
              radius={[5, 5, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        ) : type === "scatter" ? (
          <ScatterChart>
            {axes}
            <Scatter {...animation} data={data} fill="#8675ee" />
          </ScatterChart>
        ) : type === "line" ? (
          <LineChart data={data}>
            {axes}
            <Line
              {...animation}
              type="monotone"
              dataKey={metric}
              stroke="#8171ed"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9788f5" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#9788f5" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            {axes}
            <Area
              {...animation}
              type="monotone"
              dataKey={metric}
              stroke="#8977f1"
              strokeWidth={2.7}
              fill={`url(#${gradientId})`}
            />
            <Area
              {...animation}
              type="monotone"
              dataKey="expenses"
              stroke="#c0c7d6"
              strokeDasharray="5 5"
              fill="transparent"
              strokeWidth={1.7}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
