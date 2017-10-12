import { Component, Input, Output, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit,
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { getKeyMap } from '../shared/keymap';
import { Cell } from '../shared/cell';
import { ValidatorResult } from '../shared/validator-result';
import { CellEditEvent, CellEvent } from '../shared/events';

@Component({
  moduleId: module.id,
  selector: 'fse-cell',
  changeDetection: ChangeDetectionStrategy.OnPush, // All inputs immutable.
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent<T> implements OnInit {
  @Input() cell: Cell<T>;
  // row and column index within table.
  @Input() row: number;
  @Input() col: number;
  // To observe for external requests to enable editing.
  @Input() editRequestSubject: Subject<CellEvent<T>>;
  // Observe for external requests to validate contents.
  @Input() validationRequestSubject: Subject<CellEvent<T>>;
  // Emitted when value changes are confirmed.
  @Output() valueChange = new EventEmitter<CellEditEvent<T>>();
  // Emitted when exiting editing mode.
  @Output() editExit = new EventEmitter<CellEvent<T>>();
  // Emitted when entering editing mode
  @Output() editEnter = new EventEmitter<CellEvent<T>>();

  private edit = false; // Whether editing mode is enabled.
  private isValid = true;
  private tooltipMsg = '';

  constructor (private cd: ChangeDetectorRef) {};

  ngOnInit() {
    this.editRequestSubject.subscribe(event => {
      if (event.rowi === this.row && event.coli === this.col) {
        this.requestEdit();
        this.cd.markForCheck();
      }
    });
    if (this.validationRequestSubject) {
      this.validationRequestSubject.subscribe((event) => {
        // If no CellEvent is given, assume request to validate all cells.
        if (event == null ||
          (event.rowi === this.row && event.coli === this.col)) {
          this.updateValidationStatus(this.cell.validate());
          this.cd.markForCheck();
        }
      });
    }
  }

  private get cellEvent() {
    return new CellEvent(this.cell, this.row, this.col);
  }

  protected requestEdit() {
    this.edit = true;
    this.editEnter.emit(this.cellEvent);
  }

  private updateValidationStatus(v: ValidatorResult) {
    this.isValid = v.isValid;
    this.tooltipMsg = this.isValid ? '' : v.msg;
  }

  protected requestEditConfirm(val: string) {
    this.updateValidationStatus(this.cell.validate(val));
    if (!this.isValid) { return; }

    this.edit = false;
    this.valueChange.emit(new CellEditEvent(
      this.cell, this.row, this.col, val));
    this.editExit.emit(this.cellEvent);
  }

  protected requestEditCancel() {
    this.edit = false;
    this.updateValidationStatus(this.cell.validate());
    this.editExit.emit(this.cellEvent);
  }
}
