import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import {
  BasicAuthRequestOptions, BasicAuthCridentials, APP_BASE_URL
} from './shared';


import { AppComponent } from './app.component';
import { FsetComponent } from './fse-table/fset.component';
import { CellComponent } from './fse-table/cell/cell.component';
import { ColumnSelectorComponent } from './fse-table/column-selector/column-selector.component';
import { RowAdderComponent } from './fse-table/row-adder/row-adder.component';
import { SearchBarComponent } from './fse-table/search-bar/search-bar.component';
import { TableComponent } from './fse-table/table/table.component';
import { FsecInputDirective } from './fse-table/cell/cell.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { environment, app_base_url } from './';

export function basicAuthFactory(crid: BasicAuthCridentials) {
  return new BasicAuthRequestOptions(crid);
}

export function authCred(){
  return new BasicAuthCridentials('admin', 'admin');
}

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    ColumnSelectorComponent,
    RowAdderComponent,
    SearchBarComponent,
    TableComponent,
    FsetComponent,
    FsecInputDirective,
  ],
  imports: [
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [
    { provide: RequestOptions, useFactory: basicAuthFactory,
      deps: [BasicAuthCridentials] },
    { provide: BasicAuthCridentials,
        useFactory: authCred},
    { provide: APP_BASE_URL, useValue: app_base_url }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
