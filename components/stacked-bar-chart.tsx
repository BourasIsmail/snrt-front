"use client"

import { useState, useEffect } from "react"
import {
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import type { UniteTypeCount } from "@/app/api/dashboard"

interface StackedBarChartProps {
    data: UniteTypeCount[]
}

interface ProcessedData {
    uniteName: string
    [key: string]: string | number
}

export function StackedBarChart({ data }: StackedBarChartProps) {
    const [processedData, setProcessedData] = useState<ProcessedData[]>([])
    const [types, setTypes] = useState<string[]>([])

    useEffect(() => {
        if (data.length === 0) return

        const uniqueTypes = Array.from(new Set(data.map((item) => item.typeName)))
        const uniqueUnites = Array.from(new Set(data.map((item) => item.uniteName)))

        const processed = uniqueUnites.map((unite) => {
            const uniteData: ProcessedData = { uniteName: unite }
            uniqueTypes.forEach((type) => {
                uniteData[type] = 0
            })
            data.forEach((item) => {
                if (item.uniteName === unite) {
                    uniteData[item.typeName] = item.count
                }
            })
            return uniteData
        })

        setProcessedData(processed)
        setTypes(uniqueTypes)
    }, [data])

    // Using the same vibrant color palette as the pie chart
    const COLORS = [
        "#2563eb", // Blue
        "#dc2626", // Red
        "#16a34a", // Green
        "#ca8a04", // Yellow
        "#9333ea", // Purple
    ]

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="uniteName" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                />
                <Legend />
                {types.map((type, index) => (
                    <Bar
                        key={type}
                        dataKey={type}
                        stackId="a"
                        fill={COLORS[index % COLORS.length]}
                        name={type}
                        stroke="#ffffff"
                        strokeWidth={1}
                        className="drop-shadow-sm"
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    )
}

