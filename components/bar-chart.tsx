"use client"

import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BarChartProps {
    data: any[]
    xKey: string
    yKey: string
}

export function BarChart({ data, xKey, yKey }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
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
                <Bar
                    dataKey={yKey}
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    stroke="#ffffff"
                    strokeWidth={1}
                    className="drop-shadow-sm"
                />
            </RechartsBarChart>
        </ResponsiveContainer>
    )
}

