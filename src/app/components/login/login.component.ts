import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage = '';

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    const username = this.loginForm.value.username || '';
    const password = this.loginForm.value.password || '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Bitte Benutzername und Passwort eingeben.';
      return;
    }

    this.authService.loginUser(username, password).subscribe({
      next: (response) => {
        const token = response.body.token;
        const user = response.body.user;

        this.authService.login(user, token);

        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Username oder Passwort ist falsch.';
      }
    });
  }

}
