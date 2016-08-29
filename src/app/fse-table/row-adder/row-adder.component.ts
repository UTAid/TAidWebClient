import {
  Component, OnInit, ViewChild,
  Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MODAL_DIRECTIVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { TableComponent } from '../table';
import { Column } from '../shared/column';
import { Row } from '../shared/row';
import { DISABLE_OVERRIDE, SHOW_HIDDEN_COLS } from '../table';
import { CellEditEvent } from '../shared/events';

@Component({
  moduleId: module.id,
  selector: 'row-adder',
  // No deep changes should occur on any input.
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [MODAL_DIRECTIVES, TableComponent],
  viewProviders: [BS_VIEW_PROVIDERS],
  providers: [
    { provide: DISABLE_OVERRIDE, useValue: true },
    { provide: SHOW_HIDDEN_COLS, useValue: true }
  ],
  templateUrl: 'row-adder.component.html',
  styleUrls: ['row-adder.component.css']
})
/**
* Component that allows for bulk addition of rows to the FSET
*/
export class RowAdderComponent<T> implements OnInit {

  @Input() factory: () => T; // Factory function to init a new row.
  @Input() columns: Column<T>[];
  @Input() show: Subject<any>; // Parent component trigger to show the modal.

  // Emits the list of new rows.
  @Output() addRows: EventEmitter<Row<T>[]> = new EventEmitter();

  @ViewChild('adderModal') adderModal: ModalDirective;

  private rows: Row<T>[];
  private selRow: number;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.clearRows();
    this.show.subscribe(() => {
      this.showAdder();
    });
  }

  private hideAdder() {
    this.adderModal.hide();
  }

  private showAdder() {
    this.adderModal.show();
  }

  protected selectRow(index: [number, number]) {
    this.selRow = index[0];
  }

  private clearRows() {
    this.rows = new Array(1);
    this.rows[0] = new Row(this.factory(), this.columns);
  }

  protected newRow() {
    this.rows.push(new Row(this.factory(), this.columns));
  }

  protected removeRow() {
    this.rows.splice(this.selRow, 1);
  }

  protected rowValueChange(editInfo: CellEditEvent<T>) {
    let cell = this.rows[editInfo.rowi].cells[editInfo.coli];
    cell.value = editInfo.newValue;
  }

  protected addAll() {
    this.addRows.emit(this.rows);
    this.hideAdder();
    this.clearRows();
  }

  protected cancel() {
    this.hideAdder();
    this.clearRows();
  }

}
