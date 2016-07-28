/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';

describe('Component: SearchBar', () => {
  it('should create an instance', () => {
    let component = new SearchBarComponent();
    expect(component).toBeTruthy();
  });
});
