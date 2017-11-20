import {
  Component, OnInit, Inject, Output, EventEmitter
} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import { ColumnSelectorComponent } from './column-selector';
import { SearchBarComponent } from './search-bar';
import { TableComponent } from './table';
import { BatchRowAdderComponent } from './batch-row-adder';
import { RowAdderComponent } from './row-adder';
import { UndoActionComponent } from './undo-action';

import { Column } from './shared/column';
import { IFsetConfig } from './shared/fset-config-map-interface';
import { IFsetService } from './shared/fset-interface-service';
import { FsetService } from './shared/fset-OT-service';
import { FsetConfig } from './shared/fset-config-OT';
import { Table, Row } from './shared/table';
import { Cell } from './shared/cell'
import { SortEvent, CellEditEvent, CellEvent } from './shared/events';
import { nullToEmpty } from './shared/utils';
import { RecentActions, EditCellOperation, DeleteRowOperation,
  Operations, AddRowOperation, EditRowOperation } from './shared/recent_actions';


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
  public actions: RecentActions;

  // private filteredRows: Array<T>; // Array of displayed rows

  // Observable for search focus navigation request
  public searchFocusSubject: Subject<any> = new Subject();
  // Observable for add rows request
  public showRowAdderSubject: Subject<any> = new Subject();

  private selRow: number; // Currently selected row
  public activeRowAdder: boolean = false;

  @Output() message = new EventEmitter<string>();

  constructor(
    @Inject(FsetConfig) public config: IFsetConfig<T>,
    @Inject(FsetService) private service: IFsetService<T>) {}

  ngOnInit() {
    this.actions = new RecentActions();

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

  setMessage(message:string):void{
    this.message.emit(message);
    // scroll document to top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    setTimeout(() =>
    {
      this.message.emit("");
    },
    3000);
  }

  checkKeyPresent(status:boolean):void{
    if (status){
      let key = this.table.cell(0,0).value;
      this.service.read(key).subscribe(() => {
        this.setMessage("ID is already present. Contents of this user will be updated");
      });
    }
  }

  private applySearchString(term:string){
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

  // Execute search (filter)
  public applySearch(term: any) {
    // If it is an event such as escape key or remove button pressed
    if (term.target){
      this.removeSearch();
    }
    // if string then apply regular search
    else{
      this.applySearchString(<string>term);
    }
  }

  // Clear row filter.
  public removeSearch() {
    this.table.removeFilter();
  }

  public sortContent(s: SortEvent<T>) {
    this.table.sort(s);
  }

  private reinitializeTable():void{
    let columns: Column<T>[] = new Array();
    for (let c of this.table.cols) {
        columns.push(c);
    }
    this.table = new Table(columns);

    this.service.readAll().subscribe(
      (rows) => {
        for (let r of rows) { this.table.pushRow(r); }
      },
      (err) => console.error('Error initializing rows: ' + err),
      () => console.log('readall completed')
    );
    this.selRow = -1;
  }

  public addRows(table: Table<T>) {
    for (let row of table.rows) {
      this.addRow(row);
    }
  }

  public addRow(row: Row<T>){
    let r = row.underlyingModel;
    this.service.create(r).subscribe((updatedT) => {
      this.table.pushRow(r);
    },
    (err: any) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        this.service.update(r).subscribe((updatedT) => {
          this.reinitializeTable();
        },
        (err) => console.log('error updating row ' + err));
      }
    });
  }

  public addSingleRow(row: Row<T>){
    let r = row.underlyingModel;

    let key = row.cells[0].value;
    // check if info exists. If it does store the old info
    this.service.read(key).subscribe((oldRowInfo) => {
      let cols: Column<T>[] = new Array();
      for (let m of this.config.propertyMap){
        cols.push(
          new Column(
            m.display, m.setter, m.getter,
            m.validator, !Boolean(m.hide), Boolean(m.disabled)));
      }
      let old_row = new Row(oldRowInfo, cols);
      this.actions.add_action(new EditRowOperation(old_row));
    });

    this.service.create(r).subscribe((updatedT) => {
      this.actions.add_action(new AddRowOperation(row));
      this.table.pushRow(r);
    },
    (err: any) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        this.service.update(r).subscribe((updatedT) => {
          this.reinitializeTable();
        },
        (err) => console.log('error updating row ' + err));
      }
    });
  }

  /*
  * Edit the row's properties.
  * editInfo: [rowIndex, newValue, rowProperty]
  */
  public editRow(edit: CellEditEvent<T>) {
    // if filling cells for row adder, does not enter cell info to database
    // one at a time
    if (this.activeRowAdder) {edit.cell.value = edit.newValue; return;}

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
    () => {
      console.log('edit completed');
      // Send info to recent actions for undo to occur
      this.actions.add_action(new EditCellOperation(edit.cell, oldVal, edit.rowi, edit.coli));
      },
    );
  }

  public removeRow() {
    this.service.delete(this.table.row(this.selRow).underlyingModel)
      .subscribe(() => {
        this.actions.add_action(new DeleteRowOperation(this.table.row(this.selRow)));
        this.table.deleteRow(this.selRow);
      }, (err) => console.log('error deleting row ' + err));
  }

  public isRemoveRowDisabled() {
    return this.selRow < 0 ||
      this.selRow >= this.table.rowLen ||
      !this.table.row(this.selRow).show;
  }

  isRowAdderActive(event:boolean){
    this.activeRowAdder = event;
  }

  private editCell(action:EditCellOperation<T>){
    // this function is used for undo
    let oldVal = action.cell.value;
    action.cell.value = action.cell_info;

    this.service.update(action.cell.model).subscribe(
      (updatedT) => { // Update cell
        this.table.updateRow(action.row_num, updatedT);
      },
      (err) => {
        console.log('error undoing cell' + err);
        this.table[action.row_num].cells[action.col_num].value = oldVal;
      },
      () => {
        console.log('undo completed');
      },
    );
  }

  private removeGivenRow(row:Row<T>) {
    let key = row.cells[0].value;
    this.service.delete(row.underlyingModel).subscribe(() => {});
  }

  undoAction(action: Operations){
    if(action instanceof EditCellOperation){
      this.editCell(action);
    }
    else if (action instanceof DeleteRowOperation){
      // if row was deleted this will restore it
      this.addRow(action.row);
      this.reinitializeTable();
    }
    else if (action instanceof AddRowOperation){
      // if row is added delete it
      this.removeGivenRow(action.row);
      this.reinitializeTable();
    }
    else if (action instanceof EditRowOperation){
      // if row is updated then revert it
      this.addRow(action.row);
    }
  }
}
