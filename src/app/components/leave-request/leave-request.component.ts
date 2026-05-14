import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {

  employeeInfo: any = null;
  leaveHistory: any[] = [];
  today = new Date().toISOString().split('T')[0];

  form = { startDate: '', endDate: '', reason: '' };

  isLoading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.loadEmployeeInfo();
    this.loadLeaveHistory();
  }

  loadEmployeeInfo() {
    this.leaveService.getMyInfo().subscribe({
      next: (data) => this.employeeInfo = data,
      error: () => this.errorMsg = 'Erreur chargement infos employé'
    });
  }

  loadLeaveHistory() {
    this.leaveService.getMyLeaves().subscribe({
      next: (data) => this.leaveHistory = data,
      error: () => {}
    });
  }

  getContractLabel(): string {
    switch (this.employeeInfo?.contractType) {
      case 'CDI': return '📄 CDI — 25 jours/an';
      case 'CDD': return '📄 CDD — 2.5 jours/mois, limité à la fin du contrat';
      case 'STAGE': return '📄 Stage — max 5 jours consécutifs';
      default: return '❓ Contrat inconnu';
    }
  }

  getMaxDays(): number {
    switch (this.employeeInfo?.contractType) {
      case 'STAGE': return 5;
      default: return this.employeeInfo?.remainingDays || 0;
    }
  }

  submitLeave() {

    if (!this.form.startDate || !this.form.endDate || !this.form.reason) {
      this.errorMsg = 'Veuillez remplir tous les champs';
      return;
    }

    if (new Date(this.form.endDate) <= new Date(this.form.startDate)) {
      this.errorMsg = 'La date de fin doit être après la date de début';
      return;
    }

    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.leaveService.requestLeave(this.form).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Demande de congé envoyée avec succès !';
        this.form = { startDate: '', endDate: '', reason: '' };
        this.loadEmployeeInfo();
        this.loadLeaveHistory();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || err?.error || 'Erreur lors de la demande';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      default: return 'badge-pending';
    }
  }
hasPendingRequest(): boolean {
  return this.leaveHistory.some(l => l.status === 'PENDING');
}
  getStatusLabel(status: string): string {
    switch (status) {
      case 'APPROVED': return '✅ Approuvé';
      case 'REJECTED': return '❌ Rejeté';
      default: return '⏳ En attente';
    }
  }
}
