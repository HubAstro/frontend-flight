import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environment';

// Flight interface for type safety
export interface Flight {
  flightID: number;
  carrierID: number;
  carrierName: string;
  origin: string;
  destination: string;
  airFare: number;
  seatCapacityBusinessClass: number;
  seatCapacityEconomyClass: number;
  seatCapacityExecutiveClass: number;
  dateOfJourney: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = `${environment.apiUrl}/api/v1/flights`; // Dynamically set the base API URL

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

  // Get all flights
  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching flights', error);
        throw error;
      })
    );
  }

  // Get a flight by its ID
  getFlightById(flightId: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${flightId}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error fetching flight with ID ${flightId}`, error);
        throw error;
      })
    );
  }

  // Add a new flight
  addFlight(flight: Flight): Observable<Flight> {
    // Remove flightID if present to avoid backend issues
    const { flightID, ...flightData } = flight;
    return this.http.post<Flight>(`${this.apiUrl}`, flightData, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error adding flight', error);
        throw error;
      })
    );
  }

  // Update an existing flight
  updateFlight(flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${flight.flightID}`, flight, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error updating flight', error);
        throw error;
      })
    );
  }

  // Delete a flight by its ID
  deleteFlight(flightId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${flightId}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error(`Error deleting flight with ID ${flightId}`, error);
        throw error;
      })
    );
  }
}
