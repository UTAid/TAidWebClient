import { Component, OnInit } from '@angular/core';

import {FSETableComponent} from './fse-table/fse-table.component';
import {FSETableContent} from './fse-table/fse-table-content';
import {Student} from './student';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  directives: [FSETableComponent],
})
export class AppComponent implements OnInit{
  studentList: FSETableContent<Student>;

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
    this.studentList = new FSETableContent<Student>(Student.fsetColumnMap, list);
  }

}
