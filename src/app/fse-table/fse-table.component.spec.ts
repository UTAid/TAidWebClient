/* tslint:disable:no-unused-variable */
import {FSETableContent} from "./fse-table-content";

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject, TestComponentBuilder
} from '@angular/core/testing';

import { FSETableComponent } from './fse-table.component';

describe('Component: FseTable', () => {
  it('should create an instance', () => {
    let component = new FSETableComponent();
    expect(component).toBeTruthy();
  });
});

describe('Component:FSETable', () => {

  let tcb: TestComponentBuilder;

  beforeEachProviders(() => [
    TestComponentBuilder,
    FSETableComponent
  ]);

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    tcb = _tcb
  }));

  it('should not display the component with no content.', (done) => {
    tcb.createAsync(FSETableComponent).then((fx => {
      let fset = fx.componentInstance;
      let nElement = fx.nativeElement;
      expect(fset.content).toBeFalsy();
      // Both table and search bar should not be displayed.
      expect(nElement.querySelector('table')).toBeFalsy();
      expect(nElement.querySelector('#fset-search-bar')).toBeFalsy();
      done();
    })).catch((e) => done.fail(e));
  });

});

describe('Component: FSETable with empty content', () => {

    let tcb: TestComponentBuilder;

    beforeEachProviders(() => [
      TestComponentBuilder,
      FSETableComponent
    ]);

    beforeEach(inject([TestComponentBuilder], (_tcb) => {
      tcb = _tcb
    }));

    it('should display empty table with empty content.', (done) => {
      tcb.createAsync(FSETableComponent).then((fx => {
        let fset = fx.componentInstance;
        let nElement = fx.nativeElement;
        fset.content = new MockContent();
        fx.detectChanges();
        expect(nElement.querySelector('tbody > tr')).toBeFalsy();
        expect(nElement.querySelector('#fset-search-bar')).toBeTruthy();
        done();
      })).catch((e) => done.fail(e));
    });

    it('should display the correct columns')

});

class MockContent extends FSETableContent<any> {
  constructor (){
    super({
      id: {
        getter: (o: any):string => o.id,
        setter: (v: string, o: any) => o.id = v
      },
      name: {
        getter: (o: any):string => o.name,
        setter: (v: string, o: any) => o.name = v
      }
    }, []
    );
  }
}
