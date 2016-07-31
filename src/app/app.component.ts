import { Component, OnInit } from '@angular/core';

import {FSETComponent, FSETContent, FSETPropertyMap} from './fse-table/';
import {Student} from './student';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  directives: [FSETComponent],
})
export class AppComponent implements OnInit{
  studentList: FSETContent<Student>;

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    let list:Student[] = [
      {
        university_id: "testing",
        student_number: "888888888",
        first_name: "Test",
        last_name: "Ing",
        email: "test.ing@mail.com"
      },
      {
        university_id: "djangular",
        student_number: "987654321",
        first_name: "Angular",
        last_name: "Django",
        email: "dj.ango@mail.com"
      },
      {
        university_id: "leet",
        student_number: "1337",
        first_name: "Sup0r",
        last_name: "H4x0r5",
        email: "redacted@anonymous.com"
      },
      {
        university_id: "",
        student_number: "",
        first_name: "Oh no,",
        last_name: "Empty cells :(",
        email: ""
      }
    ];
    this.studentList = new FSETContent<Student>(studentPropertyMap, list,
      () => new Student());
  }

}

let studentPropertyMap: FSETPropertyMap<Student> = {
  "ID": {
    setter: (v, o) => o.university_id = v,
    getter: (o) => o.university_id,
  },
  "First Name": {
    setter: (v, o) => o.first_name = v,
    getter: (o) => o.first_name,
  },
  "Last Name": {
    setter: (v, o) => o.last_name = v,
    getter: (o) => o.last_name,
  },
  "Email": {
    setter: (v, o) => o.email = v,
    getter: (o) => o.email,
  }
}
