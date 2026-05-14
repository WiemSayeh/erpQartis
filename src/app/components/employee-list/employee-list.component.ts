import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = true;

  // Filtres
  filterName = '';
  filterDepartment = '';
  filterStatus = '';
  allDepartments: string[] = [];

  // Popup Edit
  showEditModal = false;
  selectedEmployee: Employee | null = null;
  editForm!: FormGroup;
  editSelectedDeptIds: number[] = [];
  editFormTouched = false;
  allDepartmentObjects: { id: number; name: string }[] = [];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAllDepartments();
    this.initEditForm();
  }

  // ─── Chargement ───────────────────────────────────────────

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;

        const deptSet = new Set<string>();
        data.forEach(emp => emp.departments?.forEach(d => deptSet.add(d.name)));
        this.allDepartments = Array.from(deptSet).sort();

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadAllDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => {
        this.allDepartmentObjects = data.map((d: any) => ({ id: d.id, name: d.name }));
      },
      error: (err) => console.error(err)
    });
  }

  // ─── Filtres ──────────────────────────────────────────────

  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchName = emp.fullName.toLowerCase().includes(this.filterName.toLowerCase());
      const matchDept = this.filterDepartment === '' ||
        emp.departments?.some(d => d.name === this.filterDepartment);
      const matchStatus = this.filterStatus === '' ||
        emp.employmentStatus === this.filterStatus;
      return matchName && matchDept && matchStatus;
    });
  }

  resetFilters(): void {
    this.filterName = '';
    this.filterDepartment = '';
    this.filterStatus = '';
    this.filteredEmployees = [...this.employees];
  }

  // ─── Popup Edit ───────────────────────────────────────────

  private initEditForm(): void {
    this.editForm = this.fb.group({
      fullName:     ['', [Validators.required, Validators.minLength(3)]],
      email:        ['', [Validators.required, Validators.email]],
      phone:        ['', [Validators.required, Validators.pattern('^[0-9]{8,12}$')]],
      address:      ['', [Validators.required]],
      contractType: ['CDI', [Validators.required]], // ✅
      salary:       [null, [Validators.required, Validators.min(0)]] // ✅
    });
  }

  openEditModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.editFormTouched = false;

    this.editForm.patchValue({
      fullName:     emp.fullName,
      email:        emp.email,
      phone:        emp.phone,
      address:      emp.address,
      contractType: emp.contractType ?? 'CDI', // ✅
      salary:       emp.salary ?? 0            // ✅
    });

    this.editSelectedDeptIds = emp.departments?.map(d => d.id) ?? [];
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployee = null;
    this.editForm.reset();
    this.editSelectedDeptIds = [];
  }

  onEditDepartmentChange(event: any, id: number): void {
    if (event.target.checked) {
      if (!this.editSelectedDeptIds.includes(id)) {
        this.editSelectedDeptIds.push(id);
      }
    } else {
      this.editSelectedDeptIds = this.editSelectedDeptIds.filter(d => d !== id);
    }
  }

  saveEdit(): void {
    this.editFormTouched = true;
    if (this.editForm.invalid || this.editSelectedDeptIds.length === 0) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.editForm.value,
      departmentIds: this.editSelectedDeptIds
    };

    this.employeeService.updateEmployee(this.selectedEmployee!.id!, payload).subscribe({
      next: (updated: Employee) => {
        const index = this.employees.findIndex(e => e.id === updated.id);
        if (index !== -1) this.employees[index] = updated;
        this.applyFilters();
        this.closeEditModal();
        Swal.fire({ icon: 'success', title: 'Employé modifié !', timer: 1500, showConfirmButton: false });
      },
      error: () => Swal.fire('Erreur', 'Impossible de modifier cet employé.', 'error')
    });
  }

  // ─── Suppression ──────────────────────────────────────────

  deleteEmployee(id: number): void {
    Swal.fire({
      title: 'Confirmer la suppression ?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#718096'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.applyFilters();
            Swal.fire({ icon: 'success', title: 'Employé désactivé !', timer: 1500, showConfirmButton: false });
          },
          error: () => Swal.fire('Erreur', 'Impossible de désactiver cet employé.', 'error')
        });
      }
    });
  }

  editEmployee(id: number): void {}
}
