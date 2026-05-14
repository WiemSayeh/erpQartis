import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  role: string = '';
  userName: string = '';
  userInitials: string = '';
  userSubtitle: string = '';
  searchQuery: string = '';

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.decodeUserFromToken();
  }

  isAdmin(): boolean { return this.role === 'ADMIN'; }
  isEmployee(): boolean { return this.role === 'EMPLOYEE'; }

  // Décode le JWT pour extraire le nom (sub, name, email...)
  decodeUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Adapte selon ce que ton backend met dans le JWT
      const name = payload.name
        || payload.firstName
        || payload.sub   // souvent l'email
        || '';

      if (name.includes('@')) {
        // C'est un email → on prend la partie avant @
        this.userName = name.split('@')[0];
      } else {
        this.userName = name;
      }

      this.userInitials = this.userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || (this.isAdmin() ? 'AD' : 'EM');

    } catch (e) {
      this.userName = this.isAdmin() ? 'Administrateur' : 'Employé';
      this.userInitials = this.isAdmin() ? 'AD' : 'EM';
    }

    this.userSubtitle = this.isAdmin() ? 'Administrateur' : 'Employé';
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    // Branche ici ta logique de recherche
    console.log('Search:', this.searchQuery);
  }
}
