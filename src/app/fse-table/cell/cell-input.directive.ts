import {
  Directive, Output, ElementRef, EventEmitter, AfterViewInit,
  HostBinding, HostListener
} from '@angular/core';

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
export class CellInputDirective implements AfterViewInit {
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
