import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest } from '../model/login-request.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // IMPORTANT: The backend runs on port 8080. Let's create a new apiUrl
  // that points to the correct authentication endpoint.
  private apiUrl = `${environment.apiUrl}/api/login`; 
  private readonly JWT_TOKEN = 'auth_token'; // A key for storing the token in the browser

  // We need to inject the Router to navigate the user after they log out.
  constructor(private http: HttpClient, private router: Router) {}

  // --- MODIFIED LOGIN METHOD ---
  // This method now saves the token to localStorage upon a successful login.
  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap(response => {
        // When the backend sends back a response with a JWT, we store it.
        if (response && response.jwt) {
          this.storeToken(response.jwt);
        }
      })
    );
  }

  // --- NEW LOGOUT METHOD ---
  // This is the most important new function. It removes the token
  // from storage and then navigates the user to the landing page.
  logout(): void {
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/admin-login']); // Navigate to admin login page
  }

  // --- NEW HELPER METHODS ---
  // Checks if a token exists in storage.
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  // A private method to handle storing the token.
  private storeToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

  // A method to retrieve the token, which will be needed later.
  getJwtToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }
}

