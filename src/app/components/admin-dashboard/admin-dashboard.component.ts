import { Component } from '@angular/core';
import { CarrierService } from 'src/app/service/Carrier.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service'; // <-- Import LoginService

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  // ... all your existing properties for the form ...
  carrierName!: string;
  discountThirtyDays!: number;
  discountSixtyDays!: number;
  discountNinetyDays!: number;
  bulkBookingDiscount!: number;
  refund2Days!: number;
  refund10Days!: number;
  refund20Days!: number;
  silverDiscount!: number;
  goldDiscount!: number;
  platinumDiscount!: number;
  carrierId!: number;
  addCarrierMessage: string | null = null;
  deleteCarrierMessage: string | null = null;
  isSuccess: boolean = false;
  isDeleteSuccess: boolean = false;
  private deleteSubscription: Subscription = new Subscription();

  // Inject LoginService along with the other services
  constructor(
    private carrierService: CarrierService, 
    private router: Router,
    private loginService: LoginService // <-- Inject LoginService
  ) {}

  // This method now calls the service to perform a full logout
  logout(): void {
    this.loginService.logout();
  }

  // ... all your other existing methods remain unchanged ...
  submitCarrier() {
    const carrierData = {
      carrierID: this.carrierId,
      carrierName: this.carrierName,
      discountPercentageThirtyDaysAdvanceBooking: this.discountThirtyDays,
      discountPercentageSixtyDaysAdvanceBooking: this.discountSixtyDays,
      discountPercentageNinetyDaysAdvanceBooking: this.discountNinetyDays,
      bulkBookingDiscount: this.bulkBookingDiscount,
      refundPercentageForTicketCancellation2DaysBeforeTravelDate: this.refund2Days,
      refundPercentageForTicketCancellation10DaysBeforeTravelDate: this.refund10Days,
      refundPercentageForTicketCancellation20DaysOrMoreBeforeTravelDate: this.refund20Days,
      silverUserDiscount: this.silverDiscount,
      goldUserDiscount: this.goldDiscount,
      platinumUserDiscount: this.platinumDiscount
    };

    if (this.carrierId) {
      this.carrierService.updateCarrier(this.carrierId, carrierData).subscribe(
        response => {
          this.addCarrierMessage = 'Carrier updated successfully!';
          this.isSuccess = true;
          this.resetForm();
        },
        error => {
          this.addCarrierMessage = 'Failed to update carrier.';
          this.isSuccess = false;
        }
      );
    } else {
      this.carrierService.addCarrier(carrierData).subscribe(
        response => {
          this.addCarrierMessage = 'Carrier added successfully!';
          this.isSuccess = true;
          this.resetForm();
        },
        error => {
          this.addCarrierMessage = 'Failed to add carrier.';
          this.isSuccess = false;
        }
      );
    }
  }
  
  submitUpdateDelete() {
    if (this.carrierId) {
      this.carrierService.getCarrierById(this.carrierId).subscribe(carrier => {
        this.carrierName = carrier.carrierName;
        this.discountThirtyDays = carrier.discountPercentageThirtyDaysAdvanceBooking;
        this.discountSixtyDays = carrier.discountPercentageSixtyDaysAdvanceBooking;
        this.discountNinetyDays = carrier.discountPercentageNinetyDaysAdvanceBooking;
        this.bulkBookingDiscount = carrier.bulkBookingDiscount;
        this.refund2Days = carrier.refundPercentageForTicketCancellation2DaysBeforeTravelDate;
        this.refund10Days = carrier.refundPercentageForTicketCancellation10DaysBeforeTravelDate;
        this.refund20Days = carrier.refundPercentageForTicketCancellation20DaysOrMoreBeforeTravelDate;
        this.silverDiscount = carrier.silverUserDiscount;
        this.goldDiscount = carrier.goldUserDiscount;
        this.platinumDiscount = carrier.platinumUserDiscount;
      });
    }
  }
  
  deleteCarrier() {
    if (this.carrierId) {
      const deleteRequest = this.carrierService.deleteCarrier(this.carrierId).subscribe(
        (response) => {
          console.log('Delete response:', response);
          this.deleteCarrierMessage = response;
          this.isDeleteSuccess = true;
        },
        (error) => {
          console.error('Error deleting carrier:', error);
          this.deleteCarrierMessage = 'successfully deleted Carrier';
          this.isDeleteSuccess = false;
        }
      );
      this.deleteSubscription.add(deleteRequest);
    }
  }

  ngOnDestroy() {
    this.deleteSubscription.unsubscribe(); 
  }
  
  resetForm() {
    this.carrierName = '';
    this.discountThirtyDays = 0;
    this.discountSixtyDays = 0;
    this.discountNinetyDays = 0;
    this.bulkBookingDiscount = 0;
    this.refund2Days = 0;
    this.refund10Days = 0;
    this.refund20Days = 0;
    this.silverDiscount = 0;
    this.goldDiscount = 0;
    this.platinumDiscount = 0;
    this.carrierId = 0;
  }

  goToAddFlightPage() {
    this.router.navigate(['/add-flight']);
  }
}

