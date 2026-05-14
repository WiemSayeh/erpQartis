import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './components/login/login.component';

import { DashboardHomeComponent } from './modules/dashboard/pages/dashboard-home/dashboard-home.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';

import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';

import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';

import { AdminOrderListComponent } from './components/admin-order-list/admin-order-list.component';

import { MaintenanceServiceListComponent } from './components/maintenance-service-list/maintenance-service-list.component';
import { MaintenanceServiceFormComponent } from './components/maintenance-service-form/maintenance-service-form.component';
import { MaintenanceRequestComponent } from './components/maintenance-request/maintenance-request.component';

import { DepartmentComponent } from './components/department/department.component';
import { WorkShiftComponent } from './components/work-shift/work-shift.component';
import { WorkingHoursAssignComponent } from './components/working-hours-assign/working-hours-assign.component';

import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { SalaryAdvanceComponent } from './components/salary-advance-request/salary-advance.component';

import { EmployeeScheduleComponent } from './components/employee-schedule/employee-schedule.component';
import { MyScheduleComponent } from './components/my-schedule/my-schedule.component';

import { AdminLeavesComponent } from './components/admin-leaves/admin-leaves.component';
import { AdminAdvancesComponent } from './components/admin-advances/admin-advances.component';
import { AdminScheduleComponent } from './components/admin-schedule/admin-schedule.component';

import { EmployeeVerificationComponent } from './components/employee-verification/employee-verification.component';
import { EspaceEmployeeComponent } from './components/espace-employee-component/espace-employee.component';


const routes: Routes = [

  // 🔐 Login route
  { path: 'login', component: LoginComponent },

  // 🧭 Admin layout (protected area)
  {
    path: '',
    component: AdminLayoutComponent,
    children: [

      // Dashboard
      { path: 'dashboard', component: DashboardHomeComponent },

      // Products / Stock
      { path: 'products', component: ProductListComponent },
      { path: 'stocks', component: StockListComponent },

      // Employees
      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/add', component: EmployeeCreateComponent },
      { path: 'employees/edit/:id', component: EmployeeCreateComponent },

      // Customers
      { path: 'customers', component: CustomerListComponent },
      { path: 'admin/customers/new', component: CustomerFormComponent },
      { path: 'admin/customers/edit/:id', component: CustomerFormComponent },

      // Suppliers
      { path: 'suppliers', component: SupplierListComponent },

      // Orders
      { path: 'orders', component: AdminOrderListComponent },
      { path: 'orders/:id', component: AdminOrderListComponent },

      // Department
      { path: 'department', component: DepartmentComponent },

      // Maintenance
      { path: 'maintenance-request', component: MaintenanceRequestComponent },
      { path: 'maintenance-services', component: MaintenanceServiceListComponent },
      { path: 'maintenance-services/new', component: MaintenanceServiceFormComponent },
      { path: 'maintenance-services/edit/:id', component: MaintenanceServiceFormComponent },

      // Shifts
      { path: 'temps', component: WorkShiftComponent },
      { path: 'shifts/assign/:id', component: WorkingHoursAssignComponent },

      // Employee space
      { path: 'espace-employee', component: EspaceEmployeeComponent },

      // Leaves / Salary
      { path: 'leave-request', component: LeaveRequestComponent },
      { path: 'salary-advance', component: SalaryAdvanceComponent },

      // Schedule
      { path: 'schedule', component: EmployeeScheduleComponent },
      { path: 'today-tasks', component: MyScheduleComponent },

      // Admin HR
      { path: 'admin/schedule', component: AdminScheduleComponent },
      { path: 'admin-leaves', component: AdminLeavesComponent },
      { path: 'admin-advances', component: AdminAdvancesComponent },
      { path: 'employee-verification', component: EmployeeVerificationComponent },

      // default
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
