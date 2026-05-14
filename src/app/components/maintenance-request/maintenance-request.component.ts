import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee';
import { MaintenanceRequest } from 'src/app/models/maintenanceRequest';
import { MaintenanceStatus } from 'src/app/models/maintenanceStatus';
import { MaintenanceRequestService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-maintenance-request',
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.css']
})
export class MaintenanceRequestComponent implements OnInit {
  // Indispensable pour utiliser l'enum dans le HTML sans erreur de type
  readonly Status = MaintenanceStatus;

  requests: MaintenanceRequest[] = [];
  availableMechanics: Employee[] = [];
  loading: boolean = false;

  constructor(private maintenanceService: MaintenanceRequestService) {}

  ngOnInit(): void {
    this.refreshDashboard();
  }

  refreshDashboard(): void {
    this.loading = true;
    this.maintenanceService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.loadMechanics();
      },
      error: (err) => console.error('Erreur ERP:', err),
      complete: () => this.loading = false
    });
  }

  loadMechanics(): void {
    this.maintenanceService.getAvailableMechanics().subscribe({
      next: (data) => {
        this.availableMechanics = data;
      },
      error: (err) => console.error('Erreur chargement mécaniciens:', err)
    });
  }

  onAssign(requestId: number, event: any): void {
    const empId = event.target.value;
    if (empId) {
      this.maintenanceService.assignMechanic(requestId, Number(empId)).subscribe({
        next: () => {
          // Après assignation, le backend passe normalement le statut en IN_PROGRESS
          this.refreshDashboard();
        },
        error: (err) => alert("Erreur lors de l'assignation : " + err.message)
      });
    }
  }

  onUpdateStatus(requestId: number, newStatus: MaintenanceStatus): void {
    this.maintenanceService.updateStatus(requestId, newStatus).subscribe({
      next: () => {
        this.refreshDashboard();
      },
      error: (err) => alert("Erreur lors de la mise à jour : " + err.message)
    });
  }

  getBadgeClass(status: MaintenanceStatus): string {
    switch (status) {
      case MaintenanceStatus.PENDING: return 'badge bg-warning text-dark';
      case MaintenanceStatus.IN_PROGRESS: return 'badge bg-primary';
      case MaintenanceStatus.COMPLETED: return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }
}
