import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  loggedIn = false;
  isAdmin = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedin();
    this.isAdmin = this.authService.isAdmin();

    this.authService.loggedInChange.subscribe((wert) => {
      this.loggedIn = wert;
    });

    this.authService.userChange.subscribe((user) => {
      this.isAdmin = user.role === 'admin';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
