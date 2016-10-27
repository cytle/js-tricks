import Actions from './actions';
import { shouldFetchFactory, getEntityFactory } from '../../libs/functions';
import baseActionsFactory from './base/actionsFactory';
import baseReducersFactory from './base/reducersFactory';
import { combineReducers } from 'widget/redux';

class BaseActions extends Actions {
  constructor(baseName, options) {
    super(baseName, options, baseActionsFactory);

    this.shouldFetch = shouldFetchFactory(this.baseName);
    this.getEntity = getEntityFactory(this.baseName);
  }

  get isBaseActions() {
    return true;
  }
  get reducer() {
    return combineReducers(this.reducerObject);
  }
  get reducerObject() {
    return baseReducersFactory(this.baseName);
  }

  get actionsType() {
    return 'base';
  }
}

export default BaseActions;
