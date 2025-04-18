
import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieProps,
} from "recharts";

interface ChartProps {
  data: any[];
  width?: number | string;
  height?: number | string;
  className?: string;
}

interface BarChartProps extends ChartProps {
  xDataKey: string;
  barDataKey: string;
  barColor?: string;
}

interface LineChartProps extends ChartProps {
  xDataKey: string;
  lineDataKey: string;
  lineColor?: string;
}

interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

export const BarChart = ({
  data,
  width = "100%",
  height = 300,
  className,
  xDataKey,
  barDataKey,
  barColor = "#3B82F6",
}: BarChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={barDataKey} fill={barColor} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChart = ({
  data,
  width = "100%",
  height = 300,
  className,
  xDataKey,
  lineDataKey,
  lineColor = "#3B82F6",
}: LineChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={lineDataKey}
            stroke={lineColor}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart = ({
  data,
  width = "100%",
  height = 300,
  className,
  dataKey,
  nameKey,
  colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
}: PieChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
