import { Observable } from 'rxjs/Observable';

/**
* Interface for services used by FSETComponent to execute CRUD operations on a
* backing database.
*/
export interface IFsetService<T> {
  key (o: T): string;
  readAll(): Observable<Array<T>>;
  create (o: T): Observable<T>;
  read (key: string): Observable<T>;
  update (o: T): Observable<T>;
  delete (o: T): Observable<any>;
}