
import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Http, Headers } from '@angular/http';

import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'my-app',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES ],
  providers: [ AuthenticationService ],
  templateUrl: "app/app.component.html",
})

export class AppComponent{
  studentList: string;
  isLogon: boolean;

  constructor(public http: Http, private authService: AuthenticationService) {
    this.isLogon = false;
  }

  private logError(err: any) {
    console.error('There was an error: ' + err);
  }

  private saveJwt(jwt: any) {
    if(jwt) {
      localStorage.setItem('id_token', jwt)
    }
  }

  authenticate(username: any, password: any) {
    this.authService.login(username.value, password.value)
    .then(res => {
      console.log("Login Successful");
      this.isLogon = true;
    })
    .catch(err => this.logError("Login failed: " + err));
  }

  logout() {
    this.authService.logout()
    .then(res => {
      console.log("Logout Successful");
      this.isLogon = false;
    });
  }

  getStudents() {
    this.http.get('http://localhost:8000/api/v0/students/?format=json')
      .subscribe(
      data => this.studentList = JSON.stringify(data.json(), null, 2),
      err => this.studentList = "Could not fetch students: " + err,
      () => console.log('student fetch complete')
    );

  }

}
