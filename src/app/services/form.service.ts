import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../models/country';
import { State } from '../models/state';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private countriesUrl ='http://localhost:8888/api/countries/';
  private statesUrl ='http://localhost:8888/api/states';

  constructor(private http: HttpClient) { }

  getCreditCardMonths(startMonth: number) : Observable<number[]> {
    let data: number[] =[];

    for (let month= startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears() : Observable<number[]> {
    let data: number[] =[];
    let startYear =new Date().getFullYear();
    let endYear =startYear + 10;

    for (let year=startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

  getCountries() : Observable<Country[]> {
    return this.http.get<GetResponseCountries>(this.countriesUrl).pipe(map(
      response => {
        return response._embedded.countries;
      }
    ));
  }

  getStates(countryCode: string) : Observable<State[]> {
    const searchUrl =`${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.http.get<GetResponseStates>(searchUrl).pipe(map(
      response => {
        return response._embedded.states;
      }
    ))
  }

}

interface GetResponseCountries {
  _embedded : {
    countries : Country[]
  }
}

interface GetResponseStates {
  _embedded : {
    states : State[]
  }
}
