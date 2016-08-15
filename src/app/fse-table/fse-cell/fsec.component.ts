import {
  Component, Directive, Input, Output, ElementRef, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit,
  HostBinding, HostListener
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { getKeyMap } from '../shared/keymap';

/**
* Directive for an editable input field within a fse-cell.
* Binds to enter: confirm edit, and escape: cancel edit. Clicking anywhere
* outside the input box (blur event) will also confirm the edit.
*
* TODO: Combine FsecInputDirective into FsecComponent.
*/
@Directive({
  selector: `[fsecInput]`
})
class FsecInputDirective implements AfterViewInit {
  private _el: HTMLElement;

  @Output() editCancel: EventEmitter<any>;
  @Output() editConfirm: EventEmitter<string>;

  @HostBinding('attr.contenteditable') protected contentEditable = true;

  constructor(private el: ElementRef) {
    this._el = el.nativeElement;
    this.editCancel = new EventEmitter();
    this.editConfirm = new EventEmitter();
  }

  @HostListener('click', ['$event']) protected onClick(event) {
    event.stopPropagation();
  }

  @HostListener('dblclick', ['$event']) protected onDblclick(event) {
    event.stopPropagation();
  }

  @HostListener('keydown', ['$event'])
  protected processKeydown(event: KeyboardEvent) {
    event.stopPropagation();
    let map = getKeyMap(event);
    if (map.enter) { this.editConfirm.emit(this._el.textContent); }
    if (map.escape) { this.editCancel.emit(null); }
  }

  // When view is initialized, focus and select all contents.
  ngAfterViewInit() {
    this._el.focus();
    // Select the contents.
    let range = document.createRange();
    range.selectNodeContents(this._el);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
* An editable cell within a FSETable.
*/
@Component({
  moduleId: module.id,
  selector: 'fse-cell',
  changeDetection: ChangeDetectionStrategy.OnPush, // All inputs immutable.
  directives: [FsecInputDirective],
  templateUrl: './fsec.component.html',
  styleUrls: ['./fsec.component.css']
})
export class FsecComponent<T> implements OnInit {
  // Contents of this cell.
  @Input() value: string;
  // row and column index within table.
  @Input() row: number;
  @Input() col: number;
  // Subscribe to change in user selection to determine if I am selected.
  @Input() selection: Subject<[number, number]>;
  // To observe for external requests to enable editing.
  @Input() editRequestSubject: Subject<[number, number]>;
  // Emitted when value changes are confirmed.
  @Output() valueChange = new EventEmitter<string>();
  // Emitted when exiting editing mode.
  @Output() editExit = new EventEmitter<[number, number]>();
  // Emitted when entering editing mode
  @Output() editEnter = new EventEmitter<[number, number]>();

  private edit = false; // Whether editing mode is enabled.
  private isSelected = false;

  constructor (private cd: ChangeDetectorRef) {};

  ngOnInit() {
    this.editRequestSubject.subscribe(event => {
      if (event[0] === this.row && event[1] === this.col) {
        this.requestEdit();
        this.cd.markForCheck();
      }
    });
    this.selection.subscribe(event => {
      this.isSelected = event[0] === this.row && event[1] === this.col;
      this.cd.markForCheck();
    });
  }

  protected requestEdit() {
    this.edit = true;
    this.editEnter.emit([this.row, this.col]);
  }

  protected requestEditConfirm(val: string) {
    this.edit = false;
    this.valueChange.emit(val);
    this.editExit.emit([this.row, this.col]);
  }

  protected requestEditCancel() {
    this.edit = false;
    this.editExit.emit([this.row, this.col]);
  }
}
