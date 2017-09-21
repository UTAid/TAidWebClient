import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsetComponent } from './fset.component';

describe('FsetComponent', () => {
  let component: FsetComponent;
  let fixture: ComponentFixture<FsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
