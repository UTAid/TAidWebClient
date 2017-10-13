import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { RowAdderComponent } from './row-adder';
import { Column } from './shared/column';
import { IFsetConfig, FsetConfig } from './shared/fset-config';
import { IFsetService, FsetService } from './shared/fset.service';
import { Table } from './shared/table';
import { SortEvent, CellEditEvent, CellEvent } from './shared/events';
import { nullToEmpty } from './shared/utils';

@Component({
  moduleId: module.id,
  selector: 'fset-component',
  templateUrl: './fset.component.html',
  styleUrls: ['./fset.component.scss']
})
/**
* A Filterable, Sortable, and Editable Table (FSET) component, backed by a
* database containing rows of type `<T>`. Users can add, remove, and edit rows.
*
* Depends on `FSETConfig` to specify configuration, and `FSETService` to provide
* CRUD operations on the backing database.
*/
export class FsetComponent<T> implements OnInit {

  private table: Table<T>; // Table of cells.
  // private filteredRows: Array<T>; // Array of displayed rows

  // Observable for search focus navigation request
  private searchFocusSubject: Subject<any> = new Subject();
  // Observable for add rows request
  private showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number; // Currently selected row

  constructor() { }

  ngOnInit() {
  }

  // Get the index of the speicified row within this._rows (not filteredRows).
  // Uses the key function from IFSETService.
  // private indexOfRow(row: T) {
  //   let rowKey = this.service.key(row);
  //   return this._rows.findIndex((c) => this.service.key(c) === rowKey);
  // }

  protected selectRow(cellEvent: CellEvent<T>) {
    this.selRow = cellEvent.rowi;
  }

  protected focusSearch() {
    this.searchFocusSubject.next(undefined);
  }

  protected showRowAdder() {
    this.showRowAdderSubject.next(undefined);
  }

  // Clear row filter.
  protected removeSearch() {
    this.table.removeFilter();
  }

  // Execute search (filter)
  protected applySearch(term: string) {
    if (term) {
      term = term.toLowerCase();
      this.table.filterRows((r) => {
        for (let c of this.table.cols) {
          // If any cell matches the search term, show this row.
          if (nullToEmpty(c.getter(r)).toLowerCase().indexOf(term) >= 0) {
            return true;
          }
        }
        return false;
      });
    } else {
      this.removeSearch();
    }
  }

  protected sortContent(s: SortEvent<T>) {
    this.table.sort(s);
  }

  protected isRemoveRowDisabled() {
    return this.selRow < 0 ||
      this.selRow >= this.table.rowLen ||
      !this.table.row(this.selRow).show;
  }


}
