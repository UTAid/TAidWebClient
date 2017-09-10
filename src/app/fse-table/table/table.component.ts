import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter,
  Optional, Inject, OpaqueToken
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { CellComponent } from '../cell';
import { Column, SortOrder } from '../shared/column';
import { Table } from '../shared/table';
import { CellEditEvent, CellEvent, SortEvent } from '../shared/events';
import { getKeyMap } from '../shared/keymap';

export const READONLY_OVERRIDE =
  new OpaqueToken('app.fse-table.table.disableOverride');
export const SHOW_HIDDEN_COLS =
  new OpaqueToken('app.fse-table.table.showHiddenCols');
export const SHOW_HIDDEN_ROWS =
  new OpaqueToken('app.fse-table.table.showHiddenRows');


@Component({
  selector: 'fse-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.scss']
})
/**
* Filterable, Sortable, Editable table component.
*
* ## Inputs
*
* `rows: T` - List of rows to display.
* `cols: Column<T>`` - List of columns.
*
* ## Outputs
*
* `search: none` - A search is requested.
* `sort: [column, sortOrder]` - Sort requested on specified column and order.
* `selection: [rowIndex, colIndex]` - A cell with given index is selected.
* `rowChange: [index, newValue, column]` - User has changed the value of row
*   at `index` to `newValue` at property `column`.
*/
export class TableComponent<T> implements OnInit {

  @Input() table: Table<T>;
  @Input() validationRequestSubject: Subject<CellEvent<T>>;
  @ViewChild('navInput') navInput;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() sort: EventEmitter<SortEvent<T>> = new EventEmitter();
  @Output() selection: EventEmitter<CellEvent<T>> = new EventEmitter();
  @Output() cellChange: EventEmitter<CellEditEvent<T>> = new EventEmitter();

  // Subject that cells listen to for edit-mode requests.
  private editRequestSubject: Subject<CellEvent<T>> = new Subject();

  private sortCol: Column<T>;
  private sortOrder: SortOrder;
  // The selected cell index.
  private selRow: number;
  private selCol: number;

  constructor(
    // Ignore read-only columns if true. Defaults to false.
    @Optional() @Inject(READONLY_OVERRIDE) private disableOverride = false,
    // Show hidden columns or rows if true. Defaults to false.
    @Optional() @Inject(SHOW_HIDDEN_COLS) private showHiddenCols = false,
    @Optional() @Inject(SHOW_HIDDEN_ROWS) private showHiddenRows = false
  ) {}

  ngOnInit() {
    this.sortCol = undefined;
    this.sortOrder = SortOrder.NONE;
    this.selRow = this.selCol = 0;
  }

  protected isSortedAsc(): boolean {
    return this.sortOrder === SortOrder.ASC;
  }

  protected sortOn(col: Column<T>, i: number) {
    if (this.sortCol === col) { // No new cols are created, so this should be ok.
      switch (this.sortOrder) {
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.ASC; break;
        default: this.sortOrder = SortOrder.ASC; break;
      }
    } else {
      this.sortCol = col;
      this.sortOrder = SortOrder.ASC;
    }
    this.sort.emit(new SortEvent(this.sortCol, i, this.sortOrder));
  }

  // Reset sort column, and sort direction.
  private resetSort() {
    this.sortCol = undefined;
    this.sortOrder = SortOrder.NONE;
  }

  // Handler for cell clicks.
  protected onClick(row: number, col: number) {
    this.selRow = row;
    this.selCol = col;
    this.notifySelection();
  }

  // Notify listeners of the currently selected cell.
  private notifySelection() {
    let cellEvent = this.selectedCellEvent;
    this.selection.emit(cellEvent); // notify parent
  }

  // Trigger edit-mode on currently selected cell. Pass on to parent component.
  private triggerEdit() {
    // Only allow edit if column is not disabled, or user specified override.
    if (this.disableOverride || !this.table.col(this.selCol).disabled) {
      this.editRequestSubject.next(this.selectedCellEvent);
    }
  }

  // Cell signaled value change.
  protected cellValueChange(event: CellEditEvent<T>) {
    this.cellChange.emit(event);
    this.resetSort();
  }

  protected isCellIndexSelected(rowi: number, coli: number) {
    return this.selRow === rowi && this.selCol === coli;
  }

