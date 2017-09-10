import { OpaqueToken } from '@angular/core';
import { IFsetConfig } from './fset-config-map-interface';

/**
* Configuration for FSET. An instance must be injected to FSETComponent.
*/
export const FsetConfig = new OpaqueToken('app.fse-table.IFSETConfig');
