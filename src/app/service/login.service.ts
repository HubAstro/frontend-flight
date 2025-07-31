import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../model/login-request.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/api/login`;

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginRequest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
