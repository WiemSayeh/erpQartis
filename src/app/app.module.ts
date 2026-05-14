import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

// Enregistrement de la locale française
registerLocaleData(localeFr);

// Bibliothèque de graphiques
import { NgChartsModule } from 'ng2-charts';

// Intercepteur
import { AuthInterceptor } from './auth.interceptor';

// Import des composants
import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { AdminOrderListComponent } from './components/admin-order-list/admin-order-list.component';
import { DashboardHomeComponent } from './modules/dashboard/pages/dashboard-home/dashboard-home.component';
import { MaintenanceServiceFormComponent } from './components/maintenance-service-form/maintenance-service-form.component';
import { MaintenanceServiceListComponent } from './components/maintenance-service-list/maintenance-service-list.component';
import { MaintenanceRequestComponent } from './components/maintenance-request/maintenance-request.component';
import { DepartmentComponent } from './components/department/department.component';
import { EmployeePopupComponent } from './modules/employees/components/employee-popup/employee-popup.component';
import { WorkShiftComponent } from './components/work-shift/work-shift.component';
import { WorkingHoursAssignComponent } from './components/working-hours-assign/working-hours-assign.component';
import { DepartmentNamePipe } from './pipes/department-name.pipe';
import { EspaceEmployeeComponent } from './components/espace-employee-component/espace-employee.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { SalaryAdvanceComponent } from './components/salary-advance-request/salary-advance.component';
import { EmployeeScheduleComponent } from './components/employee-schedule/employee-schedule.component';
import { MyScheduleComponent } from './components/my-schedule/my-schedule.component';
import { AdminLeavesComponent } from './components/admin-leaves/admin-leaves.component';
import { AdminAdvancesComponent } from './components/admin-advances/admin-advances.component';
import { AdminScheduleComponent } from './components/admin-schedule/admin-schedule.component';
import { EmployeeVerificationComponent } from './components/employee-verification/employee-verification.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeCreateComponent,
    EmployeeListComponent,
    AdminLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    CustomerListComponent,
    SupplierListComponent,
    StockListComponent,
    ProductListComponent,
    LoginComponent,
    CustomerFormComponent,
    AdminOrderListComponent,
    DashboardHomeComponent,
    MaintenanceServiceFormComponent,
    MaintenanceServiceListComponent,
    MaintenanceRequestComponent,
    DepartmentComponent,
    EmployeePopupComponent,
    WorkShiftComponent,
    DepartmentNamePipe,
    WorkingHoursAssignComponent,
    EspaceEmployeeComponent,
    LeaveRequestComponent,
    SalaryAdvanceComponent,
    EmployeeScheduleComponent,
    MyScheduleComponent,
    AdminLeavesComponent,
    AdminAdvancesComponent,
    AdminScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeVerificationComponent,
    NgChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // ✅ Locale française pour DatePipe et autres pipes
    { provide: LOCALE_ID, useValue: 'fr' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
