import { OpaqueToken } from '@angular/core';

/**
* Template for a property map used to display models within the FSETable.
*
* dispName: The name of a column as displayed to the user; the column's unique
*   identifier.
* setter: Function used to set the property that this column is displaying.
* getter: Function used to get the property that this column is displaying.
*/
export interface IFSETPropertyMap<T> {
  display: string;
  setter(v: string, o: T): void;
  getter(o: T): string;
  validator?(o: T): [boolean, string];
  hide?: boolean;
}

export interface IFSETConfig<T> {
  propertyMap: Array<IFSETPropertyMap<T>>;
  factory: () => T;
}
export const FSETConfig = new OpaqueToken('app.fse-table.IFSETConfig');

/**
* Generate configuration for FSETComponent.
*
* - pMap: Property mapping that maps T's properties to a table column.
* - factoryFunc: Factory function that returns a new instance of T.
*/
export function fsetConfig<T>(
  pMap: Array<IFSETPropertyMap<T>>,
  factoryFunc: () => T): IFSETConfig<T>
{
  return {propertyMap: pMap, factory: factoryFunc};
}
