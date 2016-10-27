import {
  Button,
} from 'widget/react/bootstrap';

import {
  transOrderType,
  transOrderStatus,
  orderStatus,
} from '../../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
  DatepickerRange,
} from 'widget/ezList/components';

import { orderDrink } from '../../../../drinks';

import {
  connectEntity,
  splitIds,
  getSelectOptions,
  transCentMoney,
} from '../../../../libs/functions';


const selectOrderStatusOptions = getSelectOptions({
  selectValues: Object.keys(orderStatus),
  withAllOptions: true,
  transFunc: transOrderStatus,
});

const selectOrderTypeOptions = getSelectOptions({
  selectValues: [
    'SHOP_YEMAO',
    'SHOP_DRINK',
    'SHOP_CAMPUS',
    'B2C_MALL',
    'ACTIVITY_FOLIVORA',
    'PHONE_BILL',
    'PHONE_FLOW',
    'GAME',
    'ONE_CARD_ALL',
    'BOX',
    'ONE_DREAM',
    'PRINT_DOC',
    'PRINT_PHOTO',
    'MK',
    'MK_GROUP',
    'MK_SITE_GROUP',
  ],
  withAllOptions: true,
  transFunc: transOrderType,
});

const getHandleFetch = (uid, dispatch) => (where = {}) => {
  if (where.ids) {
    where = Object.assign({}, where, {
      ids: splitIds(where.ids)
    });
  }
  return dispatch(orderDrink.queryUserOrders(uid, where));
};

const getCreateHref = (uid, history, query) => (id) => {
  return history.createHref(
      `/custom/query/users/${uid}/buyer/orders/${id}`,
      query
    );
};

const Orders = (props, {
  uid,
  location,
  dispatch,
  history
}) => {
  const {
    userOrders,
    children,
  } = props;

  const {
    ids,
    type,
    status,
    createBeginDate,
    createEndDate,
  } = location.query;

  const handleFetch = getHandleFetch(uid, dispatch);
  const createHref = getCreateHref(uid, history, location.query);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={userOrders.isFetching}
      >
        <FormGroup controlId="userOrdersId" label="订单ID：">
          <FormControl
            type="text"
            placeholder="多个订单逗号隔开"
            name="ids"
            defaultValue={ids}
          />
        </FormGroup>
        <FormGroup controlId="userOrdersType" label="订单类型：">
          <FormControl
            componentClass="select"
            name="type"
            defaultValue={type}
            options={selectOrderTypeOptions}
          />
        </FormGroup>
        <FormGroup controlId="userOrdersStatus" label="订单状态：">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={selectOrderStatusOptions}
          />
        </FormGroup>
        <FormGroup controlId="userOrdersCreateDate" label="下单时间：">
          <DatepickerRange
            inline
            startName="createBeginDate"
            endName="createEndDate"
            defaultValue={{ dateStart: createBeginDate, dateEnd: createEndDate }}
          />
        </FormGroup>

        <FormGroup controlId="dormOrdersSubmit" >
          <Button type="submit" bsSize="small">
            查询
          </Button>
        </FormGroup>
      </SearchForm>
      <List
        list={userOrders}
        onFetch={handleFetch}
        theadData={[
          '下单时间',
          '订单号',
          '订单类型',
          '订单状态',
          '订单金额',
          '实付金额',
          '详情',
        ]}

        tbodyDataItemCallBack={
          item => [
            item.createTime,
            item.id,
            transOrderType(item.type),
            transOrderStatus(item.status),
            transCentMoney(item.orderAmount),
            transCentMoney(item.payAmount),
            <a href={createHref(item.id)}>详情</a>
          ]
        }
      />
      <hr />

      {children}
    </div>
  );
};


Orders.propTypes = {
  userOrders: React.PropTypes.object,
  children: React.PropTypes.any,
};


Orders.contextTypes = {
  uid: React.PropTypes.string,

  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
};

export default connectEntity(Orders, ['userOrders']);

