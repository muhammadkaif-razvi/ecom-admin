"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: {
    name: string;
    total: number;
  }[];
}
const Overview:React.FC<OverviewProps> = (data) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
<BarChart data={data.data}>
  <XAxis 
  dataKey={"name"}
  stroke="#888888"
  fontSize={12}
  tickLine={false}
  axisLine={false}
  />
  <YAxis
  dataKey={"total"}
  stroke="#888888"
  fontSize={12}
  tickLine={false}
  axisLine={false}
  tickFormatter={(value) => `${value}`}
  />

<Bar dataKey="total" fill="#1d4ed" radius={[4, 4, 0, 0]}/>
</BarChart>
    </ResponsiveContainer>
  )
}

export default Overview