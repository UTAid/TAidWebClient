/* tslint:disable:no-unused-variable */
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject, TestComponentBuilder,
  ComponentFixture
} from '@angular/core/testing';

import {FSETContent, FSETPropertyMap} from "./fset-content";
import {FSETComponent} from './fset.component';


// Mock FSETContent for testing.
class MockContent extends FSETContent<any> {

  static propertyMap: FSETPropertyMap<any> =
  {
    id: {
      getter: (o: any):string => o.id,
      setter: (v: string, o: any) => o.id = v
    },
    name: {
      getter: (o: any):string => o.name,
      setter: (v: string, o: any) => o.name = v
    }
  };

  constructor (){
    super(MockContent.propertyMap, []);
  }
}

///////////////////////////////////////////////////////////////////////////////
// Tests start here
///////////////////////////////////////////////////////////////////////////////

describe('Component sanity test: FseTable', () => {
  it('should create an instance', () => {
    let component = new FSETComponent();
    expect(component).toBeTruthy();
  });
});


describe('Component: FSETable', () => {

  let fixture: ComponentFixture<FSETComponent<any>>;
  let comp: FSETComponent<any>;
  let elem: any;

  beforeEachProviders(() => [TestComponentBuilder]);

  // Setup the fixture, and provide shortcuts to the component and
  // native element.
  beforeEach((done) => {
    inject([TestComponentBuilder], (t) => {
      t.createAsync(FSETComponent).then(f => {
        fixture = f;
        comp = fixture.debugElement.componentInstance;
        elem = fixture.debugElement.nativeElement;
        done(); // Signal jasmine that beforeEach is complete.
      }).catch((e) => done.fail(e));
    })(); // Call the function that inject returns.
  });


  describe('with no content', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not display the table.', () => {
      expect(elem.querySelector('#fset')).toBeNull();
    });

    it('should not display the search bar.', () => {
      expect(elem.querySelector('#fset-tool-bar')).toBeNull();
    });

  });


  describe('with empty content', () => {

    beforeEach(() => {
      comp.content = new MockContent();
      fixture.detectChanges();
    });

    it('should display empty table with empty content.', () => {
      expect(elem.querySelector('tbody > tr')).toBeNull();
    });

    it('should have the right headers', () => {
      expect(elem.querySelector('#fset-col-0').innerText).toEqual('id');
      expect(elem.querySelector('#fset-col-1').innerText).toEqual('name');
    });

    describe('search bar', () => {
      it('should have a search input', () => {
        expect(elem.querySelector('#fset-input-search')).not.toBeNull();
      });

      it('should have a search button', () => {
        expect(elem.querySelector('#fset-btn-search')).not.toBeNull();
      });

      it('should have a clear search button', () => {
        expect(elem.querySelector('#fset-btn-clear')).not.toBeNull();
      });

      it('should have an add row button', () => {
        expect(elem.querySelector('#fset-btn-add')).not.toBeNull();
      });

      it('should have a remove row button', () => {
        expect(elem.querySelector('#fset-btn-remove')).not.toBeNull();
      });
    });

    describe("header cell sorting", () => {
      let sortArrow: any;

      beforeEach(() => {
        sortArrow = elem.querySelector('#fset-col-0 > .fa');
      });

      it('should not display arrow when not clicked', () => {
        expect(sortArrow.style.visibility).toEqual('hidden');
      });

      it('should display up arrow when clicked once', () => {
        sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-up');
      });

      it('should display down arrow when clicked twice', () => {
        sortArrow.click(); sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-down');
      });

      it('should display up arrow when clicked thrice', () => {
        sortArrow.click(); sortArrow.click(); sortArrow.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('inherit');
        expect(sortArrow.className).toContain('fa-chevron-up');
      });

      it('should remove arrow when other header cell is clicked', () => {
        sortArrow.click();
        fixture.detectChanges();
        let otherCell = elem.querySelector('#fset-col-1');
        otherCell.click();
        fixture.detectChanges();
        expect(sortArrow.style.visibility).toEqual('hidden');
      });
    });

  });


  describe('with single row', () => {

    beforeEach(() => {
      comp.content = new MockContent();
      comp.content.push({id: 'testing', name: 'is fun!'});
      fixture.detectChanges();
    });

    it('should display the right row', () => {
      let cell = elem.querySelector('#fset-cell-0-0').innerText.trim();
      expect(cell).toEqual('testing');
      cell = elem.querySelector('#fset-cell-0-1').innerText.trim();
      expect(cell).toEqual('is fun!');
    });

    it('should only display one row', () => {
      expect(elem.querySelectorAll('tbody > tr').length).toEqual(1);
    });
  });


  describe('with multiple rows', () => {

    beforeEach(() => {
      comp.content = new MockContent();
      comp.content.push({id: 'testing', name: 'is fun!'});
      comp.content.push({id: 'joke', name: 'Why couldnt the bicycle stand up?'});
      comp.content.push({id: 'jokeAns', name: 'Becuse it was two tired.'});
      fixture.detectChanges();
    });

    it('should display the right rows', () => {
      let cell = elem.querySelector('#fset-cell-0-0').innerText.trim();
      expect(cell).toEqual('testing');
      cell = elem.querySelector('#fset-cell-0-1').innerText.trim();
      expect(cell).toEqual('is fun!');

      cell = elem.querySelector('#fset-cell-1-0').innerText.trim();
      expect(cell).toEqual('joke');
      cell = elem.querySelector('#fset-cell-1-1').innerText.trim();
      expect(cell).toEqual('Why couldnt the bicycle stand up?');

      cell = elem.querySelector('#fset-cell-2-0').innerText.trim();
      expect(cell).toEqual('jokeAns');
      cell = elem.querySelector('#fset-cell-2-1').innerText.trim();
      expect(cell).toEqual('Becuse it was two tired.');
    });

    it('should only display three rows', () => {
      expect(elem.querySelectorAll('tbody > tr').length).toEqual(3);
    });
  });


});
