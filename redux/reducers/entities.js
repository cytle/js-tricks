import { combineReducers } from 'widget/redux';

import {
  userDrink,
  orderDrink,
  purchaseOrderDrink,
  warehouseDrink,
  dormDrink,
  supplierDrink,
  dormItemDrink,
  withdrawDrink,
  boxDrink,
} from '../drinks';

const drinks = [
  userDrink,
  orderDrink,
  purchaseOrderDrink,
  warehouseDrink,
  dormDrink,
  supplierDrink,
  dormItemDrink,
  withdrawDrink,
  boxDrink,
];
const entities = {};

drinks.forEach(drink => {
  if (drink.baseName) {
    entities[drink.baseName + 's'] = drink.entitiesReducer;
  }
});

export default combineReducers(entities);
