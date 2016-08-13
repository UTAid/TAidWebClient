import { Injectable, OpaqueToken } from '@angular/core';
import { Observable } from "rxjs/Observable";


/**
* Interface for services used by FSETComponent to execute CRUD operations on a
* backing database.
*/
export interface IFSETService<T> {
  key (o: T): string;
  readAll(): Observable<Array<T>>;

  create (o: T): Observable<any>;
  read (key: string): Observable<T>;
  update (o: T): Observable<any>;
  delete (o: T): Observable<string>;
}
/**
* Service used by FSET to execute CRUD operations on a backing database.
* Must be injected to FSETComponent.
*/
export const FSETService = new OpaqueToken("app.fse-table.IFSETService");


/**
* Abstract service that uses a local storage to represent a backing database.
* Data is stored as JSON strings.
*/
export abstract class FSETLocalService<T> implements IFSETService<T> {

  private localStore: {[key: string]: string};

  constructor(private data: Array<T>){
    this.localStore = {};
    for (let d of data)
      this.localStore[this.key(d)] = JSON.stringify(d);
  }

  abstract key(o: T): string;

  readAll() {
    return new Observable((ob) => {
      let ret = new Array<T>();
      for (let key in this.localStore)
        ret.push(<T>JSON.parse(this.localStore[key]));
      ob.next(ret);
      ob.complete();
    });
  }

  create(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key])
        ob.error('Key "' + this.key(o) + '" already exists.');
      else {
        this.localStore[this.key(o)] = JSON.stringify(o);
        ob.next(o);
        ob.complete();
      }
    });
  }

  read(key: string) {
    return new Observable((ob) => {
      let ret = <T>JSON.parse(this.localStore[key]);
      if (ret){
        ob.next(ret);
        ob.complete();
      }
      else ob.error('Key "' + key + '" does not exist.');
    });
  }

  update(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key]){
        this.localStore[key] = JSON.stringify(o);
        ob.next(o);
        ob.complete();
      }
      else ob.error('Key "' + key + '" does not exist.');
    });
  }

  delete(o: T) {
    return new Observable((ob) => {
      let key = this.key(o);
      if (this.localStore[key]){
        delete this.localStore[key];
        ob.next(o);
        ob.complete();
      } else ob.error('Key "' + key + '" does not exist.');
    });
  }

}
