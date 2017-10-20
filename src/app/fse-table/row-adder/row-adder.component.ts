import {
  Component, OnInit, ViewChild,
  Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { TableComponent } from '../table';
import { Column } from '../shared/column';
import { Table } from '../shared/table';
import { READONLY_OVERRIDE, SHOW_HIDDEN_COLS } from '../table';
import { CellEditEvent, CellEvent } from '../shared/events';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'row-adder',
  // No deep changes should occur on any input.
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: READONLY_OVERRIDE, useValue: true },
    { provide: SHOW_HIDDEN_COLS, useValue: true }
  ],
  templateUrl: 'row-adder.component.html',
  styleUrls: ['row-adder.component.scss']
})
/**
* Component that allows for bulk addition of rows to the FSET
*/
export class RowAdderComponent<T> implements OnInit {
  @ViewChild('content') content;
  @Input() factory: () => T; // Factory function to init a new row.
  @Input() columns: Column<T>[];
  @Input() show: Subject<any>; // Parent component trigger to show the modal.

  // Emits the list of new rows.
  @Output() addRows: EventEmitter<Table<T>> = new EventEmitter();

  // @ViewChild('adderModal') adderModal: ModalDirective;

  private validationRequest: Subject<CellEvent<T>> = new Subject();
  private table: Table<T>;
  private selRow: number;

  constructor(private cd: ChangeDetectorRef, private modalService: NgbModal) {}

  private closeResult: string;

  private getDismissReason(reason: any): string {
    this.clearRows();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  ngOnInit() {
    this.table = new Table(this.columns);
    this.table.pushRow(this.factory());
    this.show.subscribe(() => {
      this.showAdder();
    });
  }

  private showAdder() {
    this.modalService.open(this.content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  protected selectRow(index: [number, number]) {
    this.selRow = index[0];
  }

  private clearRows() {
    this.table.clearRows();
    this.table.pushRow(this.factory());
  }

  protected newRow() {
    this.table.pushRow(this.factory());
  }

  protected removeRow() {
    this.table.deleteRow(this.selRow);
  }

  protected rowValueChange(editInfo: CellEditEvent<T>) {
    let cell = this.table.cell(editInfo.rowi, editInfo.coli);
    cell.value = editInfo.newValue;
  }

  protected addAll() {
    let isAllValid = true;
    // Check if all cells are valid.
    for (let i = 0; i < this.table.rows.length; i++) {
      let cells = this.table.cells(i);
      for (let j = 0; j < cells.length; j++) {
        let cell = cells[j];
        console.log(cell.validate().isValid);
        if (!cell.validate().isValid) {
          // Cell is not valid. Notify cell component via validationRequest
          isAllValid = false;
          this.validationRequest.next(new CellEvent(cell, i, j));
        }
      }
    }
    // Only add rows if all cells are valid.
    if (isAllValid) {
      this.addRows.emit(this.table);
      //this.hideAdder();
      this.clearRows();
    }
  }

}
