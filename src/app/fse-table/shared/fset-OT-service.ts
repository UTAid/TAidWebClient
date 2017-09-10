import { OpaqueToken } from '@angular/core';
import { IFsetService } from './fset-interface-service';
/**
* Service used by FSET to execute CRUD operations on a backing database.
* Must be injected to FSETComponent.
*/
export const FsetService = new OpaqueToken('app.fse-table.IFSETService');
