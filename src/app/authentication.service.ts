import {Injectable} from '@angular/core'
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {

  constructor (private http: Http) { }

  public login(username: string, password: string): Promise<Response> {

    let creds = "username=" + username + "&password=" + password;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post('http://localhost:8000/api-auth/login/?format=json',
      creds, { headers: headers })
      .toPromise()
      .then(
      res => {
        if (res.status == 200) throw res;
        else return res;
      },
      err=> {
        // Currently, an unhandled 302 response causes a low-level error.
        // The respons returned by the rejection has a 200 code due to defaults
        // set by BasicResponseOptions
        // TODO: consider how redirection is to be handled.
        if (err.status == 200) return Promise.resolve(err);
      });
  }

  public logout(): Promise<Response> {
    return this.http.get('http://localhost:8000/api-auth/logout/?format=json')
    .toPromise()
    .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
