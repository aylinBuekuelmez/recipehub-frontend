import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  loggedIn = computed(() => this.authService.isLoggedin());
  isAdmin = computed(() => this.authService.isAdmin());
  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
