import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { FsetComponent } from './fse_table/fset.component';
import { CellComponent } from './fse_table/cell/cell.component';
import { ColumnSelectorComponent } from './fse_table/column-selector/column-selector.component';
import { RowAdderComponent } from './fse_table/row-adder/row-adder.component';
import { SearchBarComponent } from './fse_table/search-bar/search-bar.component';
import { TableComponent } from './fse_table/table/table.component';
import { FsecInputDirective } from './fse_table/cell/cell.directive';

@NgModule({
  declarations: [
    AppComponent,
    FsetComponent,
    CellComponent,
    ColumnSelectorComponent,
    RowAdderComponent,
    SearchBarComponent,
    TableComponent,
    FsecInputDirective,
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
