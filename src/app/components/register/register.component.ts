import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  errorMessage = '';
  successMessage = '';

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(): void {
    const username = this.registerForm.value.username || '';
    const password = this.registerForm.value.password || '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Bitte Benutzername und Passwort eingeben.';
      this.successMessage = '';
      return;
    }

    this.authService.registerUser({
      username: username,
      password: password,
      role: 'user'
    }).subscribe({
      next: () => {
        this.successMessage = 'Registrierung erfolgreich. Du kannst dich jetzt einloggen.';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Registrierung fehlgeschlagen.';
        this.successMessage = '';
      }
    });
  }

}
