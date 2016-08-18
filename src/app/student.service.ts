import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IFsetService } from './fse-table';
import { Student } from './student';

const URL = 'http://127.0.0.1:8000/api/v0/students/';
const FORMAT = '?format=json';

@Injectable()
export class StudentService implements IFsetService<Student> {

  constructor (private http: Http) {}

  key(s: Student) {
    return s.university_id;
  }

  readAll(): Observable<Array<Student>> {
    return this.http.get(URL + FORMAT)
      .map((r) => r.json().results
        .map((s) => new Student(
          s.university_id, s.student_number,
          s.first_name, s.last_name, s.email
        )));
  }

  create(s: Student) {
    return this.http.post(URL, JSON.stringify(s));
  }

  read(key: string) {
    return this.http.get(URL + key + '/' + FORMAT)
      .map((r) => {
        let s = r.json();
        return new Student(s.university_id, s.student_number,
          s.first_name, s.last_name, s.email);
      });
  }

  update(oldKey: string, o: Student) {
    // TODO: Does not support key changes.
    return this.http.put(URL + this.key(o) + '/', JSON.stringify(o));
  }

  delete(s: Student) {
    return this.http.delete(URL + this.key(s) + '/');
  }

}
