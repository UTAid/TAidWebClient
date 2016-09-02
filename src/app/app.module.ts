import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { FsetModule } from './fse-table/';
import { BasicAuthRequestOptions, BasicAuthCridentials } from './shared';


function basicAuthFactory(crid: BasicAuthCridentials) {
  return new BasicAuthRequestOptions(crid);
}


@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      HttpModule,
      FsetModule
    ],
    providers: [
      { provide: RequestOptions, useFactory: basicAuthFactory, deps: [BasicAuthCridentials] },
      { provide: BasicAuthCridentials, useValue: new BasicAuthCridentials('admin', 'admin') }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
