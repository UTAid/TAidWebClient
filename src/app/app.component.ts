import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Http, Headers } from '@angular/http';

import {Student} from "./student";
import {FSETableComponent} from "./fse-table/fse-table.component";
import {FSETableContent} from "./fse-table/fse-table-content";
import { AuthenticationService } from './authentication.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, FSETableComponent ],
  providers: [ AuthenticationService ],
  templateUrl: "app.component.html",
})

export class AppComponent{
  studentList: FSETableContent<Student>;
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
    let list:Student[] = [
      {
        university_id: "999999999",
        student_number: "888888888",
        first_name: "Test",
        last_name: "Ing",
        email: "test.ing@mail.com"
      },
      {
        university_id: "123456789",
        student_number: "987654321",
        first_name: "Angular",
        last_name: "Django",
        email: "dj.ango@mail.com"
      }
    ];
    this.studentList = new FSETableContent<Student>(Student.fsetColumnMap, list);
  }

}
