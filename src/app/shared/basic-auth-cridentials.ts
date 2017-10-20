import { Injectable } from '@angular/core';

/**
* Cridential model for basic authentication.
*/
@Injectable()
export class BasicAuthCridentials {
  constructor (public username: string, public password: string) {}

  public getValue() {
    return `Basic ${btoa(`${this.username}:${this.password}`)}`;
  }
}
