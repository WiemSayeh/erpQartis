import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkShiftService } from '../../services/work-shift.service';
import { WorkShift } from 'src/app/models/WorkShift';

@Component({
  selector: 'app-work-shift',
  templateUrl: './work-shift.component.html',
  styleUrls: ['./work-shift.component.css']
})
export class WorkShiftComponent implements OnInit {
  today = new Date();
  assignForm: FormGroup;
  shifts: WorkShift[] = [];
  suggestedEmployee: any = undefined;
  isLoading = false;

  departments = [
    { id: 1, name: 'Mécanique' },
    { id: 2, name: 'Peinture' },
    { id: 3, name: 'Électricité' }
  ];

  constructor(private fb: FormBuilder, private shiftService: WorkShiftService) {
    this.assignForm = this.fb.group({
      departmentId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['11:00', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts() {
    this.shiftService.getAllShifts().subscribe(data => this.shifts = data);
  }

  onSearch() {
    const { date, startTime, endTime, departmentId } = this.assignForm.value;

    const payload = {
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`
    };

    this.isLoading = true;
    this.suggestedEmployee = undefined;

    this.shiftService.autoAssign(departmentId, payload).subscribe({
      next: (emp) => {
        this.suggestedEmployee = emp;
        this.isLoading = false;
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Aucun employé disponible pour ce créneau.';
        alert(errorMsg);
        this.suggestedEmployee = null;
        this.isLoading = false;
      }
    });
  }

  confirmAssignment() {
    if (!this.suggestedEmployee) return;

    const { date, startTime, endTime, departmentId } = this.assignForm.value;

    const newShift = {
      date: date,
      startTime: startTime,
      endTime: endTime,
      departmentId: Number(departmentId),
      employeeId: this.suggestedEmployee.id,
      status: 'PLANNED'
    };

    this.shiftService.createShift(newShift).subscribe({
      next: () => {
        this.suggestedEmployee = undefined;
        this.loadShifts();
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de la création du shift.');
      }
    });
  }
}
