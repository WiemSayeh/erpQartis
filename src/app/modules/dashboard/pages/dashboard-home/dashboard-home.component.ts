import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardStatsDTO } from 'src/app/models/DashboardStatsDTO';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  notifications: any[] = [];
showNotification = false;
latestNotification: any = null;
  stats: DashboardStatsDTO | null = null;
  isLoaded = false;

  // --- Configuration Ligne (Ventes) ---
  public lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  // --- Configuration Donut (Marques) - CORRECTION CUTOUT ICI ---
  public doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Désormais accepté grâce au typage <'doughnut'>
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
    }
  };

 constructor(
  private dashboardService: DashboardService,
  private notificationService: NotificationService
) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.notificationService.connect();

this.notificationService.notification$
.subscribe(notification => {

  if (notification) {

    this.latestNotification = notification;

    this.notifications.unshift(notification);

  this.notificationService.notification$
.subscribe(notification => {

  if (!notification) return;

  this.latestNotification = notification;
  this.notifications.unshift(notification);

  this.showNotification = true;
});
  }
});
  }

  private loadDashboardData(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.prepareCharts();
      },
      error: (err) => console.error("Erreur API Dashboard:", err)
    });
  }

  private prepareCharts(): void {
    if (!this.stats) return;

    // Remplissage du graphique de tendance (Revenus de 3M TND)
    this.lineChartData = {
      labels: Object.keys(this.stats.monthlySalesTrend),
      datasets: [{
        data: Object.values(this.stats.monthlySalesTrend),
        label: 'Revenu Mensuel',
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    // Remplissage du graphique des marques (Volkswagen, Bosch...)
    this.doughnutChartData = {
      labels: Object.keys(this.stats.salesByCategory),
      datasets: [{
        data: Object.values(this.stats.salesByCategory),
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        hoverOffset: 4
      }]
    };

    this.isLoaded = true;
  }
  closeNotification(): void {
  this.showNotification = false;
  this.latestNotification = null;
}
}
