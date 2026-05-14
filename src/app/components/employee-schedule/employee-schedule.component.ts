import { Component, OnInit } from '@angular/core';
import { WorkingHoursService } from '../../services/working-hours.service';
import { WorkingHours } from 'src/app/models/WorkingHours.model';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.css']
})
export class EmployeeScheduleComponent implements OnInit {

  workingHours: WorkingHours[] = [];

  
  days = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

  constructor(private service: WorkingHoursService) {}

  ngOnInit(): void {
  const token = localStorage.getItem('token'); // adapte la clé si différente

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email || payload.sub;

    this.service.getByEmail(email).subscribe(data => {
      this.workingHours = data;
    });
  }
}

  getHoursByDay(day: string): WorkingHours[] {
    return this.workingHours.filter(w => w.dayOfWeek === day);
  }

  formatTime(time: string): string {
    return time ? time.substring(0,5) : '';
  }

  translateDay(day: string): string {
    const map: any = {
      MONDAY: 'Lundi',
      TUESDAY: 'Mardi',
      WEDNESDAY: 'Mercredi',
      THURSDAY: 'Jeudi',
      FRIDAY: 'Vendredi',
      SATURDAY: 'Samedi',
      SUNDAY: 'Dimanche'
    };
    return map[day] || day;
  }
}
