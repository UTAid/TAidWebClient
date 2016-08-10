import { Component, OnInit, ViewContainerRef } from '@angular/core';

import {FSETComponent, FSETContent, FSETPropertyMap} from './fse-table/';
import {Student} from './student';
import {HttpClient} from './shared';
import {StudentService} from './student.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [StudentService, HttpClient],
  directives: [FSETComponent],
})
export class AppComponent implements OnInit{
  studentList: FSETContent<Student>;

  constructor(public viewContainerRef: ViewContainerRef,
    private studentService: StudentService){ }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {

    this.studentService.getStudents((r) => {
      this.studentList = new FSETContent<Student>(studentPropertyMap, r,
        () => new Student('', '', '', '', ''));
    });
    // let list:Student[] = [
    //   {
    //     university_id: "testing",
    //     student_number: "888888888",
    //     first_name: "Test",
    //     last_name: "Ing",
    //     email: "test.ing@mail.com"
    //   },
    //   {
    //     university_id: "djangular",
    //     student_number: "987654321",
    //     first_name: "Angular",
    //     last_name: "Django",
    //     email: "dj.ango@mail.com"
    //   },
    //   {
    //     university_id: "leet",
    //     student_number: "1337",
    //     first_name: "Sup0r",
    //     last_name: "H4x0r5",
    //     email: "redacted@anonymous.com"
    //   },
    //   {
    //     university_id: "",
    //     student_number: "",
    //     first_name: "Oh no,",
    //     last_name: "Empty cells :(",
    //     email: ""
    //   }
    // ];
    // this.studentList = new FSETContent<Student>(studentPropertyMap, list,
    //   () => new Student('', '', '', '', ''));
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
