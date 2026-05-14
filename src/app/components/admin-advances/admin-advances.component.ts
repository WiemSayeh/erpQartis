import { Component, OnInit } from '@angular/core';
import { SalaryAdvanceService } from 'src/app/services/salary-advance.service';

@Component({
  selector: 'app-admin-advances',
  templateUrl: './admin-advances.component.html',
  styleUrls: ['./admin-advances.component.css']
})
export class AdminAdvancesComponent implements OnInit {

  advances: any[] = [];

  constructor(private service: SalaryAdvanceService) {}

  ngOnInit(): void {
    this.loadAdvances();
  }

  loadAdvances() {
    this.service.getAllAdvances().subscribe({
      next: data => this.advances = data,
      error: err => console.error(err)
    });
  }

  approve(id: number) {
    this.service.approveAdvance(id).subscribe(() => {
      this.loadAdvances();
    });
  }

  reject(id: number) {
    this.service.rejectAdvance(id).subscribe(() => {
      this.loadAdvances();
    });
  }
}
