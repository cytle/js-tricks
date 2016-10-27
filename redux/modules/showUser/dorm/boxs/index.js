import {
  Button,
} from 'widget/react/bootstrap';

import {
  List,
  FormGroup,
  FormControl,
  SearchForm,
} from 'widget/ezList/components';

import {
  getSelectOptions,
  connectEntity,
} from '../../../../libs/functions';


import {
  boxStatus,
  transBoxStatus
} from '../../../../consts';


import {
    boxDrink
} from '../../../../drinks';

// 可以选择的流水类型
const statusOptions = getSelectOptions({
  selectValues: Object.keys(boxStatus),
  withAllOptions: true,
  transFunc: transBoxStatus,
});


const getHandleFetch = (dorm, dispatch) => (where = {}) => {
  if (! dorm || ! dorm.dormId) {
    return false;
  }
  return dispatch(boxDrink.query(dorm.dormId, where));
};


const Box = (props) => {
  const {
    dorm,
    dormBoxs,
    dispatch,
    location,
    children,
  } = props;
  const {
    status
  } = location.query;

  const handleFetch = getHandleFetch(dorm, dispatch);

  return (
    <div>
      <SearchForm
        inline
        onSubmit={handleFetch}
        isFetching={dormBoxs.isFetching}
      >
        <FormGroup controlId="dormBoxStatus" label="状态">
          <FormControl
            componentClass="select"
            name="status"
            defaultValue={status}
            options={statusOptions}
          />
        </FormGroup>

        <FormGroup controlId="dormBoxSubmit" >
          <Button type="submit" bsSize="small">
            查询
          </Button>
        </FormGroup>

      </SearchForm>
      <List
        list={dormBoxs}
        onFetch={handleFetch}
        theadData={[
          '盒子id',
          '盒子名称',
          '状态',
        ]}
        tbodyDataItemCallBack={
          item => [
            item.id,
            item.name,
            transBoxStatus(item.status),
          ]
        }
      />

      <hr />

      {children}
    </div>
  );
};

Box.propTypes = {
  dorm: React.PropTypes.object,
  dormBoxs: React.PropTypes.array,
  dispatch: React.PropTypes.fun,
  params: React.PropTypes.object,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  children: React.PropTypes.any,

};


export default connectEntity(Box, ['dorm', 'dormBoxs']);

