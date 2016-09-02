import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Ng2BootstrapModule } from 'ng2-bootstrap';

import { FsetComponent } from './fset.component';
import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { RowAdderComponent } from './row-adder';
import { CellComponent, CellInputDirective } from './cell';


@NgModule({
  declarations: [
    FsetComponent,
    ColumnSelectorComponent,
    SearchBarComponent,
    TableComponent,
    RowAdderComponent,
    CellComponent,
    CellInputDirective
  ],
  imports: [
    FormsModule,
    CommonModule,
    Ng2BootstrapModule
  ],
  exports: [
    FsetComponent
  ]
})
export class FsetModule {}
