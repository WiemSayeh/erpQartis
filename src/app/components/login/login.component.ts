import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',

  templateUrl: './login.component.html'
})
export class LoginComponent {

  // On garde "credentials" pour correspondre à votre formulaire HTML (ngModel)
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSignIn() {
    // CORRECTION : Utilisez "this.credentials" au lieu de "this.user"
    const loginData = {
      email: this.credentials.email,
      password: this.credentials.password
    };

    console.log('Données envoyées :', loginData); // Vérifiez dans la console avant l'envoi

    this.authService.login(loginData).subscribe({
      next: (res) => {
        console.log('Connexion réussie !', res);
        // Stockage des infos (si pas déjà fait dans le service)
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors du login :', err);
        alert('Identifiants invalides ou erreur de format.');
      }
    });
  }
}
