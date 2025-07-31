import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './service/login.service'; // <-- CORRECTED IMPORT PATH

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('currentUser') || localStorage.getItem('currentAdmin');
    if (token) {
      return true; // If any token exists, allow access
    } else {
      // If not logged in, redirect to the admin login page (or change as needed)
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}
