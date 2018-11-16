import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { CredentialsViewModel, RegistrationViewModel } from './api.service';

 import { ConfigService } from './config.service';

// import { BaseService} from "./base.service";

import { Observable, BehaviorSubject } from 'rxjs';

// Add the RxJS Observable operators we need in this app.

import { map } from 'rxjs/operators';


@Injectable()

export class UserService {

  baseUrl = '';

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private loggedIn = false;

  constructor(private http: Http, private configService: ConfigService) {

    this.loggedIn = !!localStorage.getItem('auth_token');
    // ?? not sure if this the best way to broadcast the status but seems to resolve issue on page refresh where auth status is lost in
    // header component resulting in authed user nav links disappearing despite the fact user is still logged in
    this._authNavStatusSource.next(this.loggedIn);
    this.baseUrl = configService.getApiURI();
  }


   login(userName, password) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
      this.baseUrl + '/auth/login',
      JSON.stringify({ userName, password }), { headers }
      ).pipe(
      map(res => res.json()),
      map(res => {
        localStorage.setItem('auth_token', res.auth_token);
        alert(res.auth_token);
        this.loggedIn = true;
        this._authNavStatusSource.next(true);
        return true;
      })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: number,
    role: string): Observable<RegistrationViewModel> {
    const body = JSON.stringify({ email, password, firstName, lastName, phone, role });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.baseUrl + '/account', body, options)
    .pipe(map(res => res.json()));
  }
}
