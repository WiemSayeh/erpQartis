import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
   template: '<app-employee-verification></app-employee-verification>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    this.extractTokenFromUrl();
  }

  private extractTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');

    if (token) {
      // ✅ Stocker dans le localStorage de l'app admin
      localStorage.setItem('token', decodeURIComponent(token));
      localStorage.setItem('role', decodeURIComponent(role || ''));

      console.log("TOKEN extrait de l'URL =", localStorage.getItem('token'));
      console.log("ROLE extrait de l'URL =", localStorage.getItem('role'));

      // ✅ Nettoyer l'URL (token disparaît de la barre d'adresse)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}
