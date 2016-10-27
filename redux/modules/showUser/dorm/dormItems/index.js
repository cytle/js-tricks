import {
  Button,
} from 'widget/react/bootstrap';

import {
  dormItemStatus,
  transDormItemStatus
} from '../../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
} from 'widget/ezList/components';

import {
  getSelectOptions,
  connectEntity,
  splitIds
} from '../../../../libs/functions';

import {
    dormItemDrink
} from '../../../../drinks';

// 可以选择的流水类型
const statusOptions = getSelectOptions({
  selectValues: Object.keys(dormItemStatus),
  withAllOptions: true,
  transFunc: transDormItemStatus,
});

const getHandleFetch = (dorm, dispatch) => (where = {}) => {
  if (! dorm || ! dorm.dormId) {
    return false;
  }
  if (where.rids) {
    where = Object.assign({}, where, {
      rids: splitIds(where.rids)
    });
  }
  return dispatch(dormItemDrink.query(dorm.dormId, where));
};

const DormItem = (props) => {
  const {
    dorm,
    dormItems,
    location,
    children,
    dispatch,
  } = props;

  const {
    rids,
    status,
    isEmpty
  } = location.query;


  const handleFetch = getHandleFetch(dorm, dispatch);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={dormItems.isFetching}
      >
        <FormGroup controlId="dormDormItemTradeNo" label="商品id">
          <FormControl
            type="text"
            placeholder="多个用逗号隔开"
            name="rids"
            defaultValue={rids}
          />
        </FormGroup>

        <FormGroup controlId="dormDormItemStatus" label="状态">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={statusOptions}
          />
        </FormGroup>
        <FormGroup controlId="dormDormItemIsEmpty" label="库存">
          <FormControl
            componentClass="select"
            name="isEmpty"
            defaultValue={isEmpty}
          >
            <option value="">全部</option>
            <option value="0">有</option>
            <option value="1">无</option>
          </FormControl>
        </FormGroup>

        <FormGroup controlId="dormDormItemSubmit" >
          <Button type="submit" bsSize="small">
            查询
          </Button>
        </FormGroup>

      </SearchForm>
      <List
        list={dormItems}
        onFetch={handleFetch}
        theadData={[
          '商品id',
          '商品名称',
          '状态',
          '库存',
          '价格',
        ]}
        tbodyDataItemCallBack={
          item => [
            item.rid,
            item.repoName,
            transDormItemStatus(item.status),
            item.stock,
            item.price,
          ]
        }
      />

      <hr />

      {children}
    </div>
  );
};

DormItem.propTypes = {
  dorm: React.PropTypes.object,
  dormItems: React.PropTypes.array,
  dispatch: React.PropTypes.fun,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(DormItem, ['dorm', 'dormItems']);

