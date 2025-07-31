import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/model/login-request.model';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})

export class AdminLoginComponent {
  
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private loginService: LoginService) {}
  
  onSubmit(): void {
    const loginRequest = new LoginRequest(this.userName, this.password);
    this.loginService.login(loginRequest).subscribe(
      (response) => {
        console.log('Admin login successful:', response);
        // Store admin info in session/localStorage for later use
        localStorage.setItem('currentAdmin', JSON.stringify(response));
        alert('Admin login successful! Welcome ' + this.userName);
        this.router.navigate(['/admin-dashboard']);
      },
      (error) => {
        console.error('Admin login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}