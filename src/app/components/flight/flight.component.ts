import { Component, OnInit } from '@angular/core';
import { FlightService, Flight } from '../../service/Flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  carrierId!: number;
  carrierName!: string;
  origin!: string;
  destination!: string;
  airFare!: number;
  seatCapacityBusinessClass!: number;
  seatCapacityEconomyClass!: number;
  seatCapacityExecutiveClass!: number;
  dateOfJourney!: string;
  flights: any[] = [];
  addFlightMessage!: string;
  isFlightAdded: boolean = false;

  isEditMode: boolean = false; 
  currentFlightId!: number; 

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.checkAdminLogin();
    this.getAllFlights();
  }

  checkAdminLogin() {
    const currentAdmin = localStorage.getItem('currentAdmin');
    if (currentAdmin) {
      try {
        const admin = JSON.parse(currentAdmin);
        console.log('Current admin:', admin);
        console.log('Admin token:', admin.token);
      } catch (e) {
        console.error('Error parsing admin data:', e);
      }
    } else {
      console.log('No admin login found');
    }
  }

  submitFlight() {
    const flightData: Flight = {
      flightID: this.isEditMode ? this.currentFlightId : 0,
      carrierID: this.carrierId,
      carrierName: this.carrierName,
      origin: this.origin,
      destination: this.destination,
      airFare: this.airFare,
      seatCapacityBusinessClass: this.seatCapacityBusinessClass,
      seatCapacityEconomyClass: this.seatCapacityEconomyClass,
      seatCapacityExecutiveClass: this.seatCapacityExecutiveClass,
      dateOfJourney: this.dateOfJourney,
    };

    console.log('Submitting flight data:', flightData);

    if (this.isEditMode) {
      this.flightService.updateFlight(flightData).subscribe(
        (response) => {
          console.log('Flight updated successfully:', response);
          this.addFlightMessage = 'Flight updated successfully!';
          this.isFlightAdded = true;
          this.isEditMode = false;
          this.clearForm();
          this.getAllFlights();
        },
        (error) => {
          console.error('Error updating flight:', error);
          this.addFlightMessage = 'Failed to update flight. Please try again.';
          this.isFlightAdded = false;
        }
      );
    } else {
      this.flightService.addFlight(flightData).subscribe(
        (response) => {
          console.log('Flight added successfully:', response);
          this.addFlightMessage = 'Flight added successfully!';
          this.isFlightAdded = true;
          this.clearForm();
          this.getAllFlights();
        },
        (error) => {
          console.error('Error adding flight:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);
          
          let errorMessage = 'Failed to add flight. ';
          if (error.status === 403) {
            errorMessage += 'Access denied. Please log in as admin.';
          } else if (error.status === 400) {
            errorMessage += 'Invalid data. Please check your input.';
          } else if (error.status === 500) {
            errorMessage += 'Server error. Please try again later.';
          } else if (error.error && error.error.message) {
            errorMessage += error.error.message;
          } else {
            errorMessage += 'Please check your backend server.';
          }
          
          this.addFlightMessage = errorMessage;
          this.isFlightAdded = false;
        }
      );
    }
  }

  getAllFlights() {
    this.flightService.getAllFlights().subscribe(
      (data) => {
        this.flights = data;
      },
      (error) => {
        console.error('Error fetching flights:', error);
      }
    );
  }

  editFlight(flightID: number) {
    const selectedFlight = this.flights.find(
      (flight) => flight.flightID === flightID
    );
    if (selectedFlight) {
      this.carrierId = selectedFlight.carrierID;
      this.carrierName = selectedFlight.carrierName;
      this.origin = selectedFlight.origin;
      this.destination = selectedFlight.destination;
      this.airFare = selectedFlight.airFare;
      this.seatCapacityBusinessClass = selectedFlight.seatCapacityBusinessClass;
      this.seatCapacityEconomyClass = selectedFlight.seatCapacityEconomyClass;
      this.seatCapacityExecutiveClass =
        selectedFlight.seatCapacityExecutiveClass;
      this.dateOfJourney = selectedFlight.dateOfJourney;
      this.isEditMode = true;
      this.currentFlightId = flightID;
    }
  }

  deleteFlight(flightID: number) {
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.deleteFlight(flightID).subscribe(
        (response) => {
          this.flights = this.flights.filter(
            (flight) => flight.flightID !== flightID
          );
          this.addFlightMessage = 'Flight deleted successfully!';
          this.isFlightAdded = true;
        },
        (error) => {
          console.error('Error deleting flight:', error);
          this.addFlightMessage = 'Failed to delete flight.';
          this.isFlightAdded = false;
        }
      );
    }
  }

  clearForm() {
    this.carrierId = 0;
    this.carrierName = '';
    this.origin = '';
    this.destination = '';
    this.airFare = 0;
    this.seatCapacityBusinessClass = 0;
    this.seatCapacityEconomyClass = 0;
    this.seatCapacityExecutiveClass = 0;
    this.dateOfJourney = '';
    this.isEditMode = false;
    this.addFlightMessage = '';
  }
}
