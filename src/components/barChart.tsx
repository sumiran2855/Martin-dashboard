// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

// interface DataPoint {
//   hour: string;
//   base: number;
//   middle: number;
//   top: number;
// }

// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

//     return (
//       <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
//         <p className="font-medium text-gray-700">{`Hour ${payload[0].payload.hour}`}</p>
//         <p className="text-sm text-gray-600">{`Total: ${total.toFixed(2)} kW/h`}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }} className="text-xs">
//             {`${entry.name}: ${entry.value?.toFixed(2)} kW/h`}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// const ConsumptionChart: React.FC = () => {
//   const data: DataPoint[] = [
//     { hour: '1', base: 1.5, middle: 2.5, top: 1.0 },
//     { hour: '2', base: 1.5, middle: 1.0, top: 0.8 },
//     { hour: '3', base: 1.5, middle: 0.7, top: 0.5 },
//     { hour: '4', base: 1.5, middle: 2.5, top: 0.9 },
//     { hour: '5', base: 1.5, middle: 2.0, top: 0.8 },
//     { hour: '6', base: 1.5, middle: 2.0, top: 0.6 },
//     { hour: '7', base: 1.5, middle: 0.8, top: 0.4 },
//     { hour: '8', base: 1.5, middle: 1.0, top: 0.6 },
//     { hour: '9', base: 1.5, middle: 0.8, top: 0.5 },
//     { hour: '10', base: 1.5, middle: 1.2, top: 0.8 },
//     { hour: '11', base: 1.5, middle: 2.2, top: 1.0 },
//     { hour: '12', base: 1.5, middle: 2.3, top: 0.8 },
//     { hour: '13', base: 1.5, middle: 2.0, top: 0.7 },
//     { hour: '14', base: 1.5, middle: 1.8, top: 1.2 },
//     { hour: '15', base: 1.5, middle: 1.0, top: 0.9 },
//     { hour: '16', base: 1.5, middle: 2.0, top: 0.8 },
//     { hour: '17', base: 1.5, middle: 1.5, top: 0.5 },
//     { hour: '18', base: 1.5, middle: 0.8, top: 0.4 },
//     { hour: '19', base: 1.5, middle: 0.6, top: 0.5 },
//     { hour: '20', base: 1.5, middle: 0.8, top: 0.4 },
//     { hour: '21', base: 1.5, middle: 0.6, top: 0.5 },
//     { hour: '22', base: 1.5, middle: 0.9, top: 0.6 },
//     { hour: '23', base: 1.5, middle: 1.8, top: 0.8 },
//     { hour: '24', base: 1.5, middle: 2.2, top: 0.9 },
//   ];

//   return (
//     <div className="p-4 rounded-lg w-full h-96">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
//           barSize={16}
//         >
//           <CartesianGrid vertical={false} stroke="#f0f0f0" />
//           <XAxis
//             dataKey="hour"
//             axisLine={false}
//             tickLine={false}
//             tick={{ fontSize: 12, fill: '#666' }}
//             label={{ value: 'Tid', position: 'insideBottom', offset: -20, fontSize: 12, fill: '#666' }}
//           />
//           <YAxis
//             axisLine={false}
//             tickLine={false}
//             tick={{ fontSize: 12, fill: '#666' }}
//             tickFormatter={(value) => `${value.toFixed(1)}`}
//             label={{ value: 'kW/h', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: '#666' }}
//             domain={[0, 6]}
//             ticks={[0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0]}
//           />
//           <Tooltip content={<CustomTooltip />} />
//           <Bar dataKey="base" stackId="a" fill="#002D62" name="Base Load" />
//           <Bar dataKey="middle" stackId="a" fill="#4682B4" name="Mid Load" />
//           <Bar dataKey="top" stackId="a" fill="#B0C4DE" name="Peak Load" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ConsumptionChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  AreaChart,
  Area,
} from "recharts";

interface DataPoint {
  hour: string;
  base: number;
  middle: number;
  top: number;
  highlight: boolean;
}

