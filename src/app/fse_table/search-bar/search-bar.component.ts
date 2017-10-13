import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  moduleId: module.id,
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
/**
* Search bar for FSET
*/
export class SearchBarComponent implements OnInit {

  @Input() focus: Subject<any>; // Trigger a focus on the search box.
  @ViewChild('searchInput') searchInput;

  // Triggered when user requests a search. Emits with search term.
  @Output() search: EventEmitter<string> = new EventEmitter();
  // Triggered when user clears the search.
  @Output() clear: EventEmitter<any> = new EventEmitter();

  private searchTerm = '';

  constructor() {}

  ngOnInit() {
    //this.focus.subscribe(() => {
    //  this.searchInput.nativeElement.focus();
    //});
  }

  protected searchRequest() {
    this.search.emit(this.searchTerm);
  }

  protected searchClear() {
    this.searchTerm = '';
    this.clear.emit(null);
  }

}
