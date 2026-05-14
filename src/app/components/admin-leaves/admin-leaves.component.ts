import { Component, OnInit } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-admin-leaves',
  templateUrl: './admin-leaves.component.html',
  styleUrls: ['./admin-leaves.component.css']
})
export class AdminLeavesComponent implements OnInit {

  leaves: any[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    this.leaveService.getAllLeaves().subscribe({
      next: data => this.leaves = data,
      error: err => console.error(err)
    });
  }

  approve(id: number) {
    this.leaveService.approveLeave(id).subscribe(() => {
      this.loadLeaves();
    });
  }

  reject(id: number) {
    this.leaveService.rejectLeave(id).subscribe(() => {
      this.loadLeaves();
    });
  }
}
