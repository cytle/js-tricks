import {
  Checkbox,
  Button,
  Col,
  ControlLabel
} from 'widget/react/bootstrap';

import {
  transCashType
} from '../../../consts';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
  MultiLevelCheckboxs as CheckboxGroup,
  DatepickerRange,
} from 'widget/ezList/components';

import {
  connectEntity,
  formatTime,
  splitIds
} from '../../../libs/functions';

import {
    dormTransactionRecordDrink
} from '../../../drinks';

const cashCheckbox = val => (<Checkbox inline value={val}>{transCashType(val)}</Checkbox>);
const getCashCheckboxs = (values) => values.map(cashCheckbox);


const getHandleFetch = (dorm, dispatch) => (where = {}) => {
  if (! dorm || ! dorm.dormId) {
    return false;
  }
  if (where.types) {
    where = Object.assign({}, where, {
      types: splitIds(where.types)
        .map(type => parseInt(type, 10))
        .filter(type => ! Number.isNaN(type))
    });
  }
  return dispatch(dormTransactionRecordDrink.query(dorm.dormId, where));
};


const Records = (props) => {
  const {
    dorm,
    dispatch,
    children,
    location,
    dormTransactionRecords: records
  } = props;

  const {
    tradeNo,
    startTime,
    endTime,
    types,
  } = location.query;

  const handleFetch = getHandleFetch(dorm, dispatch);
  const typesArr = types ? splitIds(types) : [];

  return (
    <div>
      <SearchForm
        onSubmit={handleFetch}
        isFetching={records.isFetching}
        horizontal
      >
        <FormGroup controlId="dormRecordsTradeNo">
          <Col componentClass={ControlLabel} sm={1}>
            相关流水号
          </Col>
          <Col sm={5}>
            <FormControl
              type="text"
              placeholder="请输入流水号"
              name="tradeNo"
              defaultValue={tradeNo}
            />
          </Col>
        </FormGroup>
        <FormGroup controlId="dormRecordsCreateDate">
          <Col componentClass={ControlLabel} sm={1}>
            流水时间
          </Col>
          <Col sm={5}>
            <DatepickerRange
              inline
              startName="startTime"
              endName="endTime"
              defaultValue={{ dateStart: startTime, dateEnd: endTime }}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="dormRecordsTypes">
          <Col componentClass={ControlLabel} md={1}>
            流水类型
          </Col>
          <Col sm={8}>
            <CheckboxGroup
              name="types"
              open
              defaultCheckedValues={typesArr}
            >
              <CheckboxGroup text="经营相关" value="经营相关" >
                <CheckboxGroup text="销售" value="销售" >
                  {getCashCheckboxs([200, 208, 215, 216])}
                </CheckboxGroup>
                <CheckboxGroup text="利润" value="利润" >
                  {getCashCheckboxs([201, 202, 209, 213, 217])}
                </CheckboxGroup>
                <CheckboxGroup text="补贴" value="补贴" >
                  {getCashCheckboxs([210, 211, 214, 218, 221])}
                </CheckboxGroup>
                <CheckboxGroup text="货到付款（扫码付）" value="111" />
              </CheckboxGroup>

              <CheckboxGroup text="库存相关" value="库存相关" >
                <CheckboxGroup text="进货" value="进货">
                  {getCashCheckboxs([150, 152, 154, 156, 158, 162])}
                </CheckboxGroup>
                <CheckboxGroup text="退货" value="退货">
                  {getCashCheckboxs([151, 153, 155, 157, 159, 163])}
                </CheckboxGroup>
                <CheckboxGroup text="转移库存" value="转移库存">
                  {getCashCheckboxs([160, 161])}
                </CheckboxGroup>
                <CheckboxGroup text="分期购" value="分期购">
                  {getCashCheckboxs([164, 165, 166, 167])}
                </CheckboxGroup>
              </CheckboxGroup>

              <CheckboxGroup text="金融相关" value="金融相关" >

                <CheckboxGroup text="充值" value="充值">
                  {getCashCheckboxs([100, 104])}
                </CheckboxGroup>
                <CheckboxGroup text="提现" value="101" />
                <CheckboxGroup text="借款" value="借款">
                  {getCashCheckboxs([102, 109])}
                </CheckboxGroup>
                <CheckboxGroup text="还款" value="还款">
                  {getCashCheckboxs([103, 110, 112])}
                </CheckboxGroup>
                <CheckboxGroup text="关闭贷款" value="107" />
              </CheckboxGroup>

              <CheckboxGroup text="其他" value="其他" >
                {getCashCheckboxs([212, 250, 211])}
              </CheckboxGroup>

            </CheckboxGroup>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col smOffset={1} sm={11}>
            <Button type="submit">
              查询
            </Button>
          </Col>
        </FormGroup>

      </SearchForm>
      <List
        list={records}
        theadData={[
          '流水时间',
          '类型',
          '改变金额',
          '改变后余额',
          '相关流水号',
          '店长备注',
        ]}
        tbodyDataItemCallBack={
          item => [
            formatTime(item.time * 1000),
            transCashType(item.type),
            item.change,
            item.money,
            item.trade_no,
            item.remark
          ]
        }
        onFetch={handleFetch}
      />

      <hr />

      {children}
    </div>
  );
};

Records.propTypes = {
  dorm: React.PropTypes.object,
  dormTransactionRecords: React.PropTypes.array,
  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(Records, ['dorm', 'dormTransactionRecords']);

