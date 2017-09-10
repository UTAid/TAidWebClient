import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IFsetService } from './fset-interface-service';
import { FsetService } from './fset-OT-service';
/**
* Abstract service that uses a local storage to represent a backing database.
* Data is stored as JSON strings.
*/
export abstract class FsetLocalService<T> {

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

  update(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key]) {
        ob.error('Key "' + key + '" already exists.');
      } else {
        this.localStore[key] = JSON.stringify(o);
        ob.next(o);
        ob.complete();
      }
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
