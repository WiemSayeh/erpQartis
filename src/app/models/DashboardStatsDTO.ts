import { OrderDTO } from "./OrderDTO";

export interface DashboardStatsDTO {
  activeCustomersCount: number;
  inventoryValue: number;
  latestOrders: OrderDTO[];
  lowStockAlerts: number;
  monthlySalesTrend: { [key: string]: number };
  ordersCount: number;
  outOfStockCount: number;
  revenueGrowthPercentage: number;
  salesByCategory: { [key: string]: number };
  totalRevenue: number;
}
