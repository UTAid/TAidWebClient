import {Component, Input} from '@angular/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap';

import {Column} from '../shared/column';

@Component({
  moduleId: module.id,
  directives: [DROPDOWN_DIRECTIVES],
  selector: 'col-selector',
  templateUrl: 'column-selector.component.html',
  styleUrls: ['column-selector.component.css']
})
/**
* Column display toggle dropdown for the FSET.
*/
export class ColumnSelectorComponent {
  @Input() columns: Column<any>[];
}
