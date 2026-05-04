import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:3000';

  user: User = { username: '', role: '' };
  userChange: Subject<User> = new Subject<User>();

  token = '';
  tokenChange: Subject<string> = new Subject<string>();

  loggedIn = false;
  loggedInChange: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.loggedInChange.subscribe((value) => {
      this.loggedIn = value;
    });

    this.userChange.subscribe((value) => {
      this.user = value;
    });

    this.tokenChange.subscribe((value) => {
      this.token = value;
    });
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + '/users/register', user);
  }

  loginUser(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.baseUrl + '/users/login',
      { username: username, password: password },
      { observe: 'response' }
    );
  }

  login(user: User, token: string): void {
    this.loggedIn = true;
    this.loggedInChange.next(this.loggedIn);

    this.user = user;
    this.userChange.next(this.user);

    this.token = token;
    this.tokenChange.next(this.token);

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    console.log('login() : ', this.user);
  }

  logout(): void {
    this.loggedIn = false;
    this.loggedInChange.next(this.loggedIn);

    this.user = { username: '', role: '' };
    this.userChange.next(this.user);

    this.token = '';
    this.tokenChange.next(this.token);

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  loadFromLocalStorage(): void {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userString && token) {
      const user = JSON.parse(userString);

      this.user = user;
      this.userChange.next(this.user);

      this.token = token;
      this.tokenChange.next(this.token);

      this.loggedIn = true;
      this.loggedInChange.next(this.loggedIn);
    }
  }

  isLoggedin(): boolean {
    return this.loggedIn;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  isUser(): boolean {
    return this.user?.role === 'user';
  }
}