import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../model/Booking.model'; // Adjust path if needed
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/v1/bookings`;

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const admin = localStorage.getItem('currentAdmin');
    const user = localStorage.getItem('currentUser');
    const jwtToken = localStorage.getItem('auth_token');
    let jwt = '';
    if (admin) {
      try {
        jwt = JSON.parse(admin).jwt;
      } catch {}
    } else if (user) {
      try {
        jwt = JSON.parse(user).jwt;
      } catch {}
    } else if (jwtToken) {
      jwt = jwtToken;
    }
    if (jwt) {
      headers = headers.set('Authorization', `Bearer ${jwt}`);
    }
    return { headers };
  }

  createBooking(booking: Booking): Observable<Booking[]> {
    // Remove bookingId if present to avoid backend issues
    const { bookingId, ...bookingData } = booking;
    return this.http.post<Booking[]>(`${this.apiUrl}`, bookingData, this.getHeaders());
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl, this.getHeaders());
  }

  deleteBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${bookingId}`, this.getHeaders());
  }
}
