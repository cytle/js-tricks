import {
  Button,
} from 'widget/react/bootstrap';


import { transOrderType, transOrderStatus, orderStatus } from '../../../../consts';

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
  transCentMoney
} from '../../../../libs/functions';

// 可以选择的订单类型
const selectOrderType = [
  'SHOP_YEMAO',
  'SHOP_DRINK',
  'PRINT_DOC',
  'PRINT_PHOTO',
];

const selectOrderStatusOptions = getSelectOptions({
  selectValues: Object.keys(orderStatus),
  withAllOptions: true,
  transFunc: transOrderStatus,
});
const selectOrderTypeOptions = getSelectOptions({
  selectValues: selectOrderType,
  withAllOptions: true,
  transFunc: transOrderType,
});

const getHandleFetch = (uid, dispatch) => (where = {}) => {
  if (where.ids) {
    where = Object.assign({}, where, {
      ids: splitIds(where.ids)
    });
  }
  return dispatch(orderDrink.queryDormOrders(uid, where));
};

const getCreateHref = (uid, history, query) => (id) => {
  return history.createHref(
      `/custom/query/users/${uid}/dorm/orders/${id}`,
      query
    );
};


const Orders = (props) => {
  const {
    dormOrders,
    location,
    children,
    dispatch,
    params,
    history
  } = props;

  const {
    ids,
    type,
    status,
    createBeginDate,
    createEndDate,
  } = location.query;


  const handleFetch = getHandleFetch(params.uid, dispatch);
  const createHref = getCreateHref(params.uid, history, location.query);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={dormOrders.isFetching}
      >
        <FormGroup controlId="dormOrdersId" label="订单ID：">
          <FormControl
            type="text"
            placeholder="多个订单逗号隔开"
            name="ids"
            defaultValue={ids}
          />
        </FormGroup>
        <FormGroup controlId="dormOrdersType" label="订单类型：">
          <FormControl
            componentClass="select"
            name="type"
            defaultValue={type}
            options={selectOrderTypeOptions}
          />
        </FormGroup>
        <FormGroup controlId="dormOrdersStatus" label="订单状态：">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={selectOrderStatusOptions}
          />
        </FormGroup>
        <FormGroup controlId="dormOrdersCreateDate" label="下单时间：">
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
        onFetch={handleFetch}
        list={dormOrders}
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
  dormOrders: React.PropTypes.object,
  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(Orders, ['dormOrders']);

