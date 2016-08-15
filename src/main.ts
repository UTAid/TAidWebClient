import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS, RequestOptions } from '@angular/http';

import { AppComponent, environment, app_base_url } from './app/';
import {
  BasicAuthRequestOptions, BasicAuthCridentials, APP_BASE_URL
} from './app/shared';

if (environment.production) {
  enableProdMode();
}

function basicAuthFactory(crid: BasicAuthCridentials) {
  return new BasicAuthRequestOptions(crid);
}

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  { provide: RequestOptions, useFactory: basicAuthFactory,
    deps: [BasicAuthCridentials] },
  { provide: BasicAuthCridentials,
    useValue: new BasicAuthCridentials('admin', 'admin') },
  { provide: APP_BASE_URL, useValue: app_base_url }
]);
