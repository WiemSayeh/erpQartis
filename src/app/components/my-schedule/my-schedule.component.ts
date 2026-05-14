import { Component, OnInit } from '@angular/core';
import { WorkShiftService } from '../../services/work-shift.service';
import { AuthService } from '../../services/auth.service'; // Ton service actuel
import { WorkShift } from '../../models/WorkShift';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.css']
})
export class MyScheduleComponent implements OnInit {
  myShifts: WorkShift[] = [];
  isLoading = true;
  employeeName = '';

  constructor(
    private shiftService: WorkShiftService,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  // ✅ Récupérer le nom depuis le localStorage (déjà chargé par espace-employee)
  this.authService.getProfile().subscribe({
    next: (user: any) => {
      this.employeeName = user.fullName || 'Collaborateur';
    },
    error: () => {
      const stored = this.authService.getCurrentUser();
      this.employeeName = stored?.fullName || 'Collaborateur';
    }
  });

  // ✅ Charger les shifts
  this.shiftService.getMyShifts().subscribe({
    next: (data) => {
      this.myShifts = data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Erreur API", err);
      this.isLoading = false;
    }
  });
}

}
