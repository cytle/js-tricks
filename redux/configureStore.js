import { createStore, applyMiddleware, compose } from 'widget/redux';
import thunkMiddleware from 'widget/reduxThunk';
// import createLogger from 'widget/reduxLogger';
import reducers from './reducers/index';

// const loggerMiddleware = createLogger();

const middleware = [
  thunkMiddleware,
  // loggerMiddleware
];

export default function configureStore(initialState) {
  return createStore(reducers, initialState, compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
}
