import {Component, Input} from '@angular/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

import {Column} from '../shared/column';

@Component({
  moduleId: module.id,
  directives: [DROPDOWN_DIRECTIVES],
  selector: 'colselector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.css']
})
export class ColumnSelectorComponent {
  @Input() columns: Column<any>[];
}
