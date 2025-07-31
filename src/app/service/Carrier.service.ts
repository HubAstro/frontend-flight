import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  private apiUrl = `${environment.apiUrl}/api/v1/carrier`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const admin = localStorage.getItem('currentAdmin');
    if (admin) {
      try {
        const { jwt } = JSON.parse(admin);
        if (jwt) {
          headers = headers.set('Authorization', `Bearer ${jwt}`);
        }
      } catch (e) {
        console.error('Error parsing currentAdmin:', e);
      }
    }
    return headers;
  }

  addCarrier(carrier: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, carrier, { headers: this.getHeaders() });
  }

  updateCarrier(id: number, carrier: any): Observable<any> {
    // Remove carrierID if present to avoid backend issues
    const { carrierID, ...carrierData } = carrier;
    return this.http.put(`${this.apiUrl}/${id}`, carrierData, { headers: this.getHeaders() });
  }

  deleteCarrier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCarrierById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