const data: DataPoint[] = [
  { hour: "1", base: 1.5, middle: 2.5, top: 1.0, highlight: true },
  { hour: "2", base: 1.5, middle: 1.0, top: 0.8, highlight: false },
  { hour: "3", base: 1.5, middle: 0.7, top: 0.5, highlight: false },
  { hour: "4", base: 1.5, middle: 2.5, top: 0.9, highlight: true },
  { hour: "5", base: 1.5, middle: 2.0, top: 0.8, highlight: true },
  { hour: "6", base: 1.5, middle: 2.0, top: 0.6, highlight: true },
  { hour: "7", base: 1.5, middle: 0.8, top: 0.4, highlight: false },
  { hour: "8", base: 1.5, middle: 1.0, top: 0.6, highlight: false },
  { hour: "9", base: 1.5, middle: 0.8, top: 0.5, highlight: false },
  { hour: "10", base: 1.5, middle: 1.2, top: 0.8, highlight: false },
  { hour: "11", base: 1.5, middle: 2.2, top: 1.0, highlight: true },
  { hour: "12", base: 1.5, middle: 2.3, top: 0.8, highlight: true },
  { hour: "13", base: 1.5, middle: 2.0, top: 0.7, highlight: true },
  { hour: "14", base: 1.5, middle: 1.8, top: 1.2, highlight: true },
  { hour: "15", base: 1.5, middle: 1.0, top: 0.9, highlight: true },
  { hour: "16", base: 1.5, middle: 2.0, top: 0.8, highlight: true },
  { hour: "17", base: 1.5, middle: 1.5, top: 0.5, highlight: true },
  { hour: "18", base: 1.5, middle: 0.8, top: 0.4, highlight: false },
  { hour: "19", base: 1.5, middle: 0.6, top: 0.5, highlight: false },
  { hour: "20", base: 1.5, middle: 0.8, top: 0.4, highlight: false },
  { hour: "21", base: 1.5, middle: 0.6, top: 0.5, highlight: false },
  { hour: "22", base: 1.5, middle: 0.9, top: 0.6, highlight: false },
  { hour: "23", base: 1.5, middle: 1.8, top: 0.8, highlight: true },
  { hour: "24", base: 1.5, middle: 2.2, top: 0.9, highlight: true },
];

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
        <p className="font-medium text-gray-700">{`Hour ${payload[0].payload.hour}`}</p>
        <p className="text-sm text-gray-600">{`Total: ${total.toFixed(
          2
        )} kW/h`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {`${entry.name}: ${entry.value.toFixed(2)} kW/h`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EnhancedEnergyConsumptionChart: React.FC = () => {
  return (
    <div className=" p-4 rounded-lg w-full h-96 ">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          barSize={16}
        >
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#666" }}
            label={{
              value: "Tid",
              position: "insideBottom",
              offset: -20,
              fontSize: 12,
              fill: "#666",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#666" }}
            tickFormatter={(value) => `${value.toFixed(1)}`}
            label={{
              value: "kW/h",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              fontSize: 12,
              fill: "#666",
            }}
            domain={[0, 6]}
            ticks={[0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0]}
          />
          <Tooltip content={<CustomTooltip />} />

          <defs>
            <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.9)" />
              <stop offset="100%" stopColor="rgba(255, 215, 0, 0.3)" />
            </linearGradient>
          </defs>
          {data
            .filter((entry) => entry.highlight)
            .map((entry, index) => (
              <ReferenceArea
                key={index}
                x1={entry.hour}
                x2={String(Number(entry.hour) + 1)}
                y1={1.2}
                y2={0}
                fill="url(#yellowGradient)"
                // stroke="#DAA520"
                strokeWidth={2}
                ifOverflow="extendDomain"
              />
            ))}

          <Bar dataKey="base" stackId="a" fill="#002D62" name="Base Load" />
          <Bar dataKey="middle" stackId="a" fill="#4682B4" name="Mid Load" />
          <Bar dataKey="top" stackId="a" fill="#B0C4DE" name="Peak Load" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedEnergyConsumptionChart;