  private get selectedCellEvent() {
    return new CellEvent(
      this.table.cell(this.selRow, this.selCol),
      this.selRow,
      this.selCol);
  }

  // Get height of table (wihtout hidden rows)
  private get height() {
    return this.showHiddenRows ? this.table.rowLen : this.table.height;
  }

  // Get width of table (without hidden columns)
  private get width() {
    return this.showHiddenCols ? this.table.colLen : this.table.width;
  }

  /////////////////////////////////////////////////////////////////////////////
  // The below are methods to navigate the selected cell.
  /////////////////////////////////////////////////////////////////////////////

  // Navigation handler for changing the selected cell.
  protected navInputHandler(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    let nav = getKeyMap(event);
    let selectionChanged = false;

    if (nav.up) {
      selectionChanged = this.navUp();
    } else if (nav.down) {
      selectionChanged = this.navDown();
    } else if (nav.left) {
      selectionChanged = this.navLeft();
    } else if (nav.right) {
      selectionChanged = this.navRight();
    } else if (nav.tab) {
      if (nav.shift) {
        selectionChanged = this.navLeftLoopover();
      } else {
        selectionChanged = this.navRightLoopover();
      }
    } else if (nav.enter) {
      this.triggerEdit();
    } else if (nav.ctrl && event.key === 'f') {
      this.search.emit(undefined);
    }

    if (selectionChanged) { this.notifySelection(); }
  }

  protected navInputFocus() {
    this.navInput.nativeElement.focus();
  }

  /* Navigation needs to skip over hidden columns and rows. Additional while
  * loop and conditionals are needed to ensure proper navigation. */

  private navUp() {
    let selRow = this.selRow;
    while (selRow > 0) {
      selRow -= 1;
      if (this.showHiddenRows || this.table.row(selRow).show) {
        this.selRow = selRow;
        return true;
      }
    }
    return false;
  }

  private navDown() {
    let selRow = this.selRow;
    while (selRow < this.table.rowLen - 1) {
      selRow += 1;
      if (this.showHiddenRows || this.table.row(selRow).show) {
        this.selRow = selRow;
        return true;
      }
    }
    return false;
  }

  private navLeft() {
    let selCol = this.selCol;
    while (selCol > 0) {
      selCol -= 1;
      if (this.showHiddenCols || this.table.col(selCol).show) {
        this.selCol = selCol;
        return true;
      }
    }
    return false;
  }

  private navLeftLoopover() {
    if (this.table.colLen === 0 || this.table.rowLen === 0) {
      return false;
    }

    let tmp: number;
    // Nav left to see if end is reached.
    if (!this.navLeft()) {
      // End reached, loop over to the last shown column.
      tmp = this.table.colLen - 1;
      while (tmp > 0 &&
        !(this.showHiddenCols || this.table.col(tmp).show)) { tmp -= 1; }
      this.selCol = tmp;
      // Nav up to select previous shown row.
      if (!this.navUp()) {
        // Top reached. Loop over to the last shown row.
        tmp = this.table.rowLen - 1;
        while (tmp > 0 &&
          !(this.showHiddenRows || this.table.row(tmp).show)) { tmp -= 1; }
        this.selRow = tmp;
      }
    }
    return true;
  }

  private navRight() {
    let selCol = this.selCol;
    while (selCol < this.table.colLen - 1) {
      selCol += 1;
      if (this.showHiddenCols || this.table.col(selCol).show) {
        this.selCol = selCol;
        return true;
      }
    }
    return false;
  }

  private navRightLoopover() {
    if (this.table.colLen === 0 || this.table.rowLen === 0) {
      return false;
    }

    let tmp: number;
    // Nav right to see if end is reached.
    if (!this.navRight()) {
      // End reached, loop over to the first shown column.
      tmp = 0;
      while (tmp < this.table.colLen - 1 &&
        !(this.showHiddenCols || this.table.col(tmp).show)) { tmp += 1; }
      this.selCol = tmp;
      // Nav down to select next shown row.
      if (!this.navDown()) {
        // Bottom reached. Loop over to the first shown row.
        tmp = 0;
        while (tmp < this.table.rowLen - 1 &&
          !(this.showHiddenRows || this.table.row(tmp).show)) { tmp += 1; }
        this.selRow = tmp;
      }
    }
    return true;
  }

}
