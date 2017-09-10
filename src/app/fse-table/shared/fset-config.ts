import { OpaqueToken } from '@angular/core';
import { ValidatorResult } from './validator-result';
import { IFsetPropertyMap } from './fset-config-interface';
import { IFsetConfig } from './fset-config-map-interface';
import { FsetConfig } from './fset-config-OT';
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
      disabled: true
*   },
*   { display: 'Age',
*     setter: (value, person) => person.age = parseInt(value, 10),
*     getter: (person) => person.age.toString(),
*     validator: (person) => {
*       if (person.age < 0) return {isValid: false, msg: 'Age cannot be negative'};
*       else return {isValid: true, msg: 'OK'};
*     },
*     hide: true;
*   }], () => new Person('', 0));
* ```
*
* Getter and setters for property mapping operates on strings. Validators are
* optional, and are used to validate rows when adding them. If `disable` is
* set to true, the column displayed will be read only. If `hide` is set to true,
* the column is hidden by default.
*/
export function fsetConfig<T>(
  pMap: Array<IFsetPropertyMap<T>>,
  factoryFunc: () => T): IFsetConfig<T> {

    return { propertyMap: pMap, factory: factoryFunc };
}
