require('./style.css');

import React, { Component } from 'widget/react';
import { Route, IndexRoute, IndexRedirect } from 'widget/react/router';
import { Provider } from 'widget/reactRedux';
import Frame from 'widget/frame';

import configureStore from './configureStore';


import Find from './modules/find';
import Show from './modules/showUser';


import Supplier from './modules/showUser/supplier';
import Dorm from './modules/showUser/dorm';
import User from './modules/showUser/user';
import Buyer from './modules/showUser/buyer';


import OrdersShow from './modules/orders/show';
import PurchaseOrdersShow from './modules/purchaseOrders/show';

import UserBaseInfo from './modules/showUser/userBaseInfo';
import UserFinance from './modules/showUser/user/finance';
import UserWithdraw from './modules/showUser/user/withdraw';

import UserOrders from './modules/showUser/buyer/orders';


import DormOrders from './modules/showUser/dorm/orders';
import DormPurchaseOrders from './modules/showUser/dorm/purchaseOrders';
import DormInfo from './modules/showUser/dorm/info';
import DormItems from './modules/showUser/dorm/dormItems';
import DormWarehouses from './modules/showUser/dorm/warehouses';
import DormBoxs from './modules/showUser/dorm/boxs';
import DormTransactionRecords from './modules/showUser/dorm/dormTransactionRecords';

import SupplierInfo from './modules/showUser/supplier/info';
import WarehousePurchaseOrders from './modules/showUser/supplier/warehouse/purchaseOrders';

import { connectEntity } from './libs/functions';

const store = configureStore();

// 注入 dispatch
class Con extends Component {
  getChildContext() {
    return { dispatch: this.props.dispatch };
  }
  render() {
    return this.props.children;
  }
}

Con.propTypes = {
  children: React.PropTypes.object,
  dispatch: React.PropTypes.function,
};
Con.childContextTypes = {
  dispatch: React.PropTypes.string
};

const CCon = connectEntity(Con);


const App = (props) => {
  return (
    <Frame crumb={['客服', '查询']} >
      <Provider store={store}>
        <div className="custom-query">
          <CCon {...props} />
        </div>
      </Provider>
    </Frame>
  );
};


const route = (
  <Route path="/custom/query" component={App} >

    <IndexRoute component={Find} />
    <Route path="users/:uid" component={Show} >
      <IndexRedirect to="user/withdraw" />

      <Route path="user" components={{ header: UserBaseInfo, main: User }} >
        <IndexRedirect to="withdraw" />
        <Route path="withdraw" component={UserWithdraw} />
        <Route path="finance" component={UserFinance} />
      </Route>
      <Route path="buyer" components={{ header: UserBaseInfo, main: Buyer }} >
        <IndexRedirect to="orders" />
        <Route path="orders" component={UserOrders} >
          <Route path=":id" component={OrdersShow} />
        </Route>
      </Route>

      <Route path="dorm" components={{ header: UserBaseInfo, main: Dorm }} >
        <IndexRedirect to="info" />
        <Route path="info" component={DormInfo} />
        <Route path="warehouses" component={DormWarehouses} />
        <Route path="orders" component={DormOrders} >
          <Route path=":id" component={OrdersShow} />
        </Route>
        <Route path="dormTransactionRecords" component={DormTransactionRecords} />

        <Route path="purchaseOrders" component={DormPurchaseOrders} >
          <Route path=":id" component={PurchaseOrdersShow} />
        </Route>
        <Route path="dormItems" component={DormItems} />
        <Route path="boxs" component={DormBoxs} />

      </Route>

      <Route path="supplier" components={{ header: UserBaseInfo, main: Supplier }} >
        <IndexRedirect to="info" />
        <Route path="info" component={SupplierInfo} />
        <Route path="warehouse/purchaseOrders" component={WarehousePurchaseOrders} >
          <Route path=":id" component={PurchaseOrdersShow} />
        </Route>
      </Route>

    </Route>

  </Route>
);

module.exports = route;
