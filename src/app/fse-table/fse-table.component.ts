import {Component, Input, OnInit, Directive, ElementRef} from "@angular/core";
import {FSETableContent, Column, SortOrder} from './fse-table-content';

/*
* An attribute directive that focuses on the selected element on
* ngAfterViewInit event.
*/
@Directive({
  selector: `[focusme]`
})

class FocusMeDirective {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.focus();
  }
}


/*
* Filterable, Sortable, Editable table component.
*/
@Component({
  moduleId: module.id,
  directives: [FocusMeDirective],
  selector: 'fse-table',
  templateUrl: 'fse-table.component.html',
})

export class FSETableComponent<T> implements OnInit{

  @Input() content: FSETableContent<T>;

  private sortColumn: Column;
  private sortOrder: SortOrder;

  // For determining which cell is currently being edited.
  private selectedRow: T;
  private selectedProp: string;

  ngOnInit(){
    this.sortColumn = new Column('', '');
    this.sortOrder = SortOrder.NONE;
    this.resetEdit();
  }

  private sortOn(col: Column){
    if (this.sortColumn.propName === col.propName){
      switch (this.sortOrder){
        case SortOrder.ASC: this.sortOrder = SortOrder.DEC; break;
        case SortOrder.DEC: this.sortOrder = SortOrder.ASC; break;
        default: this.sortOrder = SortOrder.ASC; break;
      }
    }
    else {
      this.sortColumn = col;
      this.sortOrder = SortOrder.ASC;
    }
    this.content.sort(this.sortColumn, this.sortOrder);
  }

  private edit(row: T, prop: string){
    this.selectedRow = row;
    this.selectedProp = prop;
    this.sortOrder = SortOrder.NONE;
  }

  private resetEdit(){
    this.selectedRow = null;
    this.selectedProp = null;
  }

}
