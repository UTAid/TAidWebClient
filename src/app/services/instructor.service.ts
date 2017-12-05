import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IFsetService } from '../fse-table';
import { Instructor } from '../structure/instructor';

const URL = 'http://127.0.0.1:8000/api/v0/instructors/';

@Injectable()
export class InstructorService implements IFsetService<Instructor> {

  constructor (private http: Http) {}

  key(s: Instructor) {
    return s.university_id;
  }

  readAll(): Observable<Array<Instructor>> {
    return this.http.get(URL)
      .map((r) => r.json()
        .map((s) => new Instructor(
          s.university_id, s.first_name, s.last_name, s.email
        )));
  }

  create(s: Instructor) {
    return this.http.post(URL, instructorToJson(s))
      .map((r) => jsonToInstructor(r.json()));
  }

  read(key: string) {
    return this.http.get(URL + key + '/')
      .map((r) => jsonToInstructor(r.json()));
  }

  update(o: Instructor) {
    // TODO: Does not support key changes.
    return this.http.put(URL + this.key(o) + '/', instructorToJson(o))
      .map((r) => jsonToInstructor(r.json()));
  }

  delete(s: Instructor) {
    return this.http.delete(URL + this.key(s) + '/');
  }

}

function jsonToInstructor(s: any) {
  return new Instructor(s.university_id, s.first_name, s.last_name, s.email);
}

function instructorToJson(s: Instructor) {
  return {
    university_id: s.university_id,
    first_name: s.first_name,
    last_name: s.last_name,
    email: s.email
  };
}
