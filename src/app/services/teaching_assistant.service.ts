import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { IFsetService } from '../fse-table';
import { Teaching_Assistant } from '../structure/teaching_assistant';

const URL = 'http://127.0.0.1:8000/api/v0/teaching_assistants/';

@Injectable()
export class TeachingAssistantService implements IFsetService<Teaching_Assistant> {


  constructor (private http: Http) {}

  key(s: Teaching_Assistant) {
    return s.university_id;
  }

  readAll(): Observable<Array<Teaching_Assistant>> {
    return this.http.get(URL)
      .map((r) => r.json()
        .map((s) => new Teaching_Assistant(
          s.university_id, s.first_name, s.last_name, s.email
        )));
  }

  create(s: Teaching_Assistant) {
    return this.http.post(URL, teachingAssistantToJson(s))
      .map((r) => jsonToTeachingAssistant(r.json()));
  }

  read(key: string) {
    return this.http.get(URL + key + '/')
      .map((r) => jsonToTeachingAssistant(r.json()));
  }

  update(o: Teaching_Assistant) {
    // TODO: Does not support key changes.
    return this.http.put(URL + this.key(o) + '/', teachingAssistantToJson(o))
      .map((r) => jsonToTeachingAssistant(r.json()));
  }

  delete(s: Teaching_Assistant) {
    return this.http.delete(URL + this.key(s) + '/');
  }

}

function jsonToTeachingAssistant(s: any) {
  return new Teaching_Assistant(s.university_id, s.first_name, s.last_name, s.email);
}

function teachingAssistantToJson(s: Teaching_Assistant) {
  return {
    university_id: s.university_id,
    first_name: s.first_name,
    last_name: s.last_name,
    email: s.email
  };
}
