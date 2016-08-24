import {
  Component, OnInit, Inject
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { RowAdderComponent } from './row-adder';
import { Column, SortOrder } from './shared/column';
import { IFsetConfig, FsetConfig } from './shared/fset-config';
import { IFsetService, FsetService } from './shared/fset.service';
import { Cell } from './shared/cell';
import { SortEvent, CellEditEvent } from './shared/events';


@Component({
  moduleId: module.id,
  directives: [ColumnSelectorComponent, SearchBarComponent,
    TableComponent, RowAdderComponent],
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

  private _cols: Array<Column<T>>; // Array of all columns
  private _rows: Array<T>; // Array of all rows
  private _table: Cell<T>[][]; // Table of cells.
  private filteredRows: Array<T>; // Array of displayed rows

  // Observable for search focus navigation request
  private searchFocusSubject: Subject<any> = new Subject();
  // Observable for add rows request
  private showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number; // Currently selected row

  constructor(
    @Inject(FsetConfig) public config: IFsetConfig<T>,
    @Inject(FsetService) private service: IFsetService<T>) {}

  ngOnInit() {
    this._cols = new Array();
    this._rows = new Array();
    this.filteredRows = new Array();
    // Init columns.
    for (let m of this.config.propertyMap){
      this._cols.push(
        new Column(
          m.display, m.setter, m.getter,
          m.validator, !Boolean(m.hide), Boolean(m.disabled)));
    }
    // Initialize rows by reading all from service.
    // TODO: make fancy loading loops.
    this.service.readAll().subscribe(
      (rows) => { this._rows = rows; this.filteredRows = rows.slice(); },
      (err) => console.error('Error initializing rows: ' + err),
      () => console.log('readall completed')
    );
    // Initialize cell matrix.
    let rindex = 0, cindex = 0;
    for (let r of this._rows) {
      let cRow = new Array<Cell<T>>();
      for (let c of this._cols) {
        cRow.push(new Cell(r, c, rindex, cindex));
        cindex += 1;
      }
      this._table.push(cRow);
      rindex += 1;
    }
  }

  /** Get the rows currently displayed */
  get shownRows() {
    return this.filteredRows;
  }

  /** Get the columns currently displayed */
  get shownCols() {
    return this._cols.filter((c) => c.show);
  }

  /** Get the row height */
  get height() {
    return this.filteredRows.length;
  }

  /** Get the column width */
  get width() {
    return this._cols.filter((c) => c.show);
  }

  // Get the index of the speicified row within this._rows (not filteredRows).
  // Uses the key function from IFSETService.
  private indexOfRow(row: T) {
    let rowKey = this.service.key(row);
    return this._rows.findIndex((c) => this.service.key(c) === rowKey);
  }

  protected selectRow(cell: Cell<T>) {
    this.selRow = cell.rowi;
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
      this.filteredRows = this._rows.filter((r) => {
        for (let col of this._cols) {
          if (nullToEmpty(col.getter(r)).toLowerCase().indexOf(term) >= 0) {
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
    this.filteredRows = this._rows.slice(0);
  }

  protected sortContent(s: SortEvent<T>) {
    let col = s.col;
    switch (s.sortOrder) {
      case SortOrder.ASC:
        this.filteredRows.sort((a, b) => sort(
          nullToEmpty(col.getter((a))).toLowerCase(),
          nullToEmpty(col.getter((b))).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.filteredRows.sort((a, b) => -1 * sort(
          nullToEmpty(col.getter((a))).toLowerCase(),
          nullToEmpty(col.getter((b))).toLowerCase()));
        break;
    }
  }

  protected addRows(rows: T[]) {
    for (let r of rows) {
      this.service.create(r).subscribe((updatedT) => {
        this._rows.push(updatedT);
        this.filteredRows.push(this._rows[this._rows.length - 1]);
      }, (err) => console.log('error creating row ' + err));
    }
  }

  /*
  * Edit the row's properties.
  * editInfo: [rowIndex, newValue, rowProperty]
  */
  protected editRow(edit: CellEditEvent<T>) {
    let row = edit.cell.row;
    let oldVal = edit.cell.value;
    let index = this.indexOfRow(row);
    // Edit the row to have the new value
    edit.cell.value = edit.newValue;
    this.service.update(row).subscribe(
      (updatedT) => { // Update row with response.
        this._rows[index] = updatedT;
        this.filteredRows[edit.cell.rowi] = updatedT;
      },
      (err) => { // Change back to old value on error.
        console.log('error editing row ' + err);
        edit.cell.value = oldVal;
      },
    () => console.log('edit completed'));
  }

  protected removeRow() {
    this.service.delete(this.filteredRows[this.selRow])
      .subscribe(() => {
        let row = this.filteredRows.splice(this.selRow, 1)[0];
        this._rows.splice(this.indexOfRow(row), 1);
      }, (err) => console.log('error deleting row ' + err));
  }
}

function sort(a: string, b: string) {
  if (a > b) { return 1; }
  if (a < b) { return -1; }
  return 0;
}

function nullToEmpty(str: string) {
  if (str == null) { return ''; }
  return str;
}
