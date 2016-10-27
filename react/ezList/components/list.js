import { Component, PropTypes } from 'widget/react';
import Table from './table';
import {
  Row,
  Col,
  Pagination,
} from 'widget/react/bootstrap';
import IconLoading from './iconLoading';

/**
 * <List
 *   list={this.props.orders}
 *   theadData={[
 *     '下单时间',
 *     '订单号',
 *     '订单类型',
 *     '订单状态',
 *     '订单金额',
 *     '实付金额',
 *     '详情',
 *   ]}
 *   tbodyDataItemCallBack={
 *     item => [
 *       item.createTime,
 *       item.id,
 *       transOrderType(item.type),
 *       transOrderStatus(item.status),
 *       item.orderAmount,
 *       item.payAmount,
 *       <a href={this.createHref(item.id)}>详情</a>
 *     ]
 *   }
 *   onFetch={handleFetch} // 获取表单方法
 * />
 */
class List extends Component {
  constructor() {
    super();

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeLimit = this.handleChangeLimit.bind(this);
  }

  getDefaultProps() {
    return {
      list: {
        currentPage: 1,
        didInvalidate: true,
        isFetching: false,
        items: [],
        lastUpdated: 0,
        prePage: 10,
        total: 0,
        lastPage: 0,
      },
    };
  }

  getInitialState() {
    return {};
  }
  componentDidMount() {
    this.autoFetch();
  }
  componentDidUpdate() {
    this.autoFetch();
  }
  fetch(...args) {
    if (! this.props.onFetch) {
      return false;
    }

    return this.props.onFetch(...args);
  }

  autoFetch() {
    const list = this.props.list;
    if (list &&
      (! list.isFetching && list.lastUpdated === 0)) {
      this.fetch(this.context.location.query);
    }
  }

  handleChangePage(page = 1) {
    const { location, history } = this.context;
    const query = Object.assign({}, location.query, { page });

    this.fetch(query);
    history.pushState(null, location.pathname, query);
  }


  handleChangeLimit(e) {
    const limit = parseInt(e.target.value, 10);

    const { location, history } = this.context;
    const query = Object.assign({}, location.query, { limit });

    this.fetch(query);
    history.pushState(null, location.pathname, query);
  }

  render() {
    const list = this.props.list;
    const prePageList = [20, 50, 100];

    return (
      <div style={{ position: 'relative' }}>
        <Table
          striped bordered condensed hover
          theadData={this.props.theadData}
          tbodyData={list.items}
          tbodyDataItemCallBack={this.props.tbodyDataItemCallBack}
        />
        <Row>
          <Col md="5">
            <div
              title={'载入于' + new Date(list.lastUpdated).toLocaleTimeString()}
              style={{ margin: '20px 0' }}
            >
              当前第 {list.currentPage} 页 - 每页
              <select name="limit" value={list.prePage} onChange={this.handleChangeLimit}>
                {prePageList.map(v => <option value={v}>{v}</option>)}
                {(prePageList.indexOf(list.prePage) === -1) ?
                  <option disabled value={list.prePage}>{list.prePage}</option> : ''}
              </select>
               条 - 共 {list.total} 条
            </div>
          </Col>
          <Col md="7" className="text-right">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={5}
              items={list.lastPage}
              className={list.lastPage === 0 ? 'hidden' : ''}
              activePage={list.currentPage}
              onSelect={this.handleChangePage}
            />
          </Col>
        </Row>
        <div
          className={list.isFetching ? '' : 'hidden'}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            top: '0px',
            left: '0px',
            zIndex: '10',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              position: 'absolute',
              zIndex: '11',
              top: '40%',
              color: '#555',
              fontSize: '24px',
            }}
          >
            <IconLoading />
          </span>
        </div>
      </div>
    );
  }

}

List.contextTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
};

List.propTypes = {
  onFetch: PropTypes.func,
  list: PropTypes.object.isRequired,
  theadData: PropTypes.array,
  tbodyDataItemCallBack: PropTypes.func,
};


export default List;
