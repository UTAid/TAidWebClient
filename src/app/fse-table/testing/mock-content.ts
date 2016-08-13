// import { FSETContent, FSETPropertyMap } from '../fset-content';
// import { Column, SortOrder } from '../shared/column';

//
// export const PROPERTY_MAP_EMPTY: FSETPropertyMap<Model> = {}
//
// export const PROPERTY_MAP_SINGLE: FSETPropertyMap<Model> = {
//   id: {
//     getter: (o: Model):string => o.id,
//     setter: (v: string, o: Model) => o.id = v
//   }
// }
// export const PROPERTY_MAP_MULTI: FSETPropertyMap<Model> = {
//   id: {
//     getter: (o: Model):string => o.id,
//     setter: (v: string, o: Model) => o.id = v
//   },
//   name: {
//     getter: (o: Model):string => o.name,
//     setter: (v: string, o: Model) => o.name = v
//   },
//   email: {
//     getter: (o: Model):string => o.email,
//     setter: (v: string, o: Model) => o.email = v
//   }
// };
//
//
// export class Model {
//
//   constructor(
//     public id: string,
//     public name: string,
//     public email: string
//   ) {}
//
// }
//
//
// // Mock FSETContent for testing.
// export class Content extends FSETContent<Model> {
//   constructor (propertyMap: FSETPropertyMap<Model>){
//     super(propertyMap, [], () => {return {id: null, name: null, email: null}});
//   }
// }
//
//
// export function generateColumns(pmap: FSETPropertyMap<Model>) {
//   let ret = new Array<Column<Model>>();
//   for (let dispName in pmap){
//     let property = pmap[dispName];
//     let col = new Column<Model>(dispName,
//       property.setter, property.getter, property.validator);
//     ret.push(col);
//   }
//   return ret;
// }
