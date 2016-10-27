import {
  Button,
} from 'widget/react/bootstrap';

import { transWithdrawApplyStatusMap } from '../../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
  DatepickerRange,
} from 'widget/ezList/components';

import { withdrawDrink } from '../../../../drinks';

import { connectEntity, getSelectOptions } from '../../../../libs/functions';


const selectStatusOptions = getSelectOptions({
  selectValues: [
    'verifying',
    'cancel',
    'fail',
    'pending',
    'success',
  ],
  withAllOptions: true,
  transFunc: transWithdrawApplyStatusMap,
});

const getHandleFetch = (uid, dispatch) => (where = {}) => {
  return dispatch(withdrawDrink.query(uid, where));
};

const WithdrawList = (props) => {
  const {
    location,
    withdrawList,
    children,
    params,
    dispatch
  } = props;

  const {
    status,
    start_time,
    end_time,
  } = location.query;

  const handleFetch = getHandleFetch(params.uid, dispatch);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={withdrawList.isFetching}
      >
        <FormGroup controlId="withdrawListStatus" label="提现状态：">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={selectStatusOptions}
          />
        </FormGroup>
        <FormGroup controlId="withdrawListCreateDate" label="申请提现时间：">
          <DatepickerRange
            inline
            startName="start_time"
            endName="end_time"
            defaultValue={{ dateStart: start_time, dateEnd: end_time }}
            withoutTime="true"
          />
        </FormGroup>

        <FormGroup controlId="dormWithdrawListSubmit" >
          <Button type="submit" bsSize="small">
            查询
          </Button>
        </FormGroup>
      </SearchForm>
      <List
        list={withdrawList}
        onFetch={handleFetch}
        theadData={[
          '序号',
          '流水号',
          '提现金额',
          '银行卡号',
          '开户银行',
          '开户网点',
          '开户城市',

          '申请提现时间',
          '打款处理时间',
          '操作人',
          '打款状态',
          '退款时间',
          '打款说明',
        ]}

        tbodyDataItemCallBack={
          (item, index) => [
            index + 1,
            item.trade_no,
            item.amount,
            item.bank_card,
            item.bank_name,
            item.bank_site,
            item.bank_city,

            item.apply_time,
            item.handle_time,
            item.handler,
            item.status_desc,
            item.refund_time,
            item.result_msg,

          ]
        }
      />
      <hr />

      {children}
    </div>
  );
};

WithdrawList.propTypes = {
  withdrawList: React.PropTypes.object,

  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};

export default connectEntity(WithdrawList, ['withdrawList']);

