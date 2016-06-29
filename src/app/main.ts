import { bootstrap } from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS, XSRFStrategy,
        CookieXSRFStrategy, RequestOptions} from '@angular/http';

import { WithCridRequestOptions } from './with-crid-request-options';
import { AppComponent }   from './app.component';

bootstrap(
  AppComponent,
  [HTTP_PROVIDERS,
    {provide: XSRFStrategy, useValue: new CookieXSRFStrategy('csrftoken','X-CSRFToken')},
    {provide: RequestOptions, useClass: WithCridRequestOptions},
  ]
).catch(err => console.error(err));
