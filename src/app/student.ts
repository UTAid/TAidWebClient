export class Student{
  university_id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  email: string;

  static fsetColumnMap: {
    [dispName: string]: {
      setter: (v: string, o: Student) => void,
      getter: (o: Student) => string
    } } =
    {
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
      },
    };
}
