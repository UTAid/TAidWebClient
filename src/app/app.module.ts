import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FsetComponent } from './fse_table/fset.component';
import { CellComponent } from './fse_table/cell/cell.component';
import { ColumnSelectorComponent } from './fse_table/column-selector/column-selector.component';
import { RowAdderComponent } from './fse_table/row-adder/row-adder.component';
import { SearchBarComponent } from './fse_table/search-bar/search-bar.component';
import { TableComponent } from './fse_table/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    FsetComponent,
    CellComponent,
    ColumnSelectorComponent,
    RowAdderComponent,
    SearchBarComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
