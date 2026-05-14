import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkingHoursService, WorkingHoursCreate } from '../../services/working-hours.service';
import { DepartmentService } from '../../services/department.service';
import Swal from 'sweetalert2';

interface SlotRow {
  dayOfWeek: string;
  label: string;
  startTime: string;
  endTime: string;
  departmentId: number | null;
}

@Component({
  selector: 'app-working-hours-assign',
  templateUrl: './working-hours-assign.component.html'
})
export class WorkingHoursAssignComponent implements OnInit {

  employeeId!: number;
  departments: any[] = [];
  isLoading = false;

  days = [
    { value: 'MONDAY',    label: 'Lundi' },
    { value: 'TUESDAY',   label: 'Mardi' },
    { value: 'WEDNESDAY', label: 'Mercredi' },
    { value: 'THURSDAY',  label: 'Jeudi' },
    { value: 'FRIDAY',    label: 'Vendredi' },
    { value: 'SATURDAY',  label: 'Samedi' },
    { value: 'SUNDAY',    label: 'Dimanche' }
  ];

  // Liste dynamique de créneaux
  slots: SlotRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workingHoursService: WorkingHoursService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.departmentService.getAll().subscribe(res => this.departments = res);

    // Charger les horaires existants
    this.workingHoursService.getByEmployee(this.employeeId).subscribe({
      next: (existing) => {
        if (existing && existing.length > 0) {
          this.slots = existing.map(wh => ({
            dayOfWeek: wh.dayOfWeek,
            label: this.days.find(d => d.value === wh.dayOfWeek)?.label || wh.dayOfWeek,
            startTime: wh.startTime?.substring(0, 5) || '08:00',
            endTime: wh.endTime?.substring(0, 5) || '17:00',
            departmentId: wh.department?.id || null
          }));
        }
      }
    });
  }

  getLabelForDay(value: string): string {
    return this.days.find(d => d.value === value)?.label || value;
  }

  addSlot(dayValue?: string) {
    this.slots.push({
      dayOfWeek: dayValue || 'MONDAY',
      label: this.getLabelForDay(dayValue || 'MONDAY'),
      startTime: '08:00',
      endTime: '17:00',
      departmentId: null
    });
  }

  removeSlot(index: number) {
    this.slots.splice(index, 1);
  }

  onDayChange(slot: SlotRow) {
    slot.label = this.getLabelForDay(slot.dayOfWeek);
  }

  // Grouper les slots par jour pour l'affichage du récapitulatif
  get slotsByDay() {
    const map = new Map<string, SlotRow[]>();
    this.slots.forEach(slot => {
      if (!map.has(slot.dayOfWeek)) map.set(slot.dayOfWeek, []);
      map.get(slot.dayOfWeek)!.push(slot);
    });
    return map;
  }

  isValid(): boolean {
    return this.slots.length > 0 &&
      this.slots.every(s => s.startTime && s.endTime && s.departmentId && s.dayOfWeek);
  }

  save() {
    if (!this.isValid()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Remplissez tous les champs pour chaque créneau.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const payload: WorkingHoursCreate[] = this.slots.map(s => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime + ':00',
      endTime: s.endTime + ':00',
      departmentId: Number(s.departmentId)
    }));

    this.isLoading = true;

    this.workingHoursService.save(this.employeeId, payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Emploi du temps enregistré !',
          confirmButtonColor: '#2563eb'
        }).then(() => this.router.navigate(['/employees']));
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error?.message || 'Une erreur est survenue.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  skip() {
    this.router.navigate(['/employees']);
  }
}
