import { OpaqueToken } from '@angular/core';


/**
* Template for a property map used to display models within the FSETable.
*
* display: The name of a column as displayed to the user; the column's unique
*   identifier.
* setter: Function used to set the property that this column is displaying.
* getter: Function used to get the property that this column is displaying.
*/
export interface IFsetPropertyMap<T> {
  display: string;
  hide?: boolean;
  setter(v: string, o: T): void;
  getter(o: T): string;
  validator?(o: T): [boolean, string];
}

export interface IFsetConfig<T> {
  propertyMap: Array<IFsetPropertyMap<T>>;
  factory: () => T;
}
/**
* Configuration for FSET. An instance must be injected to FSETComponent.
*/
export const FsetConfig = new OpaqueToken('app.fse-table.IFSETConfig');

/**
* Generate configuration for FSETComponent.
*
* - pMap: Property mapping that maps T's properties to a table column.
* - factoryFunc: Factory function that returns a new instance of T.
*
* ### Example:
*
* ```
* let config = fsetConfig([
*   { display: 'Name',
*     setter: (value, person) => person.name = value,
*     getter: (person) => person.name,
*   },
*   { display: 'Age',
*     setter: (value, person) => person.age = parseInt(value, 10),
*     getter: (person) => person.age.toString(),
*     validator: (person) => {
*       if (person.age < 0) return [false, 'Age cannot be negative'];
*       else return [true, 'OK'];
*     }
*   }], () => new Person('', 0));
* ```
*
* Getter and setters for property mapping operates on strings. Validators are
* optional, and are used to validate rows when adding them.
*/
export function fsetConfig<T>(
  pMap: Array<IFsetPropertyMap<T>>,
  factoryFunc: () => T): IFsetConfig<T> {

    return { propertyMap: pMap, factory: factoryFunc };
}
