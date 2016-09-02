import {
  Component, OnInit, Inject
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { Column } from './shared/column';
import { IFsetConfig, FsetConfig } from './shared/fset-config';
import { IFsetService, FsetService } from './shared/fset.service';
import { Table } from './shared/table';
import { SortEvent, CellEditEvent, CellEvent } from './shared/events';
import { nullToEmpty } from './shared/utils';


@Component({
  moduleId: module.id,
  selector: 'fset-component',
  templateUrl: 'fset.component.html',
  styleUrls: ['fset.component.css'],
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

  protected selectRow(cellEvent: CellEvent<T>) {
    this.selRow = cellEvent.rowi;
  }

  protected showRowAdder() {
    this.showRowAdderSubject.next(undefined);
  }

  protected focusSearch() {
    this.searchFocusSubject.next(undefined);
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

  // Clear row filter.
  protected removeSearch() {
    this.table.removeFilter();
  }

  protected sortContent(s: SortEvent<T>) {
    this.table.sort(s);
  }

  protected addRows(table: Table<T>) {
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
  protected editRow(edit: CellEditEvent<T>) {
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

  protected removeRow() {
    this.service.delete(this.table.row(this.selRow).underlyingModel)
      .subscribe(() => {
        this.table.deleteRow(this.selRow);
      }, (err) => console.log('error deleting row ' + err));
  }

  protected isRemoveRowDisabled() {
    return this.selRow < 0 ||
      this.selRow >= this.table.rowLen ||
      !this.table.row(this.selRow).show;
  }
}
