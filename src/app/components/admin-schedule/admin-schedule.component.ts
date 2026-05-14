import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkingHoursService } from '../../services/working-hours.service';
import { EmployeeService } from '../../services/employee.service';
import { WorkingHours } from 'src/app/models/WorkingHours.model';
import { Employee } from 'src/app/models/employee';

@Component({
  selector: 'app-admin-schedule',
  templateUrl: './admin-schedule.component.html',
  styleUrls: ['./admin-schedule.component.css']
})
export class AdminScheduleComponent implements OnInit {

  allWorkingHours: WorkingHours[] = [];
  employees: Employee[] = [];
  selectedEmployeeId: number | null = null;
  searchQuery: string = '';
  isLoading = true;

  days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private workingHoursService: WorkingHoursService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    // 1. Charger employés ET tous les horaires en parallèle avec forkJoin
    forkJoin({
      employees: this.employeeService.getAllEmployees().pipe(catchError(() => of([]))),
      hours: this.workingHoursService.getAll().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ employees, hours }) => {
        this.employees = employees;
        this.allWorkingHours = hours;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredEmployees(): Employee[] {
    const q = this.searchQuery.toLowerCase();
    return this.employees.filter(e =>
      e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    );
  }

  selectEmployee(id: number): void {
    this.selectedEmployeeId = this.selectedEmployeeId === id ? null : id;
  }

  get selectedEmployee(): Employee | undefined {
    return this.employees.find(e => e.id === this.selectedEmployeeId);
  }

  getHoursForEmployee(employeeId: number): WorkingHours[] {
    return this.allWorkingHours.filter(wh => wh.employeeId === employeeId);
  }

  getHoursForDay(employeeId: number, day: string): WorkingHours[] {
    return this.getHoursForEmployee(employeeId).filter(wh => wh.dayOfWeek === day);
  }

  hasHoursForDay(employeeId: number, day: string): boolean {
    return this.getHoursForDay(employeeId, day).length > 0;
  }

  translateDay(day: string): string {
    const map: Record<string, string> = {
      MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche'
    };
    return map[day] || day;
  }

  shortDay(day: string): string {
    const map: Record<string, string> = {
      MONDAY: 'Lun', TUESDAY: 'Mar', WEDNESDAY: 'Mer',
      THURSDAY: 'Jeu', FRIDAY: 'Ven', SATURDAY: 'Sam', SUNDAY: 'Dim'
    };
    return map[day] || day.substring(0, 3);
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '--:--';
  }

  getInitials(emp: Employee): string {
    const parts = emp.fullName?.trim().split(' ') ?? [];
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  }

  getTotalHours(employeeId: number): number {
    return this.getHoursForEmployee(employeeId).reduce((acc, wh) => {
      if (!wh.startTime || !wh.endTime) return acc;
      const [sh, sm] = wh.startTime.split(':').map(Number);
      const [eh, em] = wh.endTime.split(':').map(Number);
      return acc + (eh * 60 + em - (sh * 60 + sm)) / 60;
    }, 0);
  }

  getWorkingDaysCount(employeeId: number): number {
    const days = new Set(this.getHoursForEmployee(employeeId).map(wh => wh.dayOfWeek));
    return days.size;
  }

  getDepartmentName(employeeId: number): string {
    const emp = this.employees.find(e => e.id === employeeId);
    if (emp?.departments?.length) return emp.departments[0].name;
    const wh = this.getHoursForEmployee(employeeId)[0];
    return wh?.department?.name ?? '—';
  }

  calcDuration(startTime: string, endTime: string): string {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return ((eh * 60 + em - (sh * 60 + sm)) / 60).toFixed(1);
  }

  deleteSchedule(employeeId: number): void {
    if (confirm('Supprimer tous les horaires de cet employé ?')) {
      this.workingHoursService.deleteByEmployee(employeeId).subscribe(() => {
        this.allWorkingHours = this.allWorkingHours.filter(wh => wh.employeeId !== employeeId);
        if (this.selectedEmployeeId === employeeId) this.selectedEmployeeId = null;
      });
    }
  }
}
