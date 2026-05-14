import { Component, OnInit } from '@angular/core';
import { SalaryAdvanceService } from '../../services/salary-advance.service';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-salary-advance',
  templateUrl: './salary-advance.component.html',
  styleUrls: ['./salary-advance.component.css']
})
export class SalaryAdvanceComponent implements OnInit {

  employeeInfo: any = null;
  advanceHistory: any[] = [];

  form = { amount: 0 };

  isLoading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private advanceService: SalaryAdvanceService,
    private leaveService: LeaveService
  ) {}

  ngOnInit() {
    this.loadEmployeeInfo();
    this.loadAdvanceHistory();
  }

 loadEmployeeInfo() {
  this.leaveService.getMyInfo().subscribe({
    next: (data) => {
      this.employeeInfo = data;
      this.loadAdvanceHistory(); // ← ici, après avoir reçu employeeInfo
    },
    error: () => this.errorMsg = 'Erreur chargement infos employé'
  });
}

loadAdvanceHistory() {
  if (!this.employeeInfo?.id) return;

  this.advanceService.getMyAdvances(this.employeeInfo.id).subscribe({
    next: (data) => this.advanceHistory = data,
    error: () => {}
  });
}

  // 50% du salaire
  getMaxAdvance(): number {
    return this.employeeInfo?.salary * 0.5 || 0;
  }

  // Total approuvé ce mois-ci
  getTotalThisMonth(): number {
    const now = new Date();
    return this.advanceHistory
      .filter(a => a.status === 'APPROVED')
      .filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, a) => sum + a.amount, 0);
  }

  // Ce qu'il reste à demander ce mois
  getRemainingAllowed(): number {
    return Math.max(this.getMaxAdvance() - this.getTotalThisMonth(), 0);
  }

  // Bloque le formulaire si PENDING existe
  hasPendingRequest(): boolean {
    return this.advanceHistory.some(a => a.status === 'PENDING');
  }

  // Plafond atteint ce mois
  hasReachedMonthlyLimit(): boolean {
    return this.getRemainingAllowed() === 0;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      default: return 'badge-pending';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'APPROVED': return '✅ Approuvé';
      case 'REJECTED': return '❌ Rejeté';
      default: return '⏳ En attente';
    }
  }

  submitAdvance() {
    if (!this.form.amount || this.form.amount <= 0) {
      this.errorMsg = 'Veuillez entrer un montant valide';
      return;
    }

    if (this.form.amount > this.getRemainingAllowed()) {
      this.errorMsg = `Maximum disponible ce mois-ci : ${this.getRemainingAllowed()} DT`;
      return;
    }

    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.advanceService.requestAdvance({
      employeeId: this.employeeInfo.id,
      amount: this.form.amount
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Demande envoyée avec succès !';
        this.form.amount = 0;
        this.loadAdvanceHistory();
        this.loadEmployeeInfo();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Erreur lors de la demande';
      }
    });
  }
}
