import { Component, OnInit, ViewContainerRef } from '@angular/core';

import {
  fsetConfig, FsetConfig, FsetService,
  emailValidator, nonEmptyValidator
} from './fse-table/';
import { StudentService } from './student.service';
import {Student} from './student';


// FsetComponent configuration.
let studentFsetConfig = fsetConfig([
  { display: 'ID',
    setter: (v, o) => o.university_id = v,
    getter: (o) => o.university_id,
    validator: (o) => nonEmptyValidator(o.university_id, 'ID cannot be empty'),
    disabled: true
  },
  { display: 'First Name',
    setter: (v, o) => o.first_name = v,
    getter: (o) => o.first_name
  },
  { display: 'Last Name',
    setter: (v, o) => o.last_name = v,
    getter: (o) => o.last_name
  },
  { display: 'Email',
    setter: (v, o) => o.email = v,
    getter: (o) => o.email,
    validator: (o) => emailValidator(o.email),
    hide: true
  }], () => new Student('', '', '', '', '')
);


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    { provide: FsetConfig, useValue: studentFsetConfig },
    { provide: FsetService, useClass: StudentService }
  ]
})
export class AppComponent implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {}

}


// @Injectable()
// class StudentLocalService extends FsetLocalService<Student> {
//   key(s: Student) {
//     return s.university_id;
//   }
// }

// let studentList: Student[] = [
//   {
//     university_id: 'testing',
//     student_number: '888888888',
//     first_name: 'Test',
//     last_name: 'Ing',
//     email: 'test.ing@mail.com'
//   },
//   {
//     university_id: 'djangular',
//     student_number: '987654321',
//     first_name: 'Angular',
//     last_name: 'Django',
//     email: 'dj.ango@mail.com'
//   },
//   {
//     university_id: 'leet',
//     student_number: '1337',
//     first_name: 'Sup0r',
//     last_name: 'H4x0r5',
//     email: 'redacted@anonymous.com'
//   },
//   {
//     university_id: '',
//     student_number: '',
//     first_name: 'Oh no,',
//     last_name: 'Empty cells :(',
//     email: ''
//   }
// ];
