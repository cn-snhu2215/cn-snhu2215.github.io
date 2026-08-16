import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripCardComponent } from '../trip-card/trip-card.component';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

import { Router } from '@angular/router';
import { TripSearchService } from '../services/trip-search.service';


@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css'
})

export class TripListingComponent implements OnInit {
  trips!: Trip[];
  message: string = '';
  searchText!: string;
  tripSearchResults!: Trip[];

  constructor(
    private tripDataService: TripDataService,
    private tripSearchService: TripSearchService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('trip-listing constructor');
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  public isAdmin() {
    return this.authenticationService.isAdmin();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  private getstuff(): void {
    this.tripDataService.getTrips()
      .subscribe({
        next: (value: any) => {
          this.trips = value;
          this.tripSearchService.buildIndex(this.trips);
          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          }
          else {
            this.message = 'There were no trips retrieved from the database.';
          }
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      })
  }

  onSearch(): void {
    if (this.searchText.length === 0) {
      this.getstuff();
    }
    else {
      this.trips = this.tripSearchService.searchTrips(this.searchText);
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getstuff();
  }
}
