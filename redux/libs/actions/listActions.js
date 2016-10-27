import listActionsFactory from './list/actionsFactory';
import Actions from './actions';
import listReducersFactory from '../../libs/actions/list/reducersFactory';
import { combineReducers } from 'widget/redux';

class ListActions extends Actions {
  constructor(baseName, options) {
    super(baseName, options, listActionsFactory);
    this.itemsReducer = options.itemsReducer;

    if (! this.options.withPage) {
      this.parse = this.options.parse || (a => a);
    }
  }

  get isListActions() {
    return true;
  }

  get reducer() {
    return combineReducers(this.reducerObject);
  }
  get reducerObject() {
    return listReducersFactory(this.baseName, this.itemsReducer);
  }
  get actionsType() {
    return 'list';
  }
}

export default ListActions;
