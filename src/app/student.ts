export class Student{
  university_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;

  static fsetColumnMap: {[id:string]: string;} = {
    "university_id": "ID",
    "first_name": "First Name",
    "last_name": "Last Name",
    "email": "Email",
  };
}
