import {
  Component, OnInit, Inject
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { BatchRowAdderComponent } from './batch-row-adder';
import { Column } from './shared/column';
import { IFsetConfig } from './shared/fset-config-map-interface';
import { IFsetService } from './shared/fset-interface-service';
import { FsetService } from './shared/fset-OT-service';
import { FsetConfig } from './shared/fset-config-OT';
import { Table } from './shared/table';
import { SortEvent, CellEditEvent, CellEvent } from './shared/events';
import { nullToEmpty } from './shared/utils';


@Component({
  selector: 'fset-component',
  templateUrl: 'fset.component.html',
  styleUrls: ['fset.component.scss'],
})
/**
* A Filterable, Sortable, and Editable Table (FSET) component, backed by a
* database containing rows of type `<T>`. Users can add, remove, and edit rows.
*
* Depends on `FSETConfig` to specify configuration, and `FSETService` to provide
* CRUD operations on the backing database.
*/
export class FsetComponent<T> implements OnInit {

  public table: Table<T>; // Table of cells.
  // private filteredRows: Array<T>; // Array of displayed rows

  // Observable for search focus navigation request
  public searchFocusSubject: Subject<any> = new Subject();
  // Observable for add rows request
  public showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number; // Currently selected row

  constructor(
    @Inject(FsetConfig) public config: IFsetConfig<T>,
    @Inject(FsetService) private service: IFsetService<T>) {}

  ngOnInit() {
    let cols: Column<T>[] = new Array();
    // Init columns.
    for (let m of this.config.propertyMap){
      cols.push(
        new Column(
          m.display, m.setter, m.getter,
          m.validator, !Boolean(m.hide), Boolean(m.disabled)));
    }
    this.table = new Table(cols);
    // Initialize rows by reading all from service.
    // TODO: make fancy loading loops.
    this.service.readAll().subscribe(
      (rows) => {
        for (let r of rows) { this.table.pushRow(r); }
      },
      (err) => console.error('Error initializing rows: ' + err),
      () => console.log('readall completed')
    );
    this.selRow = -1;
  }

  // Get the index of the speicified row within this._rows (not filteredRows).
  // Uses the key function from IFSETService.
  // private indexOfRow(row: T) {
  //   let rowKey = this.service.key(row);
  //   return this._rows.findIndex((c) => this.service.key(c) === rowKey);
  // }

  public selectRow(cellEvent: CellEvent<T>) {
    this.selRow = cellEvent.rowi;
  }

  public focusSearch() {
    this.searchFocusSubject.next(undefined);
  }

  public showRowAdder() {
    this.showRowAdderSubject.next(undefined);
  }

  // Execute search (filter)
  public applySearch(term: string) {
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

  // Clear row filter.
  public removeSearch() {
    this.table.removeFilter();
  }

  public sortContent(s: SortEvent<T>) {
    this.table.sort(s);
  }

  public addRows(table: Table<T>) {
    for (let row of table.rows) {
      let r = row.underlyingModel;
      this.service.create(r).subscribe((updatedT) => {
        this.table.pushRow(r);
      }, (err) => console.log('error creating row ' + err));
    }
  }

  /*
  * Edit the row's properties.
  * editInfo: [rowIndex, newValue, rowProperty]
  */
  public editRow(edit: CellEditEvent<T>) {
    let oldVal = edit.cell.value;
    // Edit the row to have the new value
    edit.cell.value = edit.newValue;
    this.service.update(edit.cell.model).subscribe(
      (updatedT) => { // Update row with response.
        this.table.updateRow(edit.rowi, updatedT);
      },
      (err) => { // Change back to old value on error.
        console.log('error editing row ' + err);
        this.table[edit.rowi].cells[edit.coli].value = oldVal;
      },
    () => console.log('edit completed'));
  }

  public removeRow() {
    this.service.delete(this.table.row(this.selRow).underlyingModel)
      .subscribe(() => {
        this.table.deleteRow(this.selRow);
      }, (err) => console.log('error deleting row ' + err));
  }

  public isRemoveRowDisabled() {
    return this.selRow < 0 ||
      this.selRow >= this.table.rowLen ||
      !this.table.row(this.selRow).show;
  }
}
