import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://gorest.co.in/public/v2/users');
  }

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
}
