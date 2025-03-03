"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getDashboardData,
  getDashboardByType,
  getDashboardByUnite,
  getDashboardByUniteAndType,
  type DashboardData,
  type TypeCount,
  type UniteCount,
  type UniteTypeCount,
} from "../api/dashboard"
import { Loader2 } from "lucide-react"
import { PieChart } from "@/components/pie-chart"
import { BarChart } from "@/components/bar-chart"
import { DataTable } from "@/components/data-table"
import { StackedBarChart } from "@/components/stacked-bar-chart"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [typeData, setTypeData] = useState<TypeCount[]>([])
  const [uniteData, setUniteData] = useState<UniteCount[]>([])
  const [uniteTypeData, setUniteTypeData] = useState<UniteTypeCount[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [summaryData, byType, byUnite, byUniteAndType] = await Promise.all([
          getDashboardData(),
          getDashboardByType(),
          getDashboardByUnite(),
          getDashboardByUniteAndType(),
        ])

        setDashboardData(summaryData)
        setTypeData(byType)
        setUniteData(byUnite)
        setUniteTypeData(byUniteAndType)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <SummaryCard title="Matériels" value={dashboardData?.materielsCount || 0} />
          <SummaryCard title="Unités" value={dashboardData?.unitesCount || 0} />
          <SummaryCard title="Utilisateurs" value={dashboardData?.usersCount || 0} />
          <SummaryCard title="Rôles" value={dashboardData?.rolesCount || 0} />
          <SummaryCard title="Types" value={dashboardData?.typesCount || 0} />
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="tables">Tableaux</TabsTrigger>
          </TabsList>

          <TabsContent value="charts">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Materials by Type Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Matériels par Type</CardTitle>
                  <CardDescription>Distribution des matériels par type</CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart data={typeData} nameKey="typeName" dataKey="count" />
                </CardContent>
              </Card>

              {/* Materials by Unite Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Matériels par Unité</CardTitle>
                  <CardDescription>Distribution des matériels par unité</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={uniteData} xKey="uniteName" yKey="count" />
                </CardContent>
              </Card>

              {/* Materials by Unite and Type Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Matériels par Unité et Type</CardTitle>
                  <CardDescription>Distribution des matériels par unité et type</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <StackedBarChart data={uniteTypeData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tables">
            <div className="grid gap-6">
              {/* Materials by Type Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Matériels par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                      data={typeData}
                      columns={[
                        { header: "Type", accessorKey: "typeName" },
                        { header: "Nombre", accessorKey: "count" },
                      ]}
                  />
                </CardContent>
              </Card>

              {/* Materials by Unite Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Matériels par Unité</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                      data={uniteData}
                      columns={[
                        { header: "Unité", accessorKey: "uniteName" },
                        { header: "Nombre", accessorKey: "count" },
                      ]}
                  />
                </CardContent>
              </Card>

              {/* Materials by Unite and Type Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Matériels par Unité et Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                      data={uniteTypeData}
                      columns={[
                        { header: "Unité", accessorKey: "uniteName" },
                        { header: "Type", accessorKey: "typeName" },
                        { header: "Nombre", accessorKey: "count" },
                      ]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
  )
}