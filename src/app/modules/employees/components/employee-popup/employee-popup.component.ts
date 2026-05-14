import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-employee-popup',
  templateUrl: './employee-popup.component.html'
})
export class EmployeePopupComponent {

  showPopup = false;

  @Output() action = new EventEmitter<string>();

  // 🔴 appelé si admin refuse setup
  skipSetup() {
    this.showPopup = false;
    this.action.emit('SKIP');
  }

  // 🟢 appelé si admin accepte
  createContractAndShift() {
    this.showPopup = false;
    this.action.emit('SETUP');
  }

  // 🔵 ouvrir popup
  open() {
    this.showPopup = true;
  }
}
