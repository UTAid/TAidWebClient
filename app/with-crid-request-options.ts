import {BaseRequestOptions} from '@angular/http';

export class WithCridRequestOptions extends BaseRequestOptions {
  constructor() {
    super();
    this.withCredentials = true;
  }
}
