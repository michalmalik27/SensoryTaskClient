import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import Person from '../models/person';
import Profession from '../models/profession';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl = 'https://localhost:44392/api';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getProfessions(): Observable<Profession[]> {
    return this.http.get<Profession[]>(`${this.baseUrl}/profession`);
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}/person`);
  }

  deletePerson(person: Person): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/person/${person.personId}`);
  }

  addPerson(person: Person): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/person`, person,this.httpOptions);
  }

  updatePerson(person: Person): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/person`, person,this.httpOptions);
  }
}
