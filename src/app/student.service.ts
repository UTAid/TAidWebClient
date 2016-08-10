import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { HttpClient } from './shared';
import { Student } from './student';

@Injectable()
export class StudentService {

  private studentsUrl = '/api/v0/students/';

  constructor(private http: HttpClient) { }

  getStudents(callback: (r: Array<Student>) => void) {
    return this.http.get(this.studentsUrl)
      .map((r) => r.json().results.map(
        (s) => new Student(
          s.university_id, s.student_number,
          s.first_name, s.last_name, s.email
        )))
        .subscribe(callback, this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
