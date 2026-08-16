import { Injectable } from '@angular/core';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripSearchService {

  private index = new Map<string, Set<Trip>>();

  constructor() { }

  private tokenize(text: string): string[] {
    return text.toLowerCase().split(/[\s,.!]/).filter(t => t.length > 0);
  }

  buildIndex(trips: Trip[]): void {
    this.index.clear();
    for (const trip of trips) {
      const tokens = this.tokenize(`${trip.name} ${trip.description}`);
      for (const token of tokens) {
        if (!this.index.has(token)) {
          this.index.set(token, new Set<Trip>());
        }
        this.index.get(token)!.add(trip);
      }
    }
  }

  searchTrips(query: string): Trip[] {
    const tokens = this.tokenize(query);
    if (tokens.length === 0)
      return [];

    let results: Trip[] = [];

    for (const token of tokens) {
      if (this.index.has(token)) {
        const matchingTrips = this.index.get(token);

        if (matchingTrips)
          results.push(...matchingTrips)
      }
    }

    return results;
  }
}
