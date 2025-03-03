"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"

interface PieChartProps {
    data: any[]
    nameKey: string
    dataKey: string
}

// Using a more vibrant and distinct color palette
const COLORS = [
    "#2563eb", // Blue
    "#dc2626", // Red
    "#16a34a", // Green
    "#ca8a04", // Yellow
    "#9333ea", // Purple
    "#0891b2", // Cyan
    "#ea580c", // Orange
    "#be185d", // Pink
]

export function PieChart({ data, nameKey, dataKey }: PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey={dataKey}
                    nameKey={nameKey}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    strokeWidth={2}
                    stroke="#ffffff"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-md" />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [`${value}`, "Nombre"]}
                    labelFormatter={(label) => `${label}`}
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    )
}

