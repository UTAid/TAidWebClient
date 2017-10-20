import { IFsetPropertyMap } from './fset-config-interface';

export interface IFsetConfig<T> {
  propertyMap: Array<IFsetPropertyMap<T>>;
  factory: () => T;
}