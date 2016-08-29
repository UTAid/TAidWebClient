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
import { Row } from './shared/row';
import { SortEvent, CellEditEvent, CellEvent } from './shared/events';


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

  private cols: Array<Column<T>>; // Array of all columns
  // private _rows: Array<T>; // Array of all rows
  private table: Row<T>[]; // Table of cells.
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
    this.cols = new Array();
    // Init columns.
    for (let m of this.config.propertyMap){
      this.cols.push(
        new Column(
          m.display, m.setter, m.getter,
          m.validator, !Boolean(m.hide), Boolean(m.disabled)));
    }
    // Initialize rows by reading all from service.
    // TODO: make fancy loading loops.
    this.table = [];
    this.service.readAll().subscribe(
      (rows) => {
        for (let r of rows) { this.table.push(new Row(r, this.cols, true)); }
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
      for (let row of this.table) {
        row.show = false; // First hide the row.
        for (let cell of row.cells) {
          // If any cell matches the search term, show this row.
          if (nullToEmpty(cell.value).toLowerCase().indexOf(term) >= 0) {
            row.show = true;
            break; // Skip to next row
          }
        }
      }
    } else {
      this.removeSearch();
    }
  }

  // Clear row filter.
  protected removeSearch() {
    for (let row of this.table) { row.show = true; }
  }

  protected sortContent(s: SortEvent<T>) {
    switch (s.sortOrder) {
      case SortOrder.ASC:
        this.table.sort((a, b) => sort(
          nullToEmpty(a.cells[s.coli].value).toLowerCase(),
          nullToEmpty(b.cells[s.coli].value).toLowerCase()));
        break;
      case SortOrder.DEC:
        this.table.sort((a, b) => -1 * sort(
          nullToEmpty(a.cells[s.coli].value).toLowerCase(),
          nullToEmpty(b.cells[s.coli].value).toLowerCase()));
        break;
    }
  }

  protected addRows(table: Row<T>[]) {
    for (let row of table) {
      let r = row.underlyingModel;
      this.service.create(r).subscribe((updatedT) => {
        this.table.push(new Row(updatedT, this.cols, true));
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
        this.table[edit.rowi] = new Row(updatedT, this.cols, true);
      },
      (err) => { // Change back to old value on error.
        console.log('error editing row ' + err);
        this.table[edit.rowi].cells[edit.coli].value = oldVal;
      },
    () => console.log('edit completed'));
  }

  protected removeRow() {
    this.service.delete(this.table[this.selRow].underlyingModel)
      .subscribe(() => {
        this.table.splice(this.selRow, 1);
      }, (err) => console.log('error deleting row ' + err));
  }

  protected isRemoveRowDisabled() {
    return this.selRow < 0 ||
      this.selRow > this.table.length ||
      !this.table[this.selRow].show;
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
