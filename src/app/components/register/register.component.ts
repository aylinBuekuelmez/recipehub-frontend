import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    const username = this.registerForm.value.username || '';
    const password = this.registerForm.value.password || '';

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
