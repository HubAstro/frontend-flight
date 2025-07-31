import { Component } from '@angular/core';
import { LoginService } from 'src/app/service/login.service'; // <-- Import LoginService

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent {
  // Inject LoginService
  constructor(private loginService: LoginService) { }

  // This method now calls the service to perform a full logout
  logout(): void {
    this.loginService.logout();  
  }
}
