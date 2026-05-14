import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkShiftService } from '../../services/work-shift.service';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';
import { WorkShift } from '../../models/WorkShift';

@Component({
  selector: 'app-espace-employee',
  templateUrl: './espace-employee.component.html',
  styleUrls: ['./espace-employee.component.css']
})
export class EspaceEmployeeComponent implements OnInit {
  fullName = '';
  activeTab = 'dashboard';
  today = new Date();

  myShifts: WorkShift[] = [];
  leaveHistory: any[] = [];
  totalHours = 0;
  remainingDays = 0;
  salary = 0;
  nextShift: WorkShift | null = null;

  constructor(
    private route: ActivatedRoute,
    private shiftService: WorkShiftService,
    private leaveService: LeaveService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // ✅ Étape 1 : récupérer token & role depuis l'URL
    this.route.queryParams.subscribe(params => {
      const tokenFromUrl = params['token'];
      const roleFromUrl = params['role'];

      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
      }
      if (roleFromUrl) {
        localStorage.setItem('role', roleFromUrl);
      }

      // ✅ Étape 2 : charger le profil depuis le backend
      this.loadProfile();
      this.loadDashboardData();
    });
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (user: any) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.fullName = user.fullName || user.name || user.firstName + ' ' + user.lastName || 'Collaborateur';
      },
      error: () => {
        // Fallback sur localStorage si l'appel échoue
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const u = JSON.parse(stored);
          this.fullName = u.fullName || u.name || 'Collaborateur';
        }
      }
    });
  }

  loadDashboardData() {
    this.shiftService.getMyShifts().subscribe(data => {
      this.myShifts = data;
      this.totalHours = data.length * 8;
      this.nextShift = this.getNextShift(data); // ✅ calcul du prochain shift
    });

    this.leaveService.getMyInfo().subscribe(info => {
      this.remainingDays = info?.remainingDays || 0;
      this.salary = info?.salary || 0;
    });

    this.leaveService.getMyLeaves().subscribe(leaves => {
      this.leaveHistory = leaves;
    });
  }

  // ✅ Trouver le shift le plus proche dans le futur
  getNextShift(shifts: WorkShift[]): WorkShift | null {
    const now = new Date();
    const upcoming = shifts
      .filter(s => new Date(s.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
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
}
