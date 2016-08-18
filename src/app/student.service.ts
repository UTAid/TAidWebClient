import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IFsetService } from './fse-table';
import { Student } from './student';

const URL = 'http://127.0.0.1:8000/api/v0/students/';

@Injectable()
export class StudentService implements IFsetService<Student> {

  private jsonReqHeaders: Headers;
  private jsonResHeaders: Headers;

  constructor (private http: Http, baseReqOptions: RequestOptions) {
    this.jsonReqHeaders = new Headers(baseReqOptions.headers.toJSON());
    this.jsonReqHeaders.append('Content-Type', 'application/json');
    this.jsonResHeaders = new Headers(baseReqOptions.headers.toJSON());
    this.jsonResHeaders.append('Accept', 'application/json');
  }

  key(s: Student) {
    return s.university_id;
  }

  readAll(): Observable<Array<Student>> {
    return this.http.get(URL, {headers: this.jsonResHeaders})
      .map((r) => r.json().results
        .map((s) => new Student(
          s.university_id, s.student_number,
          s.first_name, s.last_name, s.email
        )));
  }

  create(s: Student) {
    return this.http.post(URL, JSON.stringify(s),
      {headers: this.jsonReqHeaders})
      .map((r) => jsonToStudent(r.json()));
  }

  read(key: string) {
    return this.http.get(URL + key + '/', {headers: this.jsonResHeaders})
      .map((r) => jsonToStudent(r.json()));
  }

  update(o: Student) {
    // TODO: Does not support key changes.
    return this.http.put(URL + this.key(o) + '/', JSON.stringify(o),
      {headers: this.jsonReqHeaders})
      .map((r) => jsonToStudent(r.json()));
  }

  delete(s: Student) {
    return this.http.delete(URL + this.key(s) + '/',
      {headers: this.jsonResHeaders});
  }

}

function jsonToStudent(s: any) {
  return new Student(s.university_id, s.student_number,
    s.first_name, s.last_name, s.email);
  }
