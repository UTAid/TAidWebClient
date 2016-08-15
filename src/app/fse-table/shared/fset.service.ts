import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';


/**
* Interface for services used by FSETComponent to execute CRUD operations on a
* backing database.
*/
export interface IFsetService<T> {
  key (o: T): string;
  readAll(): Observable<Array<T>>;

  create (o: T): Observable<any>;
  read (key: string): Observable<T>;
  update (oldKey: string, o: T): Observable<any>;
  delete (o: T): Observable<string>;
}
/**
* Service used by FSET to execute CRUD operations on a backing database.
* Must be injected to FSETComponent.
*/
export const FsetService = new OpaqueToken('app.fse-table.IFSETService');


/**
* Abstract service that uses a local storage to represent a backing database.
* Data is stored as JSON strings.
*/
export abstract class FsetLocalService<T> implements IFsetService<T> {

  private localStore: {[key: string]: string};

  constructor(private data: Array<T>) {
    this.localStore = {};
    for (let d of data) {
      this.localStore[this.key(d)] = JSON.stringify(d);
    }
  }

  abstract key(o: T): string;

  readAll() {
    return new Observable((ob) => {
      let ret = new Array<T>();
      for (let key in this.localStore) {
        if (this.localStore.hasOwnProperty(key)) {
          ret.push(<T>JSON.parse(this.localStore[key]));
        }
      }
      ob.next(ret);
      ob.complete();
    });
  }

  create(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key]) {
        ob.error('Key "' + this.key(o) + '" already exists.');
      } else {
        this.localStore[this.key(o)] = JSON.stringify(o);
        ob.next(o);
        ob.complete();
      }
    });
  }

  read(key: string) {
    return new Observable((ob) => {
      let ret = <T>JSON.parse(this.localStore[key]);
      if (ret) {
        ob.next(ret);
        ob.complete();
      } else {
        ob.error('Key "' + key + '" does not exist.');
      }
    });
  }

  update(oldKey: string, o: T) {
    return new Observable((ob) => {
      let newKey = this.key(o);
      // Check if oldKey exists
      if (!this.localStore[oldKey]) {
        ob.error('Key "' + oldKey + '" does not exist.');
        return;
      }
      // If newKey is different, check to see if newKey exists.
      if (oldKey !== newKey) {
        if (this.localStore[newKey]) {
          ob.error('Cannot update old key "' + oldKey + '" to new key "'
            + newKey + '". New key already exists.');
        } else { // Delete old key.
          delete this.localStore[oldKey];
        }
      }
      this.localStore[newKey] = JSON.stringify(o);
    });
  }

  delete(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key]) {
        delete this.localStore[key];
        ob.next(o);
        ob.complete();
      } else {
        ob.error('Key "' + key + '" does not exist.');
      }
    });
  }

}
