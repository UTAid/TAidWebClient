import { Injectable, Inject } from '@angular/core';
import {
  Http, Request, RequestOptions, RequestOptionsArgs, ConnectionBackend,
  Response
} from '@angular/http';
import { isString } from '@angular/http/src/facade/lang';

import { Observable } from 'rxjs/Observable';

import { APP_BASE_URL } from './config-injectables';


/**
* Wrapper around the HTTP service to automatically prepend the base URL of the
* backend.
*/
@Injectable()
export class HttpClient{

  constructor(
    private http: Http,
    @Inject(APP_BASE_URL) protected _baseUrl: string)
  {
    console.log(this.resolveUrl('/testing/loool'));
  }

  resolveUrl(url: string): string{
    return this._baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
  }

  // request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
  //   if (isString(url)) url = this.resolveUrl(<string>url);
  //   else if (url instanceof Request) url.url = this.resolveUrl(url.url);
  //   return this.http.request(url, options);
  // }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.get(this.resolveUrl(url), options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.post(this.resolveUrl(url), body, options);
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.put(this.resolveUrl(url), body, options);
  }

  delete (url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.delete(this.resolveUrl(url), options);
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.patch(this.resolveUrl(url), body, options);
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.head(this.resolveUrl(url), options);
  }

}
