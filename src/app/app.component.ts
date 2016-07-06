import { Component } from '@angular/core';

import {FSETableComponent} from './fse-table/fse-table.component';
import {FSETableContent} from './fse-table/fse-table-content';
import {Student} from './student';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  directives: [FSETableComponent],
  styleUrls: ['app.component.css']
})
export class AppComponent {
  studentList: FSETableContent<Student>;

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
