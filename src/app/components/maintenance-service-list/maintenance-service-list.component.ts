import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceServiceDTO } from 'src/app/models/maintenanceServiceDTO';
import { MaintenanceServiceService } from 'src/app/services/maintenance-service.service';



@Component({
  selector: 'app-maintenance-service-list',
  templateUrl: './maintenance-service-list.component.html',
  styleUrls: ['./maintenance-service-list.component.css']
})
export class MaintenanceServiceListComponent implements OnInit {

  services: MaintenanceServiceDTO[] = [];

  constructor(
    private service: MaintenanceServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.service.getAll().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error(err)
    });
  }

  delete(id: number) {
    if (confirm('Are you sure?')) {
      this.service.delete(id).subscribe(() => {
        this.loadServices();
      });
    }
  }

  edit(id: number) {
    this.router.navigate(['/maintenance-services/edit', id]);
  }

  create() {
    this.router.navigate(['/maintenance-services/new']);
  }
}
