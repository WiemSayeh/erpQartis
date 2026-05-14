import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceServiceDTO } from 'src/app/models/maintenanceServiceDTO';
import { MaintenanceServiceService } from 'src/app/services/maintenance-service.service';


@Component({
  selector: 'app-maintenance-service-form',
  templateUrl: './maintenance-service-form.component.html',
  styleUrls: ['./maintenance-service-form.component.css']
})
export class MaintenanceServiceFormComponent implements OnInit {

  service: MaintenanceServiceDTO = {
    name: '',
    description: '',
    price: 0,
    estimatedDuration: 0
  };

  isEdit = false;

  constructor(
    private api: MaintenanceServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.isEdit = true;
      this.api.getById(id).subscribe(data => {
        this.service = data;
      });
    }
  }

  save() {
    if (this.isEdit) {
      this.api.update(this.service).subscribe(() => {
        this.router.navigate(['/maintenance-services']);
      });
    } else {
      this.api.create(this.service).subscribe(() => {
        this.router.navigate(['/maintenance-services']);
      });
    }
  }
}
