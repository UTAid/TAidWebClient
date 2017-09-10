import { ValidatorResult } from './validator-result';


/**
* Template for a property map used to display models within the FSETable.
*
* display: The name of a column as displayed to the user; the column's unique
*   identifier.
* setter: Function used to set the property that this column is displaying.
* getter: Function used to get the property that this column is displaying.
* hide: Optional boolean that determines if column is initially hidden.
*   Hide on true, and show otherwise.
* disabled: Optional boolean that determins if value in column is read only.
*   Read only on true, and allow editing otherwise.
*/
export interface IFsetPropertyMap<T> {
  display: string;
  hide?: boolean;
  disabled?: boolean;
  setter(v: string, o: T): void;
  getter(o: T): string;
  validator?(o: T): ValidatorResult;
}
