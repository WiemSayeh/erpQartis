import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  role: string = '';
  userInitials: string = 'U';
  userName: string = 'Utilisateur';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';

    // Optionnel : nom depuis localStorage si tu le stockes
    const name = localStorage.getItem('name');
    if (name) {
      this.userName = name;
      this.userInitials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    } else {
      this.userInitials = this.role === 'ADMIN' ? 'AD' : 'EM';
      this.userName = this.role === 'ADMIN' ? 'Admin PFE' : 'Employé';
    }
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.role === 'EMPLOYEE';
  }

  onLogout() {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, se déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.signOut();
        Swal.fire({
          title: 'Déconnecté',
          text: 'Vous avez été déconnecté avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
  openMenus: { [key: string]: boolean } = {};

toggleMenu(menu: string): void {
  this.openMenus[menu] = !this.openMenus[menu];
}

isMenuOpen(menu: string): boolean {
  return !!this.openMenus[menu];
}
}
