import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowAdderComponent } from './row-adder.component';

describe('RowAdderComponent', () => {
  let component: RowAdderComponent;
  let fixture: ComponentFixture<RowAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
