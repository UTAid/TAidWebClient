import { Injectable } from '@angular/core';
import { BaseRequestOptions } from '@angular/http';

import { BasicAuthCridentials } from './basic-auth-cridentials';
/**
* HTTP request options with basic auth to override default headers.
*/
@Injectable()
export class BasicAuthRequestOptions extends BaseRequestOptions {

  constructor(cridentials: BasicAuthCridentials) {
    super();
    this.headers.append('Authorization', cridentials.getValue());
    this.headers.append('Content-Type', 'application/json');
  }

}
