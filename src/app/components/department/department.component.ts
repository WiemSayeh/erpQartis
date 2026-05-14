import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';

import Swal from 'sweetalert2';
import { Department } from 'src/app/models/department';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments: Department[] = [];

  formDepartment: Department = { name: '', description: '' };

  showModal = false;
  isEditMode = false;

  isAdmin = false;

  constructor(private deptService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';
  }

  loadDepartments() {
    this.deptService.getAll().subscribe(data => this.departments = data);
  }
selectedEmployees: string[] = [];
showEmployeesModal = false;

openEmployees(dept: any) {
  this.selectedEmployees = dept.employeeNames || [];
  this.showEmployeesModal = true;
}

closeEmployeesModal() {
  this.showEmployeesModal = false;
}
  openAddModal() {
    this.formDepartment = { name: '', description: '' };
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(dept: Department) {
    this.formDepartment = { ...dept };
    this.isEditMode = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDepartment() {
    if (this.isEditMode) {
      this.deptService.update(this.formDepartment.id!, this.formDepartment)
        .subscribe(() => {
          this.loadDepartments();
          this.closeModal();
          Swal.fire('Updated', 'Department updated', 'success');
        });
    } else {
      this.deptService.create(this.formDepartment)
        .subscribe(() => {
          this.loadDepartments();
          this.closeModal();
          Swal.fire('Added', 'Department created', 'success');
        });
    }
  }

  deleteDepartment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.deptService.delete(id).subscribe(() => {
          this.loadDepartments();
          Swal.fire('Deleted!', '', 'success');
        });
      }
    });
  }
}
