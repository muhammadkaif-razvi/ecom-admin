"use client";

import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getDailyRevenue, getWeeklyRevenue } from "@/actions/get-revenue-graphs";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/auth";
import { formatter } from "@/lib/utils";
import { IndianRupee, Package, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

async function DashboardPage(props: DashboardPageProps) {
  const params = await props.params;
  const { storeId } = await params;
  const user = await currentUser();

  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  const dailyRevenueData = await getDailyRevenue(storeId);
  const weeklyRevenueData = await getWeeklyRevenue(storeId);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-14">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(Number(totalRevenue?.totalRevenue))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>Monthly Revenue</CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>Daily Revenue Overview</CardHeader>
            <CardContent className="pl-2">
              <Overview data={dailyRevenueData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>Weekly Revenue Overview</CardHeader>
            <CardContent className="pl-2">
              <Overview data={weeklyRevenueData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;