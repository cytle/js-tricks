import { combineReducers } from 'widget/redux';
import entities from './entities';
import app from './app';

const rootReducers = combineReducers({
  app,
  entities,
});

export default rootReducers;
